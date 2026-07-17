import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { statusBadge, statusLabel, btnPrimary } from '../../../Components/ui';

export default function WorkOrdersIndex({ workOrders, filters }) {
    return (
        <AdminLayout title="SPK">
            <Head title="SPK" />
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                    {['', 'pending', 'in_progress', 'done', 'cancelled'].map((status) => (
                        <button
                            key={status || 'all'}
                            type="button"
                            onClick={() => router.get('/admin/work-orders', status ? { status } : {}, { preserveState: true })}
                            className={`rounded-sm px-3 py-1.5 text-sm ${
                                (filters.status || '') === status ? 'bg-brass/20 text-brass-light' : 'text-mist'
                            }`}
                        >
                            {statusLabel(status)}
                        </button>
                    ))}
                </div>
                <Link href="/admin/work-orders/create" className={btnPrimary}>
                    Buat SPK
                </Link>
            </div>
            <div className="space-y-3">
                {workOrders.data.map((spk) => (
                    <div
                        key={spk.id}
                        className="surface-panel flex flex-wrap items-center justify-between gap-3 rounded-sm p-4"
                    >
                        <Link href={`/admin/work-orders/${spk.id}`} className="min-w-0 flex-1 hover:text-brass-light">
                            <p className="text-ivory">{spk.number}</p>
                            <p className="text-sm text-mist">
                                {spk.customer?.name} · Mekanik: {spk.mechanic?.name || '—'} · {spk.plate_number || '-'}
                            </p>
                        </Link>
                        <div className="flex items-center gap-3">
                            {statusBadge(spk.status)}
                            <Link
                                href={`/admin/work-orders/${spk.id}/print?position=top`}
                                className="text-xs text-brass hover:text-brass-light"
                            >
                                Cetak
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
