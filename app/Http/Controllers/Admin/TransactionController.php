<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use App\Models\Customer;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Services\CatalogSyncService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Transaction::query()->with('customer:id,name,phone')->latest();

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $query->paginate(15)->withQueryString(),
            'filters' => ['status' => $status],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Transactions/Form', [
            'transaction' => null,
            'customers' => Customer::query()->orderBy('name')->get(['id', 'name', 'phone', 'vehicle', 'plate_number']),
            'catalog' => CatalogItem::query()->where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'status' => ['required', 'in:draft,unpaid,paid,cancelled'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.catalog_item_id' => ['nullable', 'exists:catalog_items,id'],
            'items.*.name' => ['required', 'string', 'max:180'],
            'items.*.type' => ['required', 'in:sparepart,service_ac,tool_rental,workmanship'],
            'items.*.qty' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        $transaction = DB::transaction(function () use ($data) {
            $transaction = Transaction::query()->create([
                'number' => $this->nextNumber(),
                'customer_id' => $data['customer_id'],
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
                'paid_at' => $data['status'] === 'paid' ? now() : null,
            ]);

            $this->syncItems($transaction, $data['items']);
            $transaction->recalculateTotals();

            return $transaction->fresh('items');
        });

        if ($transaction->status === 'paid') {
            app(CatalogSyncService::class)->syncFromPaidTransaction($transaction);
        }

        return redirect()->route('admin.transactions.show', $transaction)
            ->with('success', 'Transaksi dibuat.');
    }

    public function show(Transaction $transaction): Response
    {
        $transaction->load(['customer', 'items.catalogItem', 'workOrder.mechanic']);

        return Inertia::render('Admin/Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    public function print(Request $request, Transaction $transaction): Response
    {
        abort_unless($transaction->status === 'paid', 403, 'Hanya transaksi lunas yang dapat dicetak.');

        $transaction->load(['customer', 'items', 'workOrder.mechanic']);

        $position = $request->string('position')->toString();
        if (! in_array($position, ['top', 'bottom'], true)) {
            $position = 'top';
        }

        return Inertia::render('Admin/Transactions/Print', [
            'transaction' => $transaction,
            'position' => $position,
            'settings' => \App\Models\SiteSetting::map(),
        ]);
    }

    public function edit(Transaction $transaction): Response
    {
        $transaction->load('items');

        return Inertia::render('Admin/Transactions/Form', [
            'transaction' => $transaction,
            'customers' => Customer::query()->orderBy('name')->get(['id', 'name', 'phone', 'vehicle', 'plate_number']),
            'catalog' => CatalogItem::query()->where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $data = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'status' => ['required', 'in:draft,unpaid,paid,cancelled'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.catalog_item_id' => ['nullable', 'exists:catalog_items,id'],
            'items.*.name' => ['required', 'string', 'max:180'],
            'items.*.type' => ['required', 'in:sparepart,service_ac,tool_rental,workmanship'],
            'items.*.qty' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use ($transaction, $data) {
            $wasPaid = $transaction->status === 'paid';

            $transaction->update([
                'customer_id' => $data['customer_id'],
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
                'paid_at' => $data['status'] === 'paid'
                    ? ($transaction->paid_at ?? now())
                    : null,
            ]);

            $transaction->items()->delete();
            $this->syncItems($transaction, $data['items']);
            $transaction->recalculateTotals();

            if ($data['status'] === 'paid' && ! $wasPaid) {
                app(CatalogSyncService::class)->syncFromPaidTransaction($transaction->fresh('items'));
            }
        });

        return redirect()->route('admin.transactions.show', $transaction)
            ->with('success', 'Transaksi diperbarui.');
    }

    public function markPaid(Transaction $transaction, CatalogSyncService $sync)
    {
        $transaction->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $sync->syncFromPaidTransaction($transaction->fresh('items'));

        return back()->with('success', 'Transaksi ditandai lunas. Item masuk katalog.');
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return redirect()->route('admin.transactions.index')
            ->with('success', 'Transaksi dihapus.');
    }

    protected function syncItems(Transaction $transaction, array $items): void
    {
        foreach ($items as $item) {
            $qty = (float) $item['qty'];
            $price = (float) $item['unit_price'];

            TransactionItem::query()->create([
                'transaction_id' => $transaction->id,
                'catalog_item_id' => $item['catalog_item_id'] ?? null,
                'name' => $item['name'],
                'type' => $item['type'],
                'qty' => $qty,
                'unit_price' => $price,
                'line_total' => $qty * $price,
            ]);
        }
    }

    protected function nextNumber(): string
    {
        $seq = Transaction::query()->whereDate('created_at', today())->count() + 1;

        return 'TRX-'.now()->format('Ymd').'-'.str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }
}
