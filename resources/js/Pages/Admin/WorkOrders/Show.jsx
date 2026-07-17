import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { statusBadge, StatusTimeline, typeLabel, btnGhost, btnPrimary } from '../../../Components/ui';

export default function WorkOrderShow({ workOrder }) {
    return (
        <AdminLayout title={workOrder.number}>
            <Head title={workOrder.number} />
            <div className="mb-4 flex flex-wrap gap-2">
                <Link href={`/admin/work-orders/${workOrder.id}/edit`} className={btnGhost}>
                    Edit SPK
                </Link>
                <Link href={`/admin/work-orders/${workOrder.id}/print?position=top`} className={btnPrimary}>
                    Cetak SPK (½ A4)
                </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="surface-panel space-y-3 rounded-sm p-5">
                    <div>{statusBadge(workOrder.status)}</div>
                    <p className="text-xs uppercase tracking-wider text-mist">Pelanggan</p>
                    <p className="text-lg text-ivory">{workOrder.customer?.name}</p>
                    <p className="text-sm text-mist">{workOrder.customer?.phone}</p>
                    <p className="text-sm text-mist">
                        {workOrder.vehicle || '-'} · {workOrder.plate_number || '-'}
                    </p>
                    <p className="pt-2 text-xs uppercase tracking-wider text-mist">Mekanik</p>
                    <p className="text-ivory">{workOrder.mechanic?.name || 'Belum ditugaskan'}</p>
                    {workOrder.transaction && (
                        <Link href={`/admin/transactions/${workOrder.transaction.id}`} className="block text-sm text-brass">
                            Transaksi {workOrder.transaction.number}
                        </Link>
                    )}
                </div>
                <div className="space-y-6 lg:col-span-2">
                    <div className="surface-panel rounded-sm p-5">
                        <h2 className="mb-4 font-display text-2xl">Progress</h2>
                        <StatusTimeline status={workOrder.status} />
                    </div>
                    <div className="surface-panel rounded-sm p-5">
                        <h2 className="mb-2 font-display text-2xl">Deskripsi</h2>
                        <p className="whitespace-pre-wrap text-mist">{workOrder.description || '—'}</p>
                    </div>
                    {workOrder.transaction?.items?.length > 0 && (
                        <div className="surface-panel rounded-sm p-5">
                            <h2 className="mb-3 font-display text-2xl">Item terkait</h2>
                            {workOrder.transaction.items.map((item) => (
                                <p key={item.id} className="border-b border-steel/40 py-2 text-sm text-mist">
                                    {item.name} · {typeLabel(item.type)} · qty {item.qty}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
