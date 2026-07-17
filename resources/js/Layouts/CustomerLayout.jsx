import { Link, router, usePage } from '@inertiajs/react';

export default function CustomerLayout({ children, title }) {
    const { auth, flash, app } = usePage().props;

    return (
        <div className="min-h-screen bg-obsidian text-ivory">
            <header className="border-b border-brass/10 bg-charcoal/80 backdrop-blur">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
                    <div>
                        <Link href="/" className="font-display text-2xl text-ivory">
                            {app?.name || 'Berkah Teknik'}
                        </Link>
                        <p className="text-xs uppercase tracking-[0.18em] text-brass">Portal Pelanggan</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-ivory">{auth?.customer?.name}</p>
                        <button
                            type="button"
                            onClick={() => router.post('/pelanggan/logout')}
                            className="text-xs text-mist hover:text-brass"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-4xl px-6 py-8">
                {title && <h1 className="mb-6 font-display text-4xl text-ivory">{title}</h1>}
                {flash?.success && (
                    <div className="mb-4 rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                        {flash.success}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
