import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const nav = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/cms', label: 'CMS Landing' },
    { href: '/admin/catalog', label: 'Katalog' },
    { href: '/admin/customers', label: 'Pelanggan' },
    { href: '/admin/transactions', label: 'Transaksi' },
    { href: '/admin/work-orders', label: 'SPK' },
    { href: '/admin/mechanics', label: 'Mekanik' },
    { href: '/admin/profile', label: 'Akun' },
    { href: '/admin/system-update', label: 'Update' },
];

function NavLinks({ path, onNavigate }) {
    return nav.map((item) => {
        const active = path === item.href || (item.href !== '/admin' && path.startsWith(item.href));
        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`whitespace-nowrap rounded-sm px-3 py-2.5 text-sm transition ${
                    active
                        ? 'bg-brass/15 text-brass-light'
                        : 'text-mist hover:bg-steel/40 hover:text-ivory'
                }`}
            >
                {item.label}
            </Link>
        );
    });
}

function Brand() {
    const { app } = usePage().props;
    return (
        <>
            <Link href="/admin" className="font-display text-2xl text-ivory">
                {app?.name || 'Berkah Teknik'}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-brass">Admin Panel</p>
        </>
    );
}

function UserBlock({ auth, onNavigate }) {
    return (
        <div className="border-t border-brass/10 px-5 py-4">
            <Link
                href="/admin/profile"
                onClick={onNavigate}
                className="block hover:opacity-90"
            >
                <p className="text-sm text-ivory">{auth?.user?.name}</p>
                <p className="text-xs text-mist">{auth?.user?.email}</p>
                <p className="mt-1 text-xs text-brass">Kelola akun</p>
            </Link>
            <button
                type="button"
                onClick={() => {
                    onNavigate?.();
                    router.post('/admin/logout');
                }}
                className="mt-3 text-sm text-brass hover:text-brass-light"
            >
                Keluar
            </button>
        </div>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [path]);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <div className="min-h-screen bg-obsidian text-ivory lg:flex">
            {/* Desktop sidebar */}
            <aside className="hidden border-r border-brass/10 bg-charcoal lg:flex lg:w-64 lg:flex-col">
                <div className="px-5 py-6">
                    <Brand />
                </div>
                <nav className="flex flex-1 flex-col gap-1 px-3 pb-4">
                    <NavLinks path={path} />
                </nav>
                <UserBlock auth={auth} />
            </aside>

            {/* Mobile drawer */}
            <div
                className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                aria-hidden={!menuOpen}
            >
                <button
                    type="button"
                    className={`absolute inset-0 bg-obsidian/70 transition-opacity ${
                        menuOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-label="Tutup menu"
                    onClick={closeMenu}
                />
                <aside
                    className={`absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col border-r border-brass/10 bg-charcoal shadow-xl transition-transform duration-300 ease-out ${
                        menuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex items-start justify-between px-5 py-6">
                        <div>
                            <Brand />
                        </div>
                        <button
                            type="button"
                            onClick={closeMenu}
                            className="rounded-sm p-2 text-mist hover:bg-steel/40 hover:text-ivory"
                            aria-label="Tutup menu"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
                        <NavLinks path={path} onNavigate={closeMenu} />
                    </nav>
                    <UserBlock auth={auth} onNavigate={closeMenu} />
                </aside>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex items-center justify-between gap-4 border-b border-brass/10 px-4 py-4 sm:px-6 sm:py-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            className="rounded-sm border border-brass/30 p-2 text-brass-light hover:bg-brass/10 lg:hidden"
                            aria-label="Buka menu"
                            aria-expanded={menuOpen}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                            </svg>
                        </button>
                        <h1 className="truncate font-display text-2xl text-ivory sm:text-3xl">{title}</h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.post('/admin/logout')}
                        className="shrink-0 text-sm text-mist hover:text-ivory lg:hidden"
                    >
                        Keluar
                    </button>
                </header>
                <div className="px-4 py-6 sm:px-6">
                    {flash?.success && (
                        <div className="mb-4 rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-sm border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                            {flash.error}
                        </div>
                    )}
                    {flash?.otp && (
                        <div className="mb-4 rounded-sm border border-brass/30 bg-brass/10 px-4 py-3 text-sm text-brass-light">
                            OTP: <strong className="tracking-widest">{flash.otp}</strong>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
