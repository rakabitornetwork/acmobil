import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { formatRupiah, statusBadge, typeLabel, btnPrimary, btnGhost } from '../../../Components/ui';

export default function TransactionShow({ transaction }) {
    return (
        <AdminLayout title={transaction.number}>
            <Head title={transaction.number} />
            <div className="mb-4 flex flex-wrap gap-2">
                <Link href={`/admin/transactions/${transaction.id}/edit`} className={btnGhost}>
                    Edit
                </Link>
                {transaction.status !== 'paid' && (
                    <button
                        type="button"
                        className={btnPrimary}
                        onClick={() => router.post(`/admin/transactions/${transaction.id}/paid`)}
                    >
                        Tandai lunas
                    </button>
                )}
                {transaction.status === 'paid' && (
                    <Link href={`/admin/transactions/${transaction.id}/print?position=top`} className={btnPrimary}>
                        Cetak bukti (½ A4)
                    </Link>
                )}
                <Link
                    href={`/admin/work-orders/create?transaction_id=${transaction.id}`}
                    className={btnGhost}
                >
                    Buat SPK
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="surface-panel space-y-2 rounded-sm p-5 lg:col-span-1">
                    <p className="text-xs uppercase tracking-wider text-mist">Pelanggan</p>
                    <p className="text-lg text-ivory">{transaction.customer?.name}</p>
                    <p className="text-sm text-mist">{transaction.customer?.phone}</p>
                    <div className="pt-3">{statusBadge(transaction.status)}</div>
                    <p className="pt-2 font-display text-3xl text-brass-light">{formatRupiah(transaction.total)}</p>
                    {transaction.notes && <p className="text-sm text-mist">{transaction.notes}</p>}
                    {transaction.work_order && (
                        <Link href={`/admin/work-orders/${transaction.work_order.id}`} className="block pt-3 text-sm text-brass">
                            SPK: {transaction.work_order.number}
                        </Link>
                    )}
                </div>
                <div className="surface-panel rounded-sm p-5 lg:col-span-2">
                    <h2 className="mb-4 font-display text-2xl">Item</h2>
                    <div className="space-y-3">
                        {transaction.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b border-steel/40 py-2 text-sm">
                                <div>
                                    <p className="text-ivory">{item.name}</p>
                                    <p className="text-mist">
                                        {typeLabel(item.type)} · {item.qty} x {formatRupiah(item.unit_price)}
                                    </p>
                                </div>
                                <p>{formatRupiah(item.line_total)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
