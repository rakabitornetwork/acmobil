<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Mechanic;
use App\Models\Transaction;
use App\Models\WorkOrder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $now = now()->locale('id');
        $monthStart = $now->copy()->startOfMonth();
        $prevMonthStart = $now->copy()->subMonthNoOverflow()->startOfMonth();
        $prevMonthEnd = $now->copy()->subMonthNoOverflow()->endOfMonth();
        $todayStart = $now->copy()->startOfDay();
        $todayEnd = $now->copy()->endOfDay();
        $weekStart = $now->copy()->subDays(6)->startOfDay();

        $customers = Customer::query()->count();
        $customersPrev = Customer::query()
            ->where('created_at', '<', $monthStart)
            ->count();

        $txMonth = Transaction::query()->where('created_at', '>=', $monthStart)->count();
        $txPrevMonth = Transaction::query()
            ->whereBetween('created_at', [$prevMonthStart, $prevMonthEnd])
            ->count();

        $revenuePaid = (float) Transaction::query()
            ->where('status', 'paid')
            ->where('paid_at', '>=', $monthStart)
            ->sum('total');
        $revenuePrev = (float) Transaction::query()
            ->where('status', 'paid')
            ->whereBetween('paid_at', [$prevMonthStart, $prevMonthEnd])
            ->sum('total');

        $spkActive = WorkOrder::query()->whereIn('status', ['pending', 'in_progress'])->count();
        $spkDoneMonth = WorkOrder::query()
            ->where('status', 'done')
            ->where('completed_at', '>=', $monthStart)
            ->count();

        $unpaidTotal = (float) Transaction::query()
            ->whereIn('status', ['draft', 'unpaid'])
            ->sum('total');
        $unpaidCount = Transaction::query()
            ->whereIn('status', ['draft', 'unpaid'])
            ->count();

        $mechanicsActive = Mechanic::query()->where('is_active', true)->count();

        $txByStatus = Transaction::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $spkByStatus = WorkOrder::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $revenueSeries = $this->dailyPaidRevenue($weekStart, $todayEnd);
        $txSeries = $this->dailyTransactionCounts($weekStart, $todayEnd);

        return Inertia::render('Admin/Dashboard', [
            'widgets' => [
                [
                    'key' => 'customers',
                    'label' => 'Pelanggan',
                    'value' => $customers,
                    'display' => (string) $customers,
                    'href' => '/admin/customers',
                    'hint' => 'Total terdaftar',
                    'delta' => $this->deltaPercent($customers - $customersPrev, max(1, $customersPrev)),
                    'tone' => 'brass',
                ],
                [
                    'key' => 'transactions_month',
                    'label' => 'Transaksi bulan ini',
                    'value' => $txMonth,
                    'display' => (string) $txMonth,
                    'href' => '/admin/transactions',
                    'hint' => $now->translatedFormat('F Y'),
                    'delta' => $this->deltaPercent($txMonth - $txPrevMonth, max(1, $txPrevMonth)),
                    'tone' => 'ivory',
                ],
                [
                    'key' => 'revenue_paid',
                    'label' => 'Pendapatan lunas',
                    'value' => $revenuePaid,
                    'display' => $this->rupiah($revenuePaid),
                    'href' => '/admin/transactions?status=paid',
                    'hint' => 'Bulan berjalan',
                    'delta' => $this->deltaPercent($revenuePaid - $revenuePrev, max(1, $revenuePrev)),
                    'tone' => 'success',
                ],
                [
                    'key' => 'spk_active',
                    'label' => 'SPK aktif',
                    'value' => $spkActive,
                    'display' => (string) $spkActive,
                    'href' => '/admin/work-orders',
                    'hint' => $spkDoneMonth.' selesai bulan ini',
                    'delta' => null,
                    'tone' => 'warning',
                ],
                [
                    'key' => 'unpaid',
                    'label' => 'Piutang terbuka',
                    'value' => $unpaidTotal,
                    'display' => $this->rupiah($unpaidTotal),
                    'href' => '/admin/transactions?status=unpaid',
                    'hint' => $unpaidCount.' transaksi draf/belum lunas',
                    'delta' => null,
                    'tone' => 'danger',
                ],
                [
                    'key' => 'mechanics',
                    'label' => 'Mekanik aktif',
                    'value' => $mechanicsActive,
                    'display' => (string) $mechanicsActive,
                    'href' => '/admin/mechanics',
                    'hint' => 'Siap ditugaskan',
                    'delta' => null,
                    'tone' => 'brass',
                ],
            ],
            'charts' => [
                'revenue_7d' => $revenueSeries,
                'transactions_7d' => $txSeries,
            ],
            'breakdowns' => [
                'transactions' => [
                    ['key' => 'draft', 'label' => 'Draf', 'count' => (int) ($txByStatus['draft'] ?? 0)],
                    ['key' => 'unpaid', 'label' => 'Belum Lunas', 'count' => (int) ($txByStatus['unpaid'] ?? 0)],
                    ['key' => 'paid', 'label' => 'Lunas', 'count' => (int) ($txByStatus['paid'] ?? 0)],
                    ['key' => 'cancelled', 'label' => 'Dibatalkan', 'count' => (int) ($txByStatus['cancelled'] ?? 0)],
                ],
                'work_orders' => [
                    ['key' => 'pending', 'label' => 'Menunggu', 'count' => (int) ($spkByStatus['pending'] ?? 0)],
                    ['key' => 'in_progress', 'label' => 'Dikerjakan', 'count' => (int) ($spkByStatus['in_progress'] ?? 0)],
                    ['key' => 'done', 'label' => 'Selesai', 'count' => (int) ($spkByStatus['done'] ?? 0)],
                    ['key' => 'cancelled', 'label' => 'Dibatalkan', 'count' => (int) ($spkByStatus['cancelled'] ?? 0)],
                ],
            ],
            'today_schedule' => WorkOrder::query()
                ->with(['customer:id,name', 'mechanic:id,name'])
                ->whereBetween('scheduled_at', [$todayStart, $todayEnd])
                ->whereNotIn('status', ['cancelled'])
                ->orderBy('scheduled_at')
                ->limit(6)
                ->get(),
            'recent_transactions' => Transaction::query()
                ->with('customer:id,name,phone')
                ->latest()
                ->limit(6)
                ->get(),
            'active_spk' => WorkOrder::query()
                ->with(['customer:id,name', 'mechanic:id,name'])
                ->whereIn('status', ['pending', 'in_progress'])
                ->latest()
                ->limit(6)
                ->get(),
            'meta' => [
                'generated_at' => $now->toIso8601String(),
                'period_label' => $now->translatedFormat('F Y'),
            ],
        ]);
    }

    /** @return list<array{date: string, label: string, total: float}> */
    protected function dailyPaidRevenue(Carbon $from, Carbon $to): array
    {
        $rows = Transaction::query()
            ->selectRaw('DATE(paid_at) as day, SUM(total) as total')
            ->where('status', 'paid')
            ->whereNotNull('paid_at')
            ->whereBetween('paid_at', [$from, $to])
            ->groupBy('day')
            ->pluck('total', 'day');

        return $this->fillDailySeries($from, $to, $rows);
    }

    /** @return list<array{date: string, label: string, total: float}> */
    protected function dailyTransactionCounts(Carbon $from, Carbon $to): array
    {
        $rows = Transaction::query()
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('day')
            ->pluck('total', 'day');

        return $this->fillDailySeries($from, $to, $rows);
    }

    /**
     * @param  \Illuminate\Support\Collection<string, mixed>  $rows
     * @return list<array{date: string, label: string, total: float}>
     */
    protected function fillDailySeries(Carbon $from, Carbon $to, $rows): array
    {
        $series = [];
        $cursor = $from->copy()->startOfDay();

        while ($cursor->lte($to)) {
            $key = $cursor->toDateString();
            $series[] = [
                'date' => $key,
                'label' => $cursor->translatedFormat('D'),
                'total' => (float) ($rows[$key] ?? 0),
            ];
            $cursor->addDay();
        }

        return $series;
    }

    protected function deltaPercent(float $diff, float $base): ?array
    {
        $percent = round(($diff / $base) * 100, 1);

        return [
            'value' => $percent,
            'direction' => $percent > 0 ? 'up' : ($percent < 0 ? 'down' : 'flat'),
            'label' => ($percent > 0 ? '+' : '').$percent.'% vs bulan lalu',
        ];
    }

    protected function rupiah(float $value): string
    {
        return 'Rp '.number_format($value, 0, ',', '.');
    }
}
