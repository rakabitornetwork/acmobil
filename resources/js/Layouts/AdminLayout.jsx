import { Link, router, usePage } from '@inertiajs/react';

const nav = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/cms', label: 'CMS Landing' },
    { href: '/admin/catalog', label: 'Katalog' },
    { href: '/admin/customers', label: 'Pelanggan' },
    { href: '/admin/transactions', label: 'Transaksi' },
    { href: '/admin/work-orders', label: 'SPK' },
    { href: '/admin/mechanics', label: 'Mekanik' },
];

export default function AdminLayout({ children, title }) {
    const { auth, flash, app } = usePage().props;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="min-h-screen bg-obsidian text-ivory lg:flex">
            <aside className="border-b border-brass/10 bg-charcoal lg:w-64 lg:border-b-0 lg:border-r">
                <div className="px-5 py-6">
                    <Link href="/admin" className="font-display text-2xl text-ivory">
                        {app?.name || 'Berkah Teknik'}
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-brass">Admin Panel</p>
                </div>
                <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col">
                    {nav.map((item) => {
                        const active = path === item.href || (item.href !== '/admin' && path.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`whitespace-nowrap rounded-sm px-3 py-2 text-sm transition ${
                                    active
                                        ? 'bg-brass/15 text-brass-light'
                                        : 'text-mist hover:bg-steel/40 hover:text-ivory'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="hidden border-t border-brass/10 px-5 py-4 lg:block">
                    <p className="text-sm text-ivory">{auth?.user?.name}</p>
                    <p className="text-xs text-mist">{auth?.user?.email}</p>
                    <button
                        type="button"
                        onClick={() => router.post('/admin/logout')}
                        className="mt-3 text-sm text-brass hover:text-brass-light"
                    >
                        Keluar
                    </button>
                </div>
            </aside>
            <div className="flex-1">
                <header className="flex items-center justify-between border-b border-brass/10 px-6 py-5">
                    <h1 className="font-display text-3xl text-ivory">{title}</h1>
                    <button
                        type="button"
                        onClick={() => router.post('/admin/logout')}
                        className="text-sm text-mist hover:text-ivory lg:hidden"
                    >
                        Keluar
                    </button>
                </header>
                <div className="px-6 py-6">
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
