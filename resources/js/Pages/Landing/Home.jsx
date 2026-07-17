import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

function storageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
}

function typeMeta(type) {
    if (type === 'promo') return { label: 'Promo', className: 'text-brass' };
    if (type === 'urgent') return { label: 'Penting', className: 'text-danger' };
    return { label: 'Informasi', className: 'text-brass-light' };
}

export default function Home({ settings, hero, about, announcements = [], services, gallery, testimonials }) {
    const company = settings?.company_name || 'Berkah Teknik';
    const wa = settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : hero?.cta_url;

    return (
        <PublicLayout>
            <Head title="Beranda" />

            <section className="hero-atmosphere relative min-h-screen overflow-hidden">
                {hero?.image_path && (
                    <img
                        src={storageUrl(hero.image_path)}
                        alt={hero?.title || company}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        fetchPriority="high"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/65 to-obsidian/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/50" />
                <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pb-20 pt-28">
                    <p className="reveal text-xs uppercase tracking-[0.35em] text-brass">{company}</p>
                    <h1 className="reveal reveal-delay-1 mt-4 max-w-3xl font-display text-5xl leading-tight text-ivory sm:text-7xl">
                        {hero?.title || 'Performa dingin yang dapat diandalkan'}
                    </h1>
                    <div className="reveal reveal-delay-1 gold-hairline mt-6 h-px w-40" />
                    <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg text-mist">
                        {hero?.body || settings?.tagline}
                    </p>
                    <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-4">
                        {wa && (
                            <a href={wa} className="rounded-sm bg-brass px-6 py-3 text-sm font-semibold text-obsidian hover:bg-brass-light">
                                {hero?.cta_label || 'Hubungi WhatsApp'}
                            </a>
                        )}
                        <Link
                            href="/pelanggan/login"
                            className="rounded-sm border border-brass/40 px-6 py-3 text-sm text-brass-light hover:bg-brass/10"
                        >
                            Lacak Pekerjaan
                        </Link>
                    </div>
                </div>
            </section>

            <section id="tentang" className="border-t border-brass/10 bg-charcoal">
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-brass">Tentang</p>
                        <h2 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">{about?.title}</h2>
                        <p className="mt-2 text-brass-light">{about?.subtitle}</p>
                    </div>
                    <p className="text-lg leading-relaxed text-mist">{about?.body}</p>
                </div>
            </section>

            {announcements.length > 0 && (
                <section id="berita" className="border-t border-brass/10">
                    <div className="mx-auto max-w-6xl px-6 py-24">
                        <p className="text-xs uppercase tracking-[0.3em] text-brass">Berita singkat</p>
                        <h2 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">Promo & informasi penting</h2>
                        <div className="mt-14 space-y-10">
                            {announcements.map((item) => {
                                const meta = typeMeta(item.type);
                                return (
                                    <article key={item.id} className="border-t border-brass/20 pt-6">
                                        <div className={`grid gap-6 ${item.image_path ? 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start' : ''}`}>
                                            {item.image_path && (
                                                <img
                                                    src={storageUrl(item.image_path)}
                                                    alt={item.title}
                                                    className="aspect-[16/10] w-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <p className={`text-xs uppercase tracking-[0.25em] ${meta.className}`}>
                                                        {meta.label}
                                                    </p>
                                                    {item.published_at && (
                                                        <p className="text-xs text-mist">
                                                            {new Date(item.published_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </p>
                                                    )}
                                                </div>
                                                <h3 className="mt-3 font-display text-3xl text-ivory">{item.title}</h3>
                                                {item.body && <p className="mt-3 max-w-3xl text-mist">{item.body}</p>}
                                                {item.cta_label && item.cta_url && (
                                                    <a
                                                        href={item.cta_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-5 inline-block text-sm text-brass-light underline-offset-4 hover:text-brass hover:underline"
                                                    >
                                                        {item.cta_label}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            <section id="layanan" className="border-t border-brass/10">
                <div className="mx-auto max-w-6xl px-6 py-24">
                    <p className="text-xs uppercase tracking-[0.3em] text-brass">Layanan</p>
                    <h2 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">Empat fokusus keahlian kami</h2>
                    <div className="mt-14 grid gap-8 md:grid-cols-2">
                        {services?.map((service, index) => (
                            <article key={service.id} className="border-t border-brass/20 pt-6">
                                <p className="text-xs text-mist">0{index + 1}</p>
                                <h3 className="mt-2 font-display text-3xl text-ivory">{service.title}</h3>
                                <p className="mt-3 text-mist">{service.description}</p>
                                {service.price_label && (
                                    <p className="mt-4 text-sm text-brass">{service.price_label}</p>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {gallery?.length > 0 && (
                <section id="galeri" className="border-t border-brass/10 bg-charcoal">
                    <div className="mx-auto max-w-6xl px-6 py-24">
                        <p className="text-xs uppercase tracking-[0.3em] text-brass">Galeri</p>
                        <h2 className="mt-3 font-display text-4xl text-ivory">Hasil kerja bengkel</h2>
                        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {gallery.map((item) => (
                                <figure key={item.id} className="group overflow-hidden">
                                    <img
                                        src={storageUrl(item.image_path)}
                                        alt={item.caption || 'Galeri'}
                                        className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                                    />
                                    {item.caption && (
                                        <figcaption className="mt-2 text-sm text-mist">{item.caption}</figcaption>
                                    )}
                                </figure>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {testimonials?.length > 0 && (
                <section id="testimoni" className="border-t border-brass/10">
                    <div className="mx-auto max-w-6xl px-6 py-24">
                        <p className="text-xs uppercase tracking-[0.3em] text-brass">Testimoni</p>
                        <h2 className="mt-3 font-display text-4xl text-ivory">Kata pelanggan</h2>
                        <div className="mt-12 grid gap-10 md:grid-cols-3">
                            {testimonials.map((item) => (
                                <blockquote key={item.id} className="border-l border-brass/30 pl-5">
                                    <p className="text-mist">“{item.content}”</p>
                                    <footer className="mt-4 text-sm text-ivory">{item.name}</footer>
                                    <p className="text-xs text-brass">{'★'.repeat(item.rating)}</p>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section id="kontak" className="border-t border-brass/10 bg-charcoal">
                <div className="mx-auto max-w-6xl px-6 py-24">
                    <p className="text-xs uppercase tracking-[0.3em] text-brass">Kontak</p>
                    <h2 className="mt-3 font-display text-4xl text-ivory">Kunjungi bengkel kami</h2>
                    <div className="mt-10 grid gap-8 text-mist md:grid-cols-3">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-brass">Alamat</p>
                            <p className="mt-2 text-ivory">{settings?.address}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-brass">Jam Operasional</p>
                            <p className="mt-2 text-ivory">{settings?.hours}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-brass">WhatsApp</p>
                            <p className="mt-2 text-ivory">{settings?.whatsapp}</p>
                            {settings?.email && <p className="mt-1 text-sm">{settings.email}</p>}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
