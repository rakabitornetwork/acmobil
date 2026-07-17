<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Mechanic;
use App\Models\Transaction;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = WorkOrder::query()
            ->with(['customer:id,name,phone', 'mechanic:id,name', 'transaction:id,number'])
            ->latest();

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        return Inertia::render('Admin/WorkOrders/Index', [
            'workOrders' => $query->paginate(15)->withQueryString(),
            'filters' => ['status' => $status],
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Admin/WorkOrders/Form', [
            'workOrder' => null,
            'customers' => Customer::query()->orderBy('name')->get(['id', 'name', 'phone', 'vehicle', 'plate_number']),
            'mechanics' => Mechanic::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'transactions' => Transaction::query()->with('customer:id,name')->latest()->limit(50)->get(['id', 'number', 'customer_id', 'status']),
            'prefill_transaction_id' => $request->integer('transaction_id') ?: null,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'transaction_id' => ['nullable', 'exists:transactions,id'],
            'mechanic_id' => ['nullable', 'exists:mechanics,id'],
            'status' => ['required', 'in:pending,in_progress,done,cancelled'],
            'vehicle' => ['nullable', 'string', 'max:120'],
            'plate_number' => ['nullable', 'string', 'max:30'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'scheduled_at' => ['nullable', 'date'],
        ]);

        $payload = $this->statusTimestamps($data);

        $workOrder = WorkOrder::query()->create(array_merge($payload, [
            'number' => $this->nextNumber(),
        ]));

        return redirect()->route('admin.work-orders.show', $workOrder)
            ->with('success', 'SPK dibuat.');
    }

    public function show(WorkOrder $workOrder): Response
    {
        $workOrder->load(['customer', 'mechanic', 'transaction.items']);

        return Inertia::render('Admin/WorkOrders/Show', [
            'workOrder' => $workOrder,
        ]);
    }

    public function print(Request $request, WorkOrder $workOrder): Response
    {
        $workOrder->load(['customer', 'mechanic', 'transaction.items']);

        $position = $request->string('position')->toString();
        if (! in_array($position, ['top', 'bottom'], true)) {
            $position = 'top';
        }

        return Inertia::render('Admin/WorkOrders/Print', [
            'workOrder' => $workOrder,
            'position' => $position,
            'settings' => \App\Models\SiteSetting::map(),
        ]);
    }

    public function edit(WorkOrder $workOrder): Response
    {
        return Inertia::render('Admin/WorkOrders/Form', [
            'workOrder' => $workOrder,
            'customers' => Customer::query()->orderBy('name')->get(['id', 'name', 'phone', 'vehicle', 'plate_number']),
            'mechanics' => Mechanic::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'transactions' => Transaction::query()->with('customer:id,name')->latest()->limit(50)->get(['id', 'number', 'customer_id', 'status']),
            'prefill_transaction_id' => null,
        ]);
    }

    public function update(Request $request, WorkOrder $workOrder)
    {
        $data = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'transaction_id' => ['nullable', 'exists:transactions,id'],
            'mechanic_id' => ['nullable', 'exists:mechanics,id'],
            'status' => ['required', 'in:pending,in_progress,done,cancelled'],
            'vehicle' => ['nullable', 'string', 'max:120'],
            'plate_number' => ['nullable', 'string', 'max:30'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'scheduled_at' => ['nullable', 'date'],
        ]);

        $workOrder->update($this->statusTimestamps($data, $workOrder));

        return redirect()->route('admin.work-orders.show', $workOrder)
            ->with('success', 'SPK diperbarui.');
    }

    public function destroy(WorkOrder $workOrder)
    {
        $workOrder->delete();

        return redirect()->route('admin.work-orders.index')
            ->with('success', 'SPK dihapus.');
    }

    protected function statusTimestamps(array $data, ?WorkOrder $existing = null): array
    {
        $status = $data['status'];

        if ($status === 'in_progress') {
            $data['started_at'] = $existing?->started_at ?? now();
            $data['completed_at'] = null;
        } elseif ($status === 'done') {
            $data['started_at'] = $existing?->started_at ?? now();
            $data['completed_at'] = now();
        } elseif ($status === 'pending') {
            $data['started_at'] = null;
            $data['completed_at'] = null;
        } elseif ($status === 'cancelled') {
            $data['completed_at'] = null;
        }

        return $data;
    }

    protected function nextNumber(): string
    {
        $seq = WorkOrder::query()->whereDate('created_at', today())->count() + 1;

        return 'SPK-'.now()->format('Ymd').'-'.str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }
}
