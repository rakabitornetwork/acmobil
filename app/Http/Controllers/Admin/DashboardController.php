<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Transaction;
use App\Models\WorkOrder;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $monthStart = now()->startOfMonth();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'customers' => Customer::query()->count(),
                'transactions_month' => Transaction::query()->where('created_at', '>=', $monthStart)->count(),
                'revenue_paid' => (float) Transaction::query()
                    ->where('status', 'paid')
                    ->where('paid_at', '>=', $monthStart)
                    ->sum('total'),
                'spk_active' => WorkOrder::query()->whereIn('status', ['pending', 'in_progress'])->count(),
            ],
            'recent_transactions' => Transaction::query()
                ->with('customer:id,name,phone')
                ->latest()
                ->limit(5)
                ->get(),
            'active_spk' => WorkOrder::query()
                ->with(['customer:id,name', 'mechanic:id,name'])
                ->whereIn('status', ['pending', 'in_progress'])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
