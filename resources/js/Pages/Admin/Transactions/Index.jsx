import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { formatRupiah, statusBadge, btnPrimary } from '../../../Components/ui';

export default function TransactionsIndex({ transactions, filters }) {
    return (
        <AdminLayout title="Transaksi">
            <Head title="Transaksi" />
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                    {['', 'draft', 'unpaid', 'paid', 'cancelled'].map((status) => (
                        <button
                            key={status || 'all'}
                            type="button"
                            onClick={() => router.get('/admin/transactions', status ? { status } : {}, { preserveState: true })}
                            className={`rounded-sm px-3 py-1.5 text-sm ${
                                (filters.status || '') === status ? 'bg-brass/20 text-brass-light' : 'text-mist'
                            }`}
                        >
                            {status || 'Semua'}
                        </button>
                    ))}
                </div>
                <Link href="/admin/transactions/create" className={btnPrimary}>
                    Buat transaksi
                </Link>
            </div>
            <div className="overflow-x-auto rounded-sm border border-brass/15">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-charcoal text-mist">
                        <tr>
                            <th className="px-4 py-3">Nomor</th>
                            <th className="px-4 py-3">Pelanggan</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.data.map((tx) => (
                            <tr key={tx.id} className="border-t border-steel/40">
                                <td className="px-4 py-3 text-ivory">{tx.number}</td>
                                <td className="px-4 py-3 text-mist">{tx.customer?.name}</td>
                                <td className="px-4 py-3">{statusBadge(tx.status)}</td>
                                <td className="px-4 py-3">{formatRupiah(tx.total)}</td>
                                <td className="px-4 py-3 text-right space-x-3">
                                    <Link href={`/admin/transactions/${tx.id}`} className="text-brass">
                                        Detail
                                    </Link>
                                    {tx.status === 'paid' && (
                                        <Link href={`/admin/transactions/${tx.id}/print?position=top`} className="text-brass-light">
                                            Cetak
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
