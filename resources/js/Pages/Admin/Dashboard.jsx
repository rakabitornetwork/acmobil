import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { formatRupiah, statusBadge, btnPrimary, btnGhost } from '../../Components/ui';

const toneClass = {
    brass: 'text-brass-light',
    ivory: 'text-ivory',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
};

const toneBar = {
    brass: 'bg-brass',
    ivory: 'bg-ivory/70',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
};

function Delta({ delta }) {
    if (!delta) return null;
    const color =
        delta.direction === 'up' ? 'text-success' : delta.direction === 'down' ? 'text-danger' : 'text-mist';
    return <p className={`mt-2 text-xs ${color}`}>{delta.label}</p>;
}

function MiniBars({ series, tone = 'brass', formatValue }) {
    const max = Math.max(...series.map((s) => Number(s.total) || 0), 1);

    return (
        <div className="mt-4">
            <div className="flex h-28 items-end gap-1.5">
                {series.map((point) => {
                    const height = Math.max(4, Math.round((Number(point.total) / max) * 100));
                    return (
                        <div key={point.date} className="group flex flex-1 flex-col items-center justify-end gap-1">
                            <span className="pointer-events-none mb-1 hidden rounded-sm bg-obsidian px-1.5 py-0.5 text-[10px] text-mist group-hover:block">
                                {formatValue ? formatValue(point.total) : point.total}
                            </span>
                            <div
                                className={`w-full rounded-sm ${toneBar[tone] || toneBar.brass} opacity-80 transition group-hover:opacity-100`}
                                style={{ height: `${height}%` }}
                                title={`${point.label}: ${formatValue ? formatValue(point.total) : point.total}`}
                            />
                            <span className="text-[10px] uppercase text-mist">{point.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function BreakdownList({ items, hrefBase }) {
    const total = items.reduce((sum, item) => sum + Number(item.count || 0), 0) || 1;

    return (
        <div className="space-y-3">
            {items.map((item) => {
                const pct = Math.round((Number(item.count) / total) * 100);
                return (
                    <Link
                        key={item.key}
                        href={`${hrefBase}?status=${item.key}`}
                        className="block hover:opacity-90"
                    >
                        <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="text-mist">{item.label}</span>
                            <span className="text-ivory">
                                {item.count} <span className="text-xs text-mist">({pct}%)</span>
                            </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-steel/50">
                            <div className="h-full rounded-full bg-brass/70" style={{ width: `${pct}%` }} />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

function formatTime(value) {
    if (!value) return '—';
    try {
        return new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '—';
    }
}

export default function Dashboard({
    widgets = [],
    charts,
    breakdowns,
    today_schedule,
    recent_transactions,
    active_spk,
    meta,
}) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-brass">Ringkasan operasional</p>
                    <p className="mt-1 text-sm text-mist">{meta?.period_label || 'Bulan ini'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/transactions/create" className={btnPrimary}>
                        Buat transaksi
                    </Link>
                    <Link href="/admin/work-orders/create" className={btnGhost}>
                        Buat SPK
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {widgets.map((widget) => (
                    <Link
                        key={widget.key}
                        href={widget.href}
                        className="surface-panel rounded-sm p-5 transition hover:border-brass/40"
                    >
                        <p className="text-xs uppercase tracking-wider text-mist">{widget.label}</p>
                        <p className={`mt-2 font-display text-3xl ${toneClass[widget.tone] || 'text-ivory'}`}>
                            {widget.display}
                        </p>
                        <p className="mt-1 text-xs text-mist">{widget.hint}</p>
                        <Delta delta={widget.delta} />
                    </Link>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <section className="surface-panel rounded-sm p-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-display text-2xl text-ivory">Pendapatan 7 hari</h2>
                            <p className="text-xs text-mist">Transaksi berstatus lunas</p>
                        </div>
                        <Link href="/admin/transactions?status=paid" className="text-sm text-brass">
                            Detail
                        </Link>
                    </div>
                    <MiniBars
                        series={charts?.revenue_7d || []}
                        tone="success"
                        formatValue={(v) => formatRupiah(v)}
                    />
                </section>

                <section className="surface-panel rounded-sm p-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-display text-2xl text-ivory">Transaksi 7 hari</h2>
                            <p className="text-xs text-mist">Jumlah transaksi dibuat</p>
                        </div>
                        <Link href="/admin/transactions" className="text-sm text-brass">
                            Detail
                        </Link>
                    </div>
                    <MiniBars series={charts?.transactions_7d || []} tone="brass" />
                </section>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <section className="surface-panel rounded-sm p-5">
                    <h2 className="mb-4 font-display text-2xl text-ivory">Status transaksi</h2>
                    <BreakdownList items={breakdowns?.transactions || []} hrefBase="/admin/transactions" />
                </section>
                <section className="surface-panel rounded-sm p-5">
                    <h2 className="mb-4 font-display text-2xl text-ivory">Status SPK</h2>
                    <BreakdownList items={breakdowns?.work_orders || []} hrefBase="/admin/work-orders" />
                </section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <section className="surface-panel rounded-sm p-5 xl:col-span-1">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-display text-2xl text-ivory">Jadwal hari ini</h2>
                        <Link href="/admin/work-orders" className="text-sm text-brass">
                            Semua
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {today_schedule?.length ? (
                            today_schedule.map((spk) => (
                                <Link
                                    key={spk.id}
                                    href={`/admin/work-orders/${spk.id}`}
                                    className="block border-b border-steel/50 py-2 text-sm hover:text-brass-light"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-ivory">{spk.number}</p>
                                        <span className="text-xs text-brass">{formatTime(spk.scheduled_at)}</span>
                                    </div>
                                    <p className="text-mist">
                                        {spk.customer?.name} · {spk.mechanic?.name || 'Belum ditugaskan'}
                                    </p>
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-mist">Tidak ada jadwal SPK hari ini.</p>
                        )}
                    </div>
                </section>

                <section className="surface-panel rounded-sm p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-display text-2xl text-ivory">Transaksi terbaru</h2>
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
                        <h2 className="font-display text-2xl text-ivory">SPK aktif</h2>
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
