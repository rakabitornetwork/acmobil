import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, btnPrimary, typeLabel } from '../../../Components/ui';

const tabs = ['Pengaturan', 'Hero & Tentang', 'Berita', 'Layanan', 'Galeri', 'Testimoni'];

function formatDate(value) {
    if (!value) return '';
    try {
        return new Date(value).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return value;
    }
}

export default function CmsIndex({ settings, hero, about, services, gallery, testimonials, announcements = [] }) {
    const [tab, setTab] = useState(0);

    const settingsForm = useForm({
        company_name: settings.company_name || '',
        tagline: settings.tagline || '',
        whatsapp: settings.whatsapp || '',
        address: settings.address || '',
        hours: settings.hours || '',
        instagram: settings.instagram || '',
        facebook: settings.facebook || '',
        email: settings.email || '',
        logo: null,
    });

    const heroForm = useForm({
        title: hero?.title || '',
        subtitle: hero?.subtitle || '',
        body: hero?.body || '',
        cta_label: hero?.cta_label || '',
        cta_url: hero?.cta_url || '',
        image: null,
    });

    const aboutForm = useForm({
        title: about?.title || '',
        subtitle: about?.subtitle || '',
        body: about?.body || '',
        image: null,
    });

    const announcementForm = useForm({
        title: '',
        body: '',
        type: 'info',
        cta_label: '',
        cta_url: '',
        sort_order: 0,
        is_active: true,
        published_at: new Date().toISOString().slice(0, 10),
    });

    const serviceForm = useForm({
        title: '',
        type: 'service_ac',
        description: '',
        price_label: '',
        sort_order: 0,
        is_active: true,
        image: null,
    });

    const galleryForm = useForm({
        caption: '',
        sort_order: 0,
        is_active: true,
        image: null,
    });

    const testimonialForm = useForm({
        name: '',
        content: '',
        rating: 5,
        sort_order: 0,
        is_active: true,
    });

    return (
        <AdminLayout title="CMS Landing">
            <Head title="CMS Landing" />
            <div className="mb-6 flex flex-wrap gap-2">
                {tabs.map((label, i) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => setTab(i)}
                        className={`rounded-sm px-3 py-2 text-sm ${
                            tab === i ? 'bg-brass/20 text-brass-light' : 'text-mist hover:text-ivory'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {tab === 0 && (
                <form
                    className="surface-panel max-w-2xl space-y-4 rounded-sm p-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        settingsForm.post('/admin/cms/settings', { forceFormData: true });
                    }}
                >
                    {['company_name', 'tagline', 'whatsapp', 'hours', 'email', 'instagram', 'facebook'].map((key) => (
                        <Field key={key} label={key.replace('_', ' ')} error={settingsForm.errors[key]}>
                            <input
                                className={inputClass}
                                value={settingsForm.data[key]}
                                onChange={(e) => settingsForm.setData(key, e.target.value)}
                            />
                        </Field>
                    ))}
                    <Field label="Alamat" error={settingsForm.errors.address}>
                        <textarea
                            className={inputClass}
                            rows={3}
                            value={settingsForm.data.address}
                            onChange={(e) => settingsForm.setData('address', e.target.value)}
                        />
                    </Field>
                    <Field label="Logo">
                        <input type="file" accept="image/*" onChange={(e) => settingsForm.setData('logo', e.target.files[0])} />
                    </Field>
                    <button type="submit" className={btnPrimary}>
                        Simpan pengaturan
                    </button>
                </form>
            )}

            {tab === 1 && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <form
                        className="surface-panel space-y-4 rounded-sm p-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            heroForm.post('/admin/cms/sections/hero', { forceFormData: true });
                        }}
                    >
                        <h2 className="font-display text-2xl">Hero</h2>
                        {['title', 'subtitle', 'cta_label', 'cta_url'].map((key) => (
                            <Field key={key} label={key}>
                                <input
                                    className={inputClass}
                                    value={heroForm.data[key]}
                                    onChange={(e) => heroForm.setData(key, e.target.value)}
                                />
                            </Field>
                        ))}
                        <Field label="Body">
                            <textarea
                                className={inputClass}
                                rows={4}
                                value={heroForm.data.body}
                                onChange={(e) => heroForm.setData('body', e.target.value)}
                            />
                        </Field>
                        <Field label="Gambar hero (disarankan 4K 3840×2160)">
                            {hero?.image_path && (
                                <div className="mb-3 overflow-hidden rounded-sm border border-brass/20">
                                    <img
                                        src={`/storage/${hero.image_path}`}
                                        alt="Preview hero"
                                        className="aspect-video w-full object-cover"
                                    />
                                    <p className="px-3 py-2 text-xs text-mist">Gambar saat ini — unggah file baru untuk mengganti</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => heroForm.setData('image', e.target.files[0])}
                            />
                            {heroForm.errors.image && (
                                <span className="mt-1 block text-xs text-danger">{heroForm.errors.image}</span>
                            )}
                        </Field>
                        <button type="submit" className={btnPrimary}>
                            Simpan hero
                        </button>
                    </form>

                    <form
                        className="surface-panel space-y-4 rounded-sm p-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            aboutForm.post('/admin/cms/sections/about', { forceFormData: true });
                        }}
                    >
                        <h2 className="font-display text-2xl">Tentang</h2>
                        {['title', 'subtitle'].map((key) => (
                            <Field key={key} label={key}>
                                <input
                                    className={inputClass}
                                    value={aboutForm.data[key]}
                                    onChange={(e) => aboutForm.setData(key, e.target.value)}
                                />
                            </Field>
                        ))}
                        <Field label="Body">
                            <textarea
                                className={inputClass}
                                rows={6}
                                value={aboutForm.data.body}
                                onChange={(e) => aboutForm.setData('body', e.target.value)}
                            />
                        </Field>
                        <button type="submit" className={btnPrimary}>
                            Simpan tentang
                        </button>
                    </form>
                </div>
            )}

            {tab === 2 && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <form
                        className="surface-panel space-y-4 rounded-sm p-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            announcementForm.post('/admin/cms/announcements', {
                                onSuccess: () =>
                                    announcementForm.reset(
                                        'title',
                                        'body',
                                        'cta_label',
                                        'cta_url',
                                        'type',
                                        'sort_order',
                                    ),
                            });
                        }}
                    >
                        <h2 className="font-display text-2xl">Tambah berita singkat</h2>
                        <p className="text-sm text-mist">
                            Promo, pengumuman, atau informasi penting yang tampil di landing page.
                        </p>
                        <Field label="Judul" error={announcementForm.errors.title}>
                            <input
                                className={inputClass}
                                value={announcementForm.data.title}
                                onChange={(e) => announcementForm.setData('title', e.target.value)}
                            />
                        </Field>
                        <Field label="Jenis" error={announcementForm.errors.type}>
                            <select
                                className={inputClass}
                                value={announcementForm.data.type}
                                onChange={(e) => announcementForm.setData('type', e.target.value)}
                            >
                                <option value="info">Informasi</option>
                                <option value="promo">Promo</option>
                                <option value="urgent">Penting</option>
                            </select>
                        </Field>
                        <Field label="Isi singkat" error={announcementForm.errors.body}>
                            <textarea
                                className={inputClass}
                                rows={4}
                                value={announcementForm.data.body}
                                onChange={(e) => announcementForm.setData('body', e.target.value)}
                            />
                        </Field>
                        <Field label="Label tombol (opsional)" error={announcementForm.errors.cta_label}>
                            <input
                                className={inputClass}
                                placeholder="Contoh: Hubungi WhatsApp"
                                value={announcementForm.data.cta_label}
                                onChange={(e) => announcementForm.setData('cta_label', e.target.value)}
                            />
                        </Field>
                        <Field label="URL tombol (opsional)" error={announcementForm.errors.cta_url}>
                            <input
                                className={inputClass}
                                placeholder="https://wa.me/..."
                                value={announcementForm.data.cta_url}
                                onChange={(e) => announcementForm.setData('cta_url', e.target.value)}
                            />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Tanggal tayang" error={announcementForm.errors.published_at}>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={announcementForm.data.published_at}
                                    onChange={(e) => announcementForm.setData('published_at', e.target.value)}
                                />
                            </Field>
                            <Field label="Urutan" error={announcementForm.errors.sort_order}>
                                <input
                                    type="number"
                                    min="0"
                                    className={inputClass}
                                    value={announcementForm.data.sort_order}
                                    onChange={(e) => announcementForm.setData('sort_order', Number(e.target.value))}
                                />
                            </Field>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-mist">
                            <input
                                type="checkbox"
                                checked={announcementForm.data.is_active}
                                onChange={(e) => announcementForm.setData('is_active', e.target.checked)}
                            />
                            Tampilkan di landing page
                        </label>
                        <button type="submit" className={btnPrimary} disabled={announcementForm.processing}>
                            Tambah berita
                        </button>
                    </form>
                    <div className="space-y-3">
                        {announcements.length === 0 && (
                            <p className="surface-panel rounded-sm p-4 text-sm text-mist">Belum ada berita singkat.</p>
                        )}
                        {announcements.map((item) => (
                            <div key={item.id} className="surface-panel flex items-start justify-between gap-3 rounded-sm p-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-ivory">{item.title}</p>
                                        <span className="rounded-sm bg-brass/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-brass">
                                            {typeLabel(item.type)}
                                        </span>
                                        {!item.is_active && (
                                            <span className="text-[10px] uppercase tracking-wider text-danger">Nonaktif</span>
                                        )}
                                    </div>
                                    {item.body && <p className="mt-1 text-sm text-mist">{item.body}</p>}
                                    <p className="mt-2 text-xs text-mist/70">
                                        {formatDate(item.published_at)}
                                        {item.cta_label ? ` · ${item.cta_label}` : ''}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="shrink-0 text-xs text-danger"
                                    onClick={() => router.delete(`/admin/cms/announcements/${item.id}`)}
                                >
                                    Hapus
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 3 && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <form
                        className="surface-panel space-y-4 rounded-sm p-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            serviceForm.post('/admin/cms/services', {
                                forceFormData: true,
                                onSuccess: () => serviceForm.reset('title', 'description', 'price_label'),
                            });
                        }}
                    >
                        <h2 className="font-display text-2xl">Tambah layanan</h2>
                        <Field label="Judul">
                            <input className={inputClass} value={serviceForm.data.title} onChange={(e) => serviceForm.setData('title', e.target.value)} />
                        </Field>
                        <Field label="Tipe">
                            <select className={inputClass} value={serviceForm.data.type} onChange={(e) => serviceForm.setData('type', e.target.value)}>
                                <option value="service_ac">Service AC</option>
                                <option value="sparepart">Sparepart</option>
                                <option value="tool_rental">Sewa Alat</option>
                                <option value="workmanship">Jasa Pengerjaan</option>
                            </select>
                        </Field>
                        <Field label="Deskripsi">
                            <textarea className={inputClass} rows={3} value={serviceForm.data.description} onChange={(e) => serviceForm.setData('description', e.target.value)} />
                        </Field>
                        <Field label="Label harga">
                            <input className={inputClass} value={serviceForm.data.price_label} onChange={(e) => serviceForm.setData('price_label', e.target.value)} />
                        </Field>
                        <button type="submit" className={btnPrimary}>
                            Tambah
                        </button>
                    </form>
                    <div className="space-y-3">
                        {services.map((s) => (
                            <div key={s.id} className="surface-panel flex items-start justify-between gap-3 rounded-sm p-4">
                                <div>
                                    <p className="text-ivory">{s.title}</p>
                                    <p className="text-xs text-brass">{typeLabel(s.type)}</p>
                                    <p className="mt-1 text-sm text-mist">{s.description}</p>
                                </div>
                                <button
                                    type="button"
                                    className="text-xs text-danger"
                                    onClick={() => router.delete(`/admin/cms/services/${s.id}`)}
                                >
                                    Hapus
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 4 && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <form
                        className="surface-panel space-y-4 rounded-sm p-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            galleryForm.post('/admin/cms/gallery', {
                                forceFormData: true,
                                onSuccess: () => galleryForm.reset(),
                            });
                        }}
                    >
                        <h2 className="font-display text-2xl">Tambah foto</h2>
                        <Field label="Caption">
                            <input className={inputClass} value={galleryForm.data.caption} onChange={(e) => galleryForm.setData('caption', e.target.value)} />
                        </Field>
                        <Field label="Gambar">
                            <input type="file" accept="image/*" onChange={(e) => galleryForm.setData('image', e.target.files[0])} />
                        </Field>
                        <button type="submit" className={btnPrimary}>
                            Upload
                        </button>
                    </form>
                    <div className="grid grid-cols-2 gap-3">
                        {gallery.map((g) => (
                            <div key={g.id} className="surface-panel overflow-hidden rounded-sm">
                                <img src={`/storage/${g.image_path}`} alt="" className="aspect-video w-full object-cover" />
                                <div className="flex items-center justify-between p-2 text-xs">
                                    <span className="text-mist">{g.caption}</span>
                                    <button type="button" className="text-danger" onClick={() => router.delete(`/admin/cms/gallery/${g.id}`)}>
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 5 && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <form
                        className="surface-panel space-y-4 rounded-sm p-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            testimonialForm.post('/admin/cms/testimonials', {
                                onSuccess: () => testimonialForm.reset('name', 'content'),
                            });
                        }}
                    >
                        <h2 className="font-display text-2xl">Tambah testimoni</h2>
                        <Field label="Nama">
                            <input className={inputClass} value={testimonialForm.data.name} onChange={(e) => testimonialForm.setData('name', e.target.value)} />
                        </Field>
                        <Field label="Isi">
                            <textarea className={inputClass} rows={3} value={testimonialForm.data.content} onChange={(e) => testimonialForm.setData('content', e.target.value)} />
                        </Field>
                        <Field label="Rating">
                            <input type="number" min="1" max="5" className={inputClass} value={testimonialForm.data.rating} onChange={(e) => testimonialForm.setData('rating', Number(e.target.value))} />
                        </Field>
                        <button type="submit" className={btnPrimary}>
                            Tambah
                        </button>
                    </form>
                    <div className="space-y-3">
                        {testimonials.map((t) => (
                            <div key={t.id} className="surface-panel flex justify-between gap-3 rounded-sm p-4">
                                <div>
                                    <p className="text-ivory">{t.name}</p>
                                    <p className="text-sm text-mist">“{t.content}”</p>
                                </div>
                                <button type="button" className="text-xs text-danger" onClick={() => router.delete(`/admin/cms/testimonials/${t.id}`)}>
                                    Hapus
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
