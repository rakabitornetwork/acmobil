import { Link, usePage } from '@inertiajs/react';
import { useEffect, useId, useState } from 'react';

const navLinks = [
    { href: '/#tentang', label: 'Tentang' },
    { href: '/#layanan', label: 'Layanan' },
    { href: '/#kontak', label: 'Kontak' },
];

export default function PublicLayout({ children }) {
    const { app } = usePage().props;
    const name = app?.name || 'Berkah Teknik';
    const [menuOpen, setMenuOpen] = useState(false);
    const panelId = useId();

    useEffect(() => {
        if (!menuOpen) return undefined;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <div className="min-h-screen bg-obsidian text-ivory">
            <header className="fixed inset-x-0 top-0 z-40 border-b border-brass/10 bg-obsidian/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="font-display text-2xl tracking-wide text-ivory" onClick={closeMenu}>
                        {name}
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm text-mist sm:flex">
                        {navLinks.map((item) => (
                            <a key={item.href} href={item.href} className="hover:text-ivory">
                                {item.label}
                            </a>
                        ))}
                        <Link
                            href="/pelanggan/login"
                            className="rounded-sm border border-brass/40 px-4 py-2 text-brass-light transition hover:bg-brass/10"
                        >
                            Lacak Pekerjaan
                        </Link>
                    </nav>

                    <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-brass/30 text-ivory transition hover:bg-brass/10 sm:hidden"
                        aria-expanded={menuOpen}
                        aria-controls={panelId}
                        aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <span className="sr-only">{menuOpen ? 'Tutup menu' : 'Buka menu'}</span>
                        <span className="relative block h-4 w-5">
                            <span
                                className={`absolute left-0 top-0 h-0.5 w-5 bg-brass transition duration-300 ${
                                    menuOpen ? 'translate-y-[7px] rotate-45' : ''
                                }`}
                            />
                            <span
                                className={`absolute left-0 top-[7px] h-0.5 w-5 bg-brass transition duration-300 ${
                                    menuOpen ? 'opacity-0' : ''
                                }`}
                            />
                            <span
                                className={`absolute left-0 top-[14px] h-0.5 w-5 bg-brass transition duration-300 ${
                                    menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                                }`}
                            />
                        </span>
                    </button>
                </div>
            </header>

            <div
                className={`fixed inset-0 z-50 sm:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                aria-hidden={!menuOpen}
            >
                <button
                    type="button"
                    className={`absolute inset-0 bg-obsidian/70 transition-opacity duration-300 ${
                        menuOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-label="Tutup menu"
                    onClick={closeMenu}
                />

                <aside
                    id={panelId}
                    className={`absolute inset-y-0 right-0 flex w-[min(20rem,86vw)] flex-col border-l border-brass/20 bg-charcoal shadow-2xl transition-transform duration-300 ease-out ${
                        menuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex items-center justify-between border-b border-brass/15 px-6 py-4">
                        <p className="font-display text-xl text-ivory">{name}</p>
                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-brass/30 text-brass transition hover:bg-brass/10"
                            aria-label="Tutup menu"
                            onClick={closeMenu}
                        >
                            <span className="text-lg leading-none">×</span>
                        </button>
                    </div>

                    <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
                        {navLinks.map((item, index) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={closeMenu}
                                className="rounded-sm px-4 py-3 text-base text-mist transition hover:bg-brass/10 hover:text-ivory"
                                style={{ transitionDelay: menuOpen ? `${index * 40}ms` : '0ms' }}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="border-t border-brass/15 px-6 py-5">
                        <Link
                            href="/pelanggan/login"
                            onClick={closeMenu}
                            className="block rounded-sm bg-brass px-4 py-3 text-center text-sm font-semibold text-obsidian transition hover:bg-brass-light"
                        >
                            Lacak Pekerjaan
                        </Link>
                    </div>
                </aside>
            </div>

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
