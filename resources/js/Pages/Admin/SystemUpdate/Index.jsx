import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { btnPrimary, btnGhost } from '../../../Components/ui';

function shortSha(sha) {
    if (!sha || typeof sha !== 'string') return '—';
    return sha.length > 10 ? `${sha.slice(0, 7)}…` : sha;
}

function formatCommitDate(iso) {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return iso;
    }
}

function CheckOption({ id, label, hint, checked, onChange }) {
    return (
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-sm border border-brass/10 px-3 py-2.5 hover:bg-steel/20">
            <input
                id={id}
                type="checkbox"
                className="mt-1"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span>
                <span className="block text-sm text-ivory">{label}</span>
                {hint && <span className="mt-0.5 block text-xs text-mist">{hint}</span>}
            </span>
        </label>
    );
}

export default function SystemUpdateIndex({ status, config }) {
    const { flash } = usePage().props;
    const deployLogs = flash?.deploy_logs ?? [];
    const [showLogs, setShowLogs] = useState(deployLogs.length > 0);
    const [refreshing, setRefreshing] = useState(false);
    const [discarding, setDiscarding] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        confirm: false,
        run_composer: true,
        run_migrate: true,
        run_npm: false,
        run_optimize: true,
    });

    if (!status?.available) {
        return (
            <AdminLayout title="Update">
                <Head title="Update" />
                <div className="surface-panel rounded-sm p-6 text-mist">
                    {status?.message || 'Repository Git tidak ditemukan di server ini.'}
                </div>
            </AdminLayout>
        );
    }

    const repoUrl = (config.repo || status.remote_url || '').replace(/\.git$/, '');
    const pendingCommits = status.pending_commits ?? [];
    const blockingDirty = status.has_blocking_changes && !status.allow_dirty;
    const canDeploy =
        config.enabled && status.can_deploy && status.has_update && !blockingDirty && !status.fetch_error;

    const refreshStatus = () => {
        router.get(
            '/admin/system-update',
            { refresh: 1 },
            {
                preserveScroll: true,
                only: ['status', 'config'],
                replace: true,
                onStart: () => setRefreshing(true),
                onFinish: () => setRefreshing(false),
            },
        );
    };

    const runDiscardChanges = () => {
        if (
            !confirm(
                'PERINGATAN: Ini akan menghapus perubahan lokal di file kode (reset ke HEAD). Upload di public/storage tetap aman. Lanjutkan?',
            )
        ) {
            return;
        }
        setDiscarding(true);
        router.post(
            '/admin/system-update/discard-changes',
            {},
            {
                preserveScroll: true,
                onFinish: () => setDiscarding(false),
            },
        );
    };

    return (
        <AdminLayout title="Update">
            <Head title="Update" />

            <div className="mx-auto flex max-w-4xl flex-col gap-5">
                {!config.enabled && (
                    <div className="rounded-sm border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
                        Fitur dinonaktifkan. Tambahkan <code className="font-mono">DEPLOY_GITHUB_ENABLED=true</code> di{' '}
                        <code className="font-mono">.env</code>, lalu jalankan{' '}
                        <code className="font-mono">php artisan config:clear</code>.
                    </div>
                )}

                <div className="grid gap-5 lg:grid-cols-2">
                    <section className="surface-panel rounded-sm p-5">
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="font-display text-2xl text-ivory">Status repositori</h2>
                                <p className="mt-1 text-xs text-mist">Cabang {status.branch}</p>
                            </div>
                            <button type="button" className={btnGhost} onClick={refreshStatus} disabled={refreshing}>
                                {refreshing ? 'Memeriksa…' : 'Periksa update'}
                            </button>
                        </div>

                        {repoUrl && (
                            <a
                                href={repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mb-4 inline-block break-all text-xs text-brass hover:text-brass-light"
                            >
                                {repoUrl}
                            </a>
                        )}

                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between gap-3 border-b border-brass/10 pb-2">
                                <dt className="text-mist">Remote</dt>
                                <dd className="font-mono text-ivory">{status.remote}</dd>
                            </div>
                            <div className="flex justify-between gap-3 border-b border-brass/10 pb-2">
                                <dt className="text-mist">Status</dt>
                                <dd
                                    className={
                                        status.fetch_error
                                            ? 'text-mist'
                                            : status.has_update
                                              ? 'text-warning'
                                              : 'text-success'
                                    }
                                >
                                    {status.fetch_error
                                        ? 'Gagal cek'
                                        : status.has_update
                                          ? 'Ada update'
                                          : 'Sudah terbaru'}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-mist">Commit lokal</dt>
                                <dd className="font-mono text-ivory">{shortSha(status.local_sha)}</dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-mist">Commit GitHub</dt>
                                <dd className="font-mono text-ivory">{shortSha(status.remote_sha)}</dd>
                            </div>
                        </dl>

                        {status.fetch_error && (
                            <p className="mt-4 text-sm text-danger">{status.fetch_error}</p>
                        )}

                        {status.has_blocking_changes && (
                            <div className="mt-4 rounded-sm border border-danger/30 bg-danger/10 p-3">
                                <p className="text-sm text-danger">Ada perubahan lokal yang memblokir update:</p>
                                <ul className="mt-2 max-h-28 overflow-auto font-mono text-xs text-danger">
                                    {(status.blocking_changes || []).map((f) => (
                                        <li key={f}>• {f}</li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    className="mt-3 text-xs text-danger underline disabled:opacity-50"
                                    disabled={discarding || processing}
                                    onClick={runDiscardChanges}
                                >
                                    {discarding ? 'Memproses…' : 'Reset perubahan lokal'}
                                </button>
                            </div>
                        )}
                    </section>

                    <section className="surface-panel rounded-sm p-5">
                        <h2 className="font-display text-2xl text-ivory">Perbandingan versi</h2>
                        <dl className="mt-4 space-y-4 text-sm">
                            <div>
                                <dt className="text-mist">Versi terpasang</dt>
                                <dd className="mt-1 font-mono text-lg text-ivory">{status.local_version ?? '—'}</dd>
                                <dd className="font-mono text-xs text-mist">{shortSha(status.local_sha)}</dd>
                            </div>
                            <div>
                                <dt className="text-mist">Versi di GitHub</dt>
                                <dd className="mt-1 font-mono text-lg text-ivory">
                                    {status.remote_version ?? (status.fetch_error ? '—' : '…')}
                                </dd>
                                <dd className="font-mono text-xs text-mist">{shortSha(status.remote_sha)}</dd>
                            </div>
                        </dl>

                        {status.has_update && status.commits_behind > 0 && (
                            <p className="mt-4 text-sm text-warning">
                                {status.commits_behind} commit di belakang origin/{status.branch}
                            </p>
                        )}

                        {pendingCommits.length > 0 && (
                            <div className="mt-4">
                                <p className="mb-2 text-xs uppercase tracking-wider text-mist">Perubahan yang akan masuk</p>
                                <ul className="max-h-44 space-y-2 overflow-auto rounded-sm border border-brass/15 p-3">
                                    {pendingCommits.map((c) => (
                                        <li key={c.short_sha} className="text-sm">
                                            <span className="font-mono text-brass-light">{c.short_sha}</span>
                                            <span className="text-ivory"> — {c.subject}</span>
                                            {c.date && (
                                                <span className="mt-0.5 block text-xs text-mist">
                                                    {formatCommitDate(c.date)}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {status.compare_url && (
                            <a
                                href={status.compare_url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-block text-sm text-brass hover:text-brass-light"
                            >
                                Bandingkan di GitHub →
                            </a>
                        )}
                    </section>
                </div>

                <form
                    className="surface-panel rounded-sm p-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!status?.has_update) return;
                        post('/admin/system-update/deploy', { preserveScroll: true });
                    }}
                >
                    <h2 className="font-display text-2xl text-ivory">Jalankan update</h2>
                    <p className="mt-2 text-sm text-mist">
                        Menarik perubahan dari <strong className="text-ivory">origin/{status.branch}</strong> (git pull),
                        lalu menjalankan langkah yang dicentang. Di VPS tanpa Node, biarkan opsi npm nonaktif — folder{' '}
                        <code className="font-mono text-brass-light">public/build</code> sudah ikut di GitHub.
                    </p>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <CheckOption
                            id="run_composer"
                            label="Composer install"
                            hint="Memasang dependensi PHP"
                            checked={data.run_composer}
                            onChange={(v) => setData('run_composer', v)}
                        />
                        <CheckOption
                            id="run_migrate"
                            label="Migrasi database"
                            hint="php artisan migrate --force"
                            checked={data.run_migrate}
                            onChange={(v) => setData('run_migrate', v)}
                        />
                        <CheckOption
                            id="run_npm"
                            label="NPM install & build"
                            hint="Hanya jika server punya Node.js"
                            checked={data.run_npm}
                            onChange={(v) => setData('run_npm', v)}
                        />
                        <CheckOption
                            id="run_optimize"
                            label="Cache optimize"
                            hint="config, route, view cache"
                            checked={data.run_optimize}
                            onChange={(v) => setData('run_optimize', v)}
                        />
                    </div>

                    <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-mist">
                        <input
                            type="checkbox"
                            className="mt-1"
                            checked={data.confirm}
                            onChange={(e) => setData('confirm', e.target.checked)}
                        />
                        <span>Saya mengerti update akan mengubah file aplikasi di server ini.</span>
                    </label>
                    {errors.confirm && <p className="mt-2 text-xs text-danger">{errors.confirm}</p>}

                    <button type="submit" className={`${btnPrimary} mt-5`} disabled={processing || !canDeploy}>
                        {processing ? 'Memproses update…' : status.has_update ? 'Update sekarang' : 'Sudah versi terbaru'}
                    </button>
                </form>

                {deployLogs.length > 0 && (
                    <section className="surface-panel rounded-sm p-5">
                        <button
                            type="button"
                            className="text-sm font-medium text-ivory"
                            onClick={() => setShowLogs(!showLogs)}
                        >
                            {showLogs ? '▼' : '▶'} Log proses update
                        </button>
                        {showLogs && (
                            <div className="mt-4 space-y-3">
                                {deployLogs.map((log, i) => (
                                    <div
                                        key={i}
                                        className={`border-l-2 pl-3 ${log.success ? 'border-success' : 'border-danger'}`}
                                    >
                                        <p className={`text-sm font-medium ${log.success ? 'text-success' : 'text-danger'}`}>
                                            {log.step}
                                        </p>
                                        {log.output && (
                                            <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs text-mist">
                                                {log.output}
                                            </pre>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </AdminLayout>
    );
}
