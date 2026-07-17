import { useEffect, useMemo, useRef, useState } from 'react';
import { inputClass } from './ui';

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const MONTHS = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

function toDateValue(value) {
    if (!value) return '';
    const raw = String(value).replace(' ', 'T');
    return raw.slice(0, 10);
}

function toTimeValue(value) {
    if (!value) return '08:00';
    const raw = String(value).replace(' ', 'T');
    if (raw.length >= 16) return raw.slice(11, 16);
    return '08:00';
}

function formatDisplay(dateStr, timeStr) {
    if (!dateStr) return 'Pilih tanggal jadwal';
    const [y, m, d] = dateStr.split('-').map(Number);
    const label = `${d} ${MONTHS[m - 1]} ${y}`;
    return timeStr ? `${label} · ${timeStr}` : label;
}

function buildCells(year, month) {
    const first = new Date(year, month, 1);
    // Monday-first index
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < startOffset; i += 1) {
        cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push(day);
    }
    while (cells.length % 7 !== 0) {
        cells.push(null);
    }
    return cells;
}

function pad(n) {
    return String(n).padStart(2, '0');
}

export default function DatePicker({ value, onChange, error, label = 'Jadwal' }) {
    const rootRef = useRef(null);
    const initialDate = toDateValue(value);
    const initialTime = toTimeValue(value);

    const [open, setOpen] = useState(false);
    const [datePart, setDatePart] = useState(initialDate);
    const [timePart, setTimePart] = useState(initialTime);

    const viewSeed = initialDate ? new Date(`${initialDate}T00:00:00`) : new Date();
    const [viewYear, setViewYear] = useState(viewSeed.getFullYear());
    const [viewMonth, setViewMonth] = useState(viewSeed.getMonth());

    useEffect(() => {
        setDatePart(toDateValue(value));
        setTimePart(toTimeValue(value));
    }, [value]);

    useEffect(() => {
        const onDocClick = (e) => {
            if (!rootRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const cells = useMemo(() => buildCells(viewYear, viewMonth), [viewYear, viewMonth]);
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    const emit = (nextDate, nextTime) => {
        if (!nextDate) {
            onChange('');
            return;
        }
        onChange(`${nextDate}T${nextTime || '08:00'}`);
    };

    const selectDay = (day) => {
        if (!day) return;
        const nextDate = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
        setDatePart(nextDate);
        emit(nextDate, timePart);
    };

    const shiftMonth = (delta) => {
        const d = new Date(viewYear, viewMonth + delta, 1);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
    };

    return (
        <div ref={rootRef} className="relative">
            <label className="block space-y-1.5">
                <span className="text-xs uppercase tracking-wider text-mist">{label}</span>
                <button
                    type="button"
                    className={`${inputClass} flex w-full items-center justify-between text-left`}
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className={datePart ? 'text-ivory' : 'text-mist'}>
                        {formatDisplay(datePart, timePart)}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-4 w-4 text-brass"
                        aria-hidden="true"
                    >
                        <rect x="3" y="5" width="18" height="16" rx="1.5" />
                        <path d="M3 9h18M8 3v4M16 3v4" />
                    </svg>
                </button>
                {error && <span className="block text-xs text-danger">{error}</span>}
            </label>

            {open && (
                <div className="absolute z-30 mt-2 w-full min-w-[300px] rounded-sm border border-brass/25 bg-charcoal p-4 shadow-2xl shadow-black/40">
                    <div className="mb-3 flex items-center justify-between">
                        <button
                            type="button"
                            className="rounded-sm px-2 py-1 text-brass hover:bg-brass/10"
                            onClick={() => shiftMonth(-1)}
                        >
                            ‹
                        </button>
                        <p className="font-display text-xl text-ivory">
                            {MONTHS[viewMonth]} {viewYear}
                        </p>
                        <button
                            type="button"
                            className="rounded-sm px-2 py-1 text-brass hover:bg-brass/10"
                            onClick={() => shiftMonth(1)}
                        >
                            ›
                        </button>
                    </div>

                    <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-mist">
                        {WEEKDAYS.map((d) => (
                            <span key={d}>{d}</span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((day, idx) => {
                            if (!day) {
                                return <span key={`e-${idx}`} className="h-9" />;
                            }
                            const key = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
                            const selected = key === datePart;
                            const isToday = key === todayKey;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => selectDay(day)}
                                    className={`h-9 rounded-sm text-sm transition ${
                                        selected
                                            ? 'bg-brass font-semibold text-obsidian'
                                            : isToday
                                              ? 'border border-brass/40 text-brass-light hover:bg-brass/10'
                                              : 'text-ivory hover:bg-steel/50'
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex items-center gap-3 border-t border-brass/15 pt-3">
                        <label className="flex flex-1 items-center gap-2 text-xs text-mist">
                            Jam
                            <input
                                type="time"
                                className={`${inputClass} py-1.5`}
                                value={timePart}
                                onChange={(e) => {
                                    setTimePart(e.target.value);
                                    if (datePart) emit(datePart, e.target.value);
                                }}
                            />
                        </label>
                        <button
                            type="button"
                            className="text-xs text-mist hover:text-danger"
                            onClick={() => {
                                setDatePart('');
                                setTimePart('08:00');
                                onChange('');
                                setOpen(false);
                            }}
                        >
                            Hapus
                        </button>
                        <button
                            type="button"
                            className="rounded-sm bg-brass px-3 py-1.5 text-xs font-medium text-obsidian"
                            onClick={() => setOpen(false)}
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
