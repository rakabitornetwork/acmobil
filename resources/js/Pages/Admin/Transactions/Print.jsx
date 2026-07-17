import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';
import FitHalfSlip from '../../../Components/FitHalfSlip';
import { halfA4PrintStyles } from '../../../Components/printStyles';

const typeLabel = {
    service_ac: 'Service AC',
    sparepart: 'Sparepart',
    tool_rental: 'Sewa Alat',
    workmanship: 'Jasa Pengerjaan',
};

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

function ReceiptSlip({ transaction, settings }) {
    const items = transaction.items || [];
    const company = settings?.company_name || 'Berkah Teknik';

    return (
        <FitHalfSlip>
            <div className="spk-header">
                <div>
                    <p className="spk-brand">{company}</p>
                    <p className="spk-tagline">{settings?.tagline || 'Service AC Mobil · Sparepart · Sewa Alat'}</p>
                </div>
                <div className="spk-header-right">
                    <p className="spk-doc-title">BUKTI PEMBAYARAN</p>
                    <p className="spk-number">{transaction.number}</p>
                    <p className="trx-paid-badge">LUNAS</p>
                </div>
            </div>

            <div className="spk-top-compact">
                <div className="spk-meta-inline">
                    <div className="row">
                        <span>Cetak</span>
                        <strong>{formatDate(new Date().toISOString())}</strong>
                    </div>
                    <div className="row">
                        <span>Dibayar</span>
                        <strong>{formatDate(transaction.paid_at || transaction.updated_at)}</strong>
                    </div>
                    <div className="row">
                        <span>SPK</span>
                        <strong>{transaction.work_order?.number || '—'}</strong>
                    </div>
                    <div className="row">
                        <span>Total</span>
                        <strong>{formatRupiah(transaction.total)}</strong>
                    </div>
                </div>

                <div className="spk-info-grid">
                    <div className="spk-box">
                        <p className="spk-label">Pelanggan</p>
                        <p className="spk-value">{transaction.customer?.name || '—'}</p>
                        <p className="spk-sub">{transaction.customer?.phone || '—'}</p>
                    </div>
                    <div className="spk-box">
                        <p className="spk-label">Kendaraan / Plat</p>
                        <p className="spk-value">{transaction.customer?.vehicle || '—'}</p>
                        <p className="spk-sub">{transaction.customer?.plate_number || '—'}</p>
                    </div>
                    <div className="spk-box" style={{ gridColumn: '1 / -1' }}>
                        <p className="spk-label">Mekanik SPK</p>
                        <p className="spk-value">{transaction.work_order?.mechanic?.name || '—'}</p>
                    </div>
                </div>
            </div>

            {transaction.notes && (
                <div className="spk-desc-inline">
                    <span className="spk-label">Catatan:</span>
                    <span className="spk-body">{transaction.notes}</span>
                </div>
            )}

            {items.length > 0 && (
                <div className="spk-section">
                    <p className="spk-label">Rincian item ({items.length})</p>
                    <table className="spk-table">
                        <colgroup>
                            <col className="col-num" />
                            <col className="col-item" />
                            <col className="col-type" />
                            <col className="col-qty" />
                            <col className="col-price" />
                            <col className="col-sub" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>Tipe</th>
                                <th className="col-right">Qty</th>
                                <th className="col-right">Harga</th>
                                <th className="col-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={item.id}>
                                    <td>{idx + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{typeLabel[item.type] || item.type}</td>
                                    <td className="col-right">{item.qty}</td>
                                    <td className="col-right">{formatRupiah(item.unit_price)}</td>
                                    <td className="col-right">{formatRupiah(item.line_total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="trx-total-row">
                <span>Total dibayar</span>
                <strong>{formatRupiah(transaction.total)}</strong>
            </div>

            <div className="spk-signs">
                <div>
                    <p>Kasir / Admin</p>
                    <div className="spk-sign-line" />
                    <p className="spk-sign-name">( ........................ )</p>
                </div>
                <div>
                    <p>Pelanggan</p>
                    <div className="spk-sign-line" />
                    <p className="spk-sign-name">{transaction.customer?.name || '( ........................ )'}</p>
                </div>
                <div>
                    <p>Paraf</p>
                    <div className="spk-sign-line" />
                    <p className="spk-sign-name">( ........................ )</p>
                </div>
            </div>
        </FitHalfSlip>
    );
}

export default function TransactionPrint({ transaction, position = 'top', settings }) {
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 450);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="spk-print-root">
            <Head title={`Cetak ${transaction.number}`} />

            <div className="spk-toolbar no-print">
                <div>
                    <p className="spk-toolbar-title">Cetak bukti lunas setengah A4</p>
                    <p className="spk-toolbar-sub">
                        Selalu satu setengah lembar. Informasi atas dibuat kompak agar item banyak tetap muat.
                    </p>
                </div>
                <div className="spk-toolbar-actions">
                    <button
                        type="button"
                        className={position === 'top' ? 'active' : ''}
                        onClick={() =>
                            router.get(`/admin/transactions/${transaction.id}/print`, { position: 'top' }, { preserveState: false })
                        }
                    >
                        Cetak di atas
                    </button>
                    <button
                        type="button"
                        className={position === 'bottom' ? 'active' : ''}
                        onClick={() =>
                            router.get(`/admin/transactions/${transaction.id}/print`, { position: 'bottom' }, { preserveState: false })
                        }
                    >
                        Cetak di bawah
                    </button>
                    <button type="button" onClick={() => window.print()}>
                        Cetak ulang
                    </button>
                    <Link href={`/admin/transactions/${transaction.id}`}>Kembali</Link>
                </div>
            </div>

            <div className={`spk-sheet position-${position}`}>
                <div className="spk-half top-half">
                    {position === 'top' ? (
                        <ReceiptSlip transaction={transaction} settings={settings} />
                    ) : (
                        <div className="spk-placeholder">
                            <p>Area kosong — sisa kertas untuk bukti lain</p>
                        </div>
                    )}
                </div>
                <div className="spk-cut">
                    <span>potong di sini · setengah A4</span>
                </div>
                <div className="spk-half bottom-half">
                    {position === 'bottom' ? (
                        <ReceiptSlip transaction={transaction} settings={settings} />
                    ) : (
                        <div className="spk-placeholder">
                            <p>Area kosong — sisa kertas untuk bukti lain</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{halfA4PrintStyles}</style>
        </div>
    );
}
