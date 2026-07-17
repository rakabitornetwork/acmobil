import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const navSections = [
    {
        title: 'Operasional',
        items: [
            { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
            { href: '/admin/transactions', label: 'Transaksi', icon: 'receipt' },
            { href: '/admin/work-orders', label: 'SPK', icon: 'clipboard' },
        ],
    },
    {
        title: 'Master Data',
        items: [
            { href: '/admin/customers', label: 'Pelanggan', icon: 'users' },
            { href: '/admin/catalog', label: 'Katalog', icon: 'box' },
            { href: '/admin/mechanics', label: 'Mekanik', icon: 'wrench' },
        ],
    },
    {
        title: 'Konten & Sistem',
        items: [
            { href: '/admin/cms', label: 'CMS Landing', icon: 'layout' },
            { href: '/admin/profile', label: 'Akun', icon: 'user' },
            { href: '/admin/system-update', label: 'Update', icon: 'refresh' },
        ],
    },
];

function NavIcon({ name }) {
    const common = {
        className: 'h-4 w-4 shrink-0',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.8',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
    };

    switch (name) {
        case 'dashboard':
            return (
                <svg {...common}>
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
            );
        case 'receipt':
            return (
                <svg {...common}>
                    <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3z" />
                    <path d="M9 8h6M9 12h6M9 16h4" />
                </svg>
            );
        case 'clipboard':
            return (
                <svg {...common}>
                    <rect x="6" y="5" width="12" height="16" rx="1.5" />
                    <path d="M9 5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
                    <path d="M9 11h6M9 15h4" />
                </svg>
            );
        case 'users':
            return (
                <svg {...common}>
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3 19a6 6 0 0 1 12 0" />
                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M16 19a5 5 0 0 1 5-5" />
                </svg>
            );
        case 'box':
            return (
                <svg {...common}>
                    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                    <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
                </svg>
            );
        case 'wrench':
            return (
                <svg {...common}>
                    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5 2.5-2.5z" />
                </svg>
            );
        case 'layout':
            return (
                <svg {...common}>
                    <rect x="3" y="4" width="18" height="16" rx="1.5" />
                    <path d="M3 9h18M9 9v11" />
                </svg>
            );
        case 'user':
            return (
                <svg {...common}>
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
            );
        case 'refresh':
            return (
                <svg {...common}>
                    <path d="M21 12a9 9 0 1 1-2.6-6.2" />
                    <path d="M21 4v6h-6" />
                </svg>
            );
        default:
            return null;
    }
}

function NavLinks({ path, onNavigate }) {
    return navSections.map((section) => (
        <div key={section.title} className="mb-4">
            <p className="mb-1.5 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-mist/70">
                {section.title}
            </p>
            <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                    const active =
                        path === item.href || (item.href !== '/admin' && path.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm transition ${
                                active
                                    ? 'bg-brass/15 text-brass-light'
                                    : 'text-mist hover:bg-steel/40 hover:text-ivory'
                            }`}
                        >
                            <NavIcon name={item.icon} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    ));
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
                className="mt-3 text-sm text-danger hover:text-danger/80"
            >
                Keluar
            </button>
        </div>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth, flash, app } = usePage().props;
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
        <div className="min-h-screen bg-obsidian text-ivory lg:flex lg:h-dvh lg:overflow-hidden">
            {/* Desktop sidebar — tetap diam saat konten digulir */}
            <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-brass/10 bg-charcoal lg:flex">
                <div className="shrink-0 px-5 py-6">
                    <Brand />
                </div>
                <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
                    <NavLinks path={path} />
                </nav>
                <div className="shrink-0">
                    <UserBlock auth={auth} />
                </div>
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
                    <div className="flex shrink-0 items-start justify-between px-5 py-6">
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
                    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
                        <NavLinks path={path} onNavigate={closeMenu} />
                    </nav>
                    <div className="shrink-0">
                        <UserBlock auth={auth} onNavigate={closeMenu} />
                    </div>
                </aside>
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:overflow-y-auto">
                <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-brass/10 bg-obsidian/95 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
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
                <div className="flex-1 px-4 py-6 sm:px-6">
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
                <footer className="mt-auto border-t border-brass/10 px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-1 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} {app?.name || 'Berkah Teknik'}. Seluruh hak cipta dilindungi.
                        </p>
                        <p className="text-mist/80">Panel Admin</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
