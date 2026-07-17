import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { statusBadge } from '../../Components/ui';

export default function CustomerDashboard({ customer, active, history }) {
    return (
        <CustomerLayout title={`Halo, ${customer.name}`}>
            <Head title="Portal Pelanggan" />
            <p className="mb-8 text-mist">Pantau progres pengerjaan bengkel untuk kendaraan Anda.</p>

            <section className="mb-10">
                <h2 className="mb-4 font-display text-3xl text-ivory">Sedang dikerjakan</h2>
                <div className="space-y-3">
                    {active.length ? (
                        active.map((spk) => (
                            <Link
                                key={spk.id}
                                href={`/pelanggan/spk/${spk.id}`}
                                className="surface-panel block rounded-sm p-5 transition hover:border-brass/40"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-ivory">{spk.number}</p>
                                        <p className="text-sm text-mist">
                                            Mekanik: {spk.mechanic?.name || 'Menunggu penugasan'} · {spk.plate_number || spk.vehicle || '-'}
                                        </p>
                                    </div>
                                    {statusBadge(spk.status)}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-mist">Tidak ada pekerjaan aktif saat ini.</p>
                    )}
                </div>
            </section>

            <section>
                <h2 className="mb-4 font-display text-3xl text-ivory">Riwayat</h2>
                <div className="space-y-3">
                    {history.length ? (
                        history.map((spk) => (
                            <Link
                                key={spk.id}
                                href={`/pelanggan/spk/${spk.id}`}
                                className="surface-panel block rounded-sm p-5 transition hover:border-brass/40"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-ivory">{spk.number}</p>
                                        <p className="text-sm text-mist">Mekanik: {spk.mechanic?.name || '—'}</p>
                                    </div>
                                    {statusBadge(spk.status)}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-mist">Belum ada riwayat.</p>
                    )}
                </div>
            </section>
        </CustomerLayout>
    );
}
