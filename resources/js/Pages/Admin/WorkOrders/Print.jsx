import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';
import FitHalfSlip from '../../../Components/FitHalfSlip';
import { halfA4PrintStyles } from '../../../Components/printStyles';

const statusLabel = {
    pending: 'Menunggu',
    in_progress: 'Dikerjakan',
    done: 'Selesai',
    cancelled: 'Dibatalkan',
};

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

function SpkSlip({ workOrder, settings }) {
    const items = workOrder.transaction?.items || [];
    const company = settings?.company_name || 'Berkah Teknik';

    return (
        <FitHalfSlip>
            <div className="spk-header">
                <div>
                    <p className="spk-brand">{company}</p>
                    <p className="spk-tagline">{settings?.tagline || 'Service AC Mobil · Sparepart · Sewa Alat'}</p>
                </div>
                <div className="spk-header-right">
                    <p className="spk-doc-title">SURAT PERINTAH KERJA</p>
                    <p className="spk-number">{workOrder.number}</p>
                </div>
            </div>

            <div className="spk-top-compact">
                <div className="spk-meta-inline">
                    <div className="row">
                        <span>Cetak</span>
                        <strong>{formatDate(new Date().toISOString())}</strong>
                    </div>
                    <div className="row">
                        <span>Jadwal</span>
                        <strong>{formatDate(workOrder.scheduled_at)}</strong>
                    </div>
                    <div className="row">
                        <span>Status</span>
                        <strong>{statusLabel[workOrder.status] || workOrder.status}</strong>
                    </div>
                    <div className="row">
                        <span>Transaksi</span>
                        <strong>{workOrder.transaction?.number || '—'}</strong>
                    </div>
                </div>

                <div className="spk-info-grid">
                    <div className="spk-box">
                        <p className="spk-label">Pelanggan</p>
                        <p className="spk-value">{workOrder.customer?.name || '—'}</p>
                        <p className="spk-sub">{workOrder.customer?.phone || '—'}</p>
                    </div>
                    <div className="spk-box">
                        <p className="spk-label">Kendaraan / Plat</p>
                        <p className="spk-value">{workOrder.vehicle || '—'}</p>
                        <p className="spk-sub">{workOrder.plate_number || '—'}</p>
                    </div>
                    <div className="spk-box" style={{ gridColumn: '1 / -1' }}>
                        <p className="spk-label">Mekanik</p>
                        <p className="spk-value">{workOrder.mechanic?.name || 'Belum ditugaskan'}</p>
                        <p className="spk-sub">{workOrder.mechanic?.phone || '—'}</p>
                    </div>
                </div>
            </div>

            {workOrder.description && (
                <div className="spk-desc-inline">
                    <span className="spk-label">Deskripsi:</span>
                    <span className="spk-body">{workOrder.description}</span>
                </div>
            )}

            {items.length > 0 && (
                <div className="spk-section">
                    <p className="spk-label">Item pekerjaan ({items.length})</p>
                    <table className="spk-table">
                        <colgroup>
                            <col className="col-num-spk" />
                            <col className="col-item-spk" />
                            <col className="col-type-spk" />
                            <col className="col-qty-spk" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>Tipe</th>
                                <th className="col-right">Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={item.id}>
                                    <td>{idx + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{typeLabel[item.type] || item.type}</td>
                                    <td className="col-right">{item.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="spk-signs">
                <div>
                    <p>Admin / CS</p>
                    <div className="spk-sign-line" />
                    <p className="spk-sign-name">( ........................ )</p>
                </div>
                <div>
                    <p>Mekanik</p>
                    <div className="spk-sign-line" />
                    <p className="spk-sign-name">{workOrder.mechanic?.name || '( ........................ )'}</p>
                </div>
                <div>
                    <p>Pelanggan</p>
                    <div className="spk-sign-line" />
                    <p className="spk-sign-name">{workOrder.customer?.name || '( ........................ )'}</p>
                </div>
            </div>
        </FitHalfSlip>
    );
}

export default function WorkOrderPrint({ workOrder, position = 'top', settings }) {
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 450);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="spk-print-root">
            <Head title={`Cetak ${workOrder.number}`} />

            <div className="spk-toolbar no-print">
                <div>
                    <p className="spk-toolbar-title">Cetak SPK setengah A4</p>
                    <p className="spk-toolbar-sub">
                        Selalu satu setengah lembar. Informasi atas dibuat kompak agar item banyak tetap muat.
                    </p>
                </div>
                <div className="spk-toolbar-actions">
                    <button
                        type="button"
                        className={position === 'top' ? 'active' : ''}
                        onClick={() => router.get(`/admin/work-orders/${workOrder.id}/print`, { position: 'top' }, { preserveState: false })}
                    >
                        Cetak di atas
                    </button>
                    <button
                        type="button"
                        className={position === 'bottom' ? 'active' : ''}
                        onClick={() => router.get(`/admin/work-orders/${workOrder.id}/print`, { position: 'bottom' }, { preserveState: false })}
                    >
                        Cetak di bawah
                    </button>
                    <button type="button" onClick={() => window.print()}>
                        Cetak ulang
                    </button>
                    <Link href={`/admin/work-orders/${workOrder.id}`}>Kembali</Link>
                </div>
            </div>

            <div className={`spk-sheet position-${position}`}>
                <div className="spk-half top-half">
                    {position === 'top' ? (
                        <SpkSlip workOrder={workOrder} settings={settings} />
                    ) : (
                        <div className="spk-placeholder">
                            <p>Area kosong — sisa kertas untuk SPK lain</p>
                        </div>
                    )}
                </div>
                <div className="spk-cut">
                    <span>potong di sini · setengah A4</span>
                </div>
                <div className="spk-half bottom-half">
                    {position === 'bottom' ? (
                        <SpkSlip workOrder={workOrder} settings={settings} />
                    ) : (
                        <div className="spk-placeholder">
                            <p>Area kosong — sisa kertas untuk SPK lain</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{halfA4PrintStyles}</style>
        </div>
    );
}
