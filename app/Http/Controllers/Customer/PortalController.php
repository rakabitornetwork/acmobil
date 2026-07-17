<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $customer = $request->user('customer');

        $active = WorkOrder::query()
            ->with('mechanic:id,name')
            ->where('customer_id', $customer->id)
            ->whereIn('status', ['pending', 'in_progress'])
            ->latest()
            ->get();

        $history = WorkOrder::query()
            ->with('mechanic:id,name')
            ->where('customer_id', $customer->id)
            ->whereIn('status', ['done', 'cancelled'])
            ->latest()
            ->limit(20)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'customer' => $customer->only(['id', 'name', 'phone', 'vehicle', 'plate_number']),
            'active' => $active,
            'history' => $history,
        ]);
    }

    public function show(Request $request, WorkOrder $workOrder): Response
    {
        abort_unless($workOrder->customer_id === $request->user('customer')->id, 403);

        $workOrder->load([
            'mechanic:id,name,phone',
            'transaction:id,number,status,created_at',
            'transaction.items:id,transaction_id,name,type,qty',
        ]);

        return Inertia::render('Customer/WorkOrderShow', [
            'workOrder' => $workOrder,
        ]);
    }
}
