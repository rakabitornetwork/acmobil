import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { StatusTimeline, statusBadge, typeLabel } from '../../Components/ui';

export default function WorkOrderShow({ workOrder }) {
    return (
        <CustomerLayout title={workOrder.number}>
            <Head title={workOrder.number} />
            <Link href="/pelanggan" className="mb-6 inline-block text-sm text-brass">
                ← Kembali
            </Link>

            <div className="mb-6 flex flex-wrap items-center gap-3">
                {statusBadge(workOrder.status)}
                <span className="text-sm text-mist">
                    {workOrder.vehicle || '-'} · {workOrder.plate_number || '-'}
                </span>
            </div>

            <div className="surface-panel mb-6 rounded-sm p-5">
                <h2 className="mb-4 font-display text-2xl">Status pengerjaan</h2>
                <StatusTimeline status={workOrder.status} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="surface-panel rounded-sm p-5">
                    <p className="text-xs uppercase tracking-wider text-mist">Mekanik</p>
                    <p className="mt-2 text-xl text-ivory">{workOrder.mechanic?.name || 'Belum ditugaskan'}</p>
                    {workOrder.mechanic?.phone && <p className="text-sm text-mist">{workOrder.mechanic.phone}</p>}
                </div>
                <div className="surface-panel rounded-sm p-5">
                    <p className="text-xs uppercase tracking-wider text-mist">Jadwal</p>
                    <p className="mt-2 text-ivory">
                        {workOrder.scheduled_at
                            ? new Date(workOrder.scheduled_at).toLocaleString('id-ID')
                            : 'Menyesuaikan antrean bengkel'}
                    </p>
                    {workOrder.started_at && (
                        <p className="mt-2 text-sm text-mist">
                            Mulai: {new Date(workOrder.started_at).toLocaleString('id-ID')}
                        </p>
                    )}
                    {workOrder.completed_at && (
                        <p className="text-sm text-mist">
                            Selesai: {new Date(workOrder.completed_at).toLocaleString('id-ID')}
                        </p>
                    )}
                </div>
            </div>

            <div className="surface-panel mt-6 rounded-sm p-5">
                <h2 className="mb-2 font-display text-2xl">Detail pekerjaan</h2>
                <p className="whitespace-pre-wrap text-mist">{workOrder.description || 'Deskripsi akan diisi oleh bengkel.'}</p>
            </div>

            {workOrder.transaction?.items?.length > 0 && (
                <div className="surface-panel mt-6 rounded-sm p-5">
                    <h2 className="mb-3 font-display text-2xl">Item pekerjaan</h2>
                    {workOrder.transaction.items.map((item) => (
                        <p key={item.id} className="border-b border-steel/40 py-2 text-sm text-mist">
                            {item.name} · {typeLabel(item.type)}
                            {item.qty ? ` · qty ${item.qty}` : ''}
                        </p>
                    ))}
                </div>
            )}
        </CustomerLayout>
    );
}
