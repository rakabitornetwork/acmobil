export function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

export function typeLabel(type) {
    return (
        {
            service_ac: 'Service AC',
            sparepart: 'Sparepart',
            tool_rental: 'Sewa Alat',
            workmanship: 'Jasa Pengerjaan',
        }[type] || type
    );
}

export function statusLabel(status) {
    return (
        {
            draft: 'Draf',
            unpaid: 'Belum Lunas',
            paid: 'Lunas',
            cancelled: 'Dibatalkan',
            pending: 'Menunggu',
            in_progress: 'Dikerjakan',
            done: 'Selesai',
        }[status] || status || 'Semua'
    );
}

export function statusBadge(status) {
    const map = {
        draft: 'bg-steel/50 text-mist',
        unpaid: 'bg-warning/15 text-warning',
        paid: 'bg-success/15 text-success',
        cancelled: 'bg-danger/15 text-danger',
        pending: 'bg-warning/15 text-warning',
        in_progress: 'bg-brass/15 text-brass-light',
        done: 'bg-success/15 text-success',
    };

    return (
        <span className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${map[status] || 'bg-steel text-mist'}`}>
            {statusLabel(status)}
        </span>
    );
}

export function StatusTimeline({ status }) {
    const steps = [
        { key: 'pending', label: 'Menunggu' },
        { key: 'in_progress', label: 'Dikerjakan' },
        { key: 'done', label: 'Selesai' },
    ];

    const order = { pending: 0, in_progress: 1, done: 2, cancelled: -1 };
    const current = order[status] ?? 0;

    if (status === 'cancelled') {
        return (
            <div className="rounded-sm border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                Pekerjaan dibatalkan
            </div>
        );
    }

    return (
        <ol className="grid gap-3 sm:grid-cols-3">
            {steps.map((step, index) => {
                const active = index <= current;
                const currentStep = index === current;
                return (
                    <li
                        key={step.key}
                        className={`rounded-sm border px-4 py-3 ${
                            currentStep
                                ? 'border-brass/50 bg-brass/10'
                                : active
                                  ? 'border-brass/20 bg-charcoal'
                                  : 'border-steel/60 bg-obsidian/40'
                        }`}
                    >
                        <p className="text-xs uppercase tracking-wider text-mist">Tahap {index + 1}</p>
                        <p className={`mt-1 font-medium ${active ? 'text-ivory' : 'text-mist'}`}>{step.label}</p>
                    </li>
                );
            })}
        </ol>
    );
}

export function Field({ label, error, children }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-mist">{label}</span>
            {children}
            {error && <span className="block text-xs text-danger">{error}</span>}
        </label>
    );
}

export const inputClass =
    'w-full rounded-sm border border-steel bg-obsidian px-3 py-2.5 text-sm text-ivory outline-none transition focus:border-brass/50';

export const btnPrimary =
    'inline-flex items-center justify-center rounded-sm bg-brass px-4 py-2.5 text-sm font-medium text-obsidian transition hover:bg-brass-light';

export const btnGhost =
    'inline-flex items-center justify-center rounded-sm border border-brass/30 px-4 py-2.5 text-sm text-brass-light transition hover:bg-brass/10';
