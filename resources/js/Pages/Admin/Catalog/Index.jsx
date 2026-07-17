import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, btnPrimary, formatRupiah, typeLabel } from '../../../Components/ui';

export default function CatalogIndex({ items, filters }) {
    const form = useForm({
        name: '',
        type: 'sparepart',
        default_price: '',
        unit: 'pcs',
        stock: '',
        description: '',
        is_active: true,
    });

    return (
        <AdminLayout title="Katalog">
            <Head title="Katalog" />
            <div className="grid gap-6 lg:grid-cols-3">
                <form
                    className="surface-panel space-y-3 rounded-sm p-5 lg:col-span-1"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/admin/catalog', {
                            onSuccess: () => form.reset(),
                        });
                    }}
                >
                    <h2 className="font-display text-2xl">Tambah item</h2>
                    <Field label="Nama" error={form.errors.name}>
                        <input className={inputClass} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    </Field>
                    <Field label="Tipe">
                        <select className={inputClass} value={form.data.type} onChange={(e) => form.setData('type', e.target.value)}>
                            <option value="sparepart">Sparepart</option>
                            <option value="service_ac">Service AC</option>
                            <option value="tool_rental">Sewa Alat</option>
                            <option value="workmanship">Jasa Pengerjaan</option>
                        </select>
                    </Field>
                    <Field label="Harga default">
                        <input type="number" className={inputClass} value={form.data.default_price} onChange={(e) => form.setData('default_price', e.target.value)} />
                    </Field>
                    <Field label="Satuan">
                        <input className={inputClass} value={form.data.unit} onChange={(e) => form.setData('unit', e.target.value)} />
                    </Field>
                    <Field label="Stok (opsional)">
                        <input type="number" className={inputClass} value={form.data.stock} onChange={(e) => form.setData('stock', e.target.value)} />
                    </Field>
                    <button type="submit" className={btnPrimary}>
                        Simpan
                    </button>
                </form>

                <div className="lg:col-span-2">
                    <input
                        className={`${inputClass} mb-4`}
                        placeholder="Cari katalog..."
                        defaultValue={filters.q}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/admin/catalog', { q: e.target.value }, { preserveState: true });
                            }
                        }}
                    />
                    <div className="overflow-x-auto rounded-sm border border-brass/15">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-charcoal text-mist">
                                <tr>
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Tipe</th>
                                    <th className="px-4 py-3">Harga</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.data.map((item) => (
                                    <tr key={item.id} className="border-t border-steel/40">
                                        <td className="px-4 py-3 text-ivory">{item.name}</td>
                                        <td className="px-4 py-3 text-mist">{typeLabel(item.type)}</td>
                                        <td className="px-4 py-3">{formatRupiah(item.default_price)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                className="text-danger"
                                                onClick={() => router.delete(`/admin/catalog/${item.id}`)}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
