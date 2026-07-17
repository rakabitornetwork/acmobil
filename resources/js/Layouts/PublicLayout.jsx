import { Link, usePage } from '@inertiajs/react';

export default function PublicLayout({ children }) {
    const { app } = usePage().props;
    const name = app?.name || 'Berkah Teknik';

    return (
        <div className="min-h-screen bg-obsidian text-ivory">
            <header className="fixed inset-x-0 top-0 z-40 border-b border-brass/10 bg-obsidian/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="font-display text-2xl tracking-wide text-ivory">
                        {name}
                    </Link>
                    <nav className="flex items-center gap-6 text-sm text-mist">
                        <a href="/#layanan" className="hidden hover:text-ivory sm:inline">
                            Layanan
                        </a>
                        <a href="/#kontak" className="hidden hover:text-ivory sm:inline">
                            Kontak
                        </a>
                        <Link
                            href="/pelanggan/login"
                            className="rounded-sm border border-brass/40 px-4 py-2 text-brass-light transition hover:bg-brass/10"
                        >
                            Lacak Pekerjaan
                        </Link>
                    </nav>
                </div>
            </header>
            <main>{children}</main>
            <footer className="border-t border-brass/10 bg-charcoal">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-display text-xl text-ivory">{name}</p>
                    <p>© {new Date().getFullYear()} · Service AC Mobil & Solusi Teknik</p>
                </div>
            </footer>
        </div>
    );
}
