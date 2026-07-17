import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { formatRupiah, statusBadge } from '../../Components/ui';

export default function Dashboard({ stats, recent_transactions, active_spk }) {
    const cards = [
        { label: 'Pelanggan', value: stats.customers },
        { label: 'Transaksi bulan ini', value: stats.transactions_month },
        { label: 'Pendapatan lunas', value: formatRupiah(stats.revenue_paid) },
        { label: 'SPK aktif', value: stats.spk_active },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="surface-panel rounded-sm p-5">
                        <p className="text-xs uppercase tracking-wider text-mist">{card.label}</p>
                        <p className="mt-2 font-display text-3xl text-ivory">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <section className="surface-panel rounded-sm p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-display text-2xl">Transaksi terbaru</h2>
                        <Link href="/admin/transactions" className="text-sm text-brass">
                            Lihat semua
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recent_transactions?.length ? (
                            recent_transactions.map((tx) => (
                                <Link
                                    key={tx.id}
                                    href={`/admin/transactions/${tx.id}`}
                                    className="flex items-center justify-between border-b border-steel/50 py-2 text-sm hover:text-brass-light"
                                >
                                    <div>
                                        <p className="text-ivory">{tx.number}</p>
                                        <p className="text-mist">{tx.customer?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        {statusBadge(tx.status)}
                                        <p className="mt-1 text-mist">{formatRupiah(tx.total)}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-mist">Belum ada transaksi.</p>
                        )}
                    </div>
                </section>

                <section className="surface-panel rounded-sm p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-display text-2xl">SPK aktif</h2>
                        <Link href="/admin/work-orders" className="text-sm text-brass">
                            Lihat semua
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {active_spk?.length ? (
                            active_spk.map((spk) => (
                                <Link
                                    key={spk.id}
                                    href={`/admin/work-orders/${spk.id}`}
                                    className="flex items-center justify-between border-b border-steel/50 py-2 text-sm hover:text-brass-light"
                                >
                                    <div>
                                        <p className="text-ivory">{spk.number}</p>
                                        <p className="text-mist">
                                            {spk.customer?.name} · {spk.mechanic?.name || 'Belum ditugaskan'}
                                        </p>
                                    </div>
                                    {statusBadge(spk.status)}
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-mist">Tidak ada SPK aktif.</p>
                        )}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
