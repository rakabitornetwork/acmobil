import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, btnPrimary, btnGhost } from '../../../Components/ui';

export default function CustomersIndex({ customers, filters }) {
    const form = useForm({
        name: '',
        phone: '',
        vehicle: '',
        plate_number: '',
        notes: '',
    });

    return (
        <AdminLayout title="Pelanggan">
            <Head title="Pelanggan" />
            <div className="grid gap-6 lg:grid-cols-3">
                <form
                    className="surface-panel space-y-3 rounded-sm p-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/admin/customers', { onSuccess: () => form.reset() });
                    }}
                >
                    <h2 className="font-display text-2xl">Tambah pelanggan</h2>
                    <Field label="Nama" error={form.errors.name}>
                        <input className={inputClass} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    </Field>
                    <Field label="WhatsApp" error={form.errors.phone}>
                        <input className={inputClass} placeholder="08..." value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                    </Field>
                    <Field label="Kendaraan">
                        <input className={inputClass} value={form.data.vehicle} onChange={(e) => form.setData('vehicle', e.target.value)} />
                    </Field>
                    <Field label="Plat">
                        <input className={inputClass} value={form.data.plate_number} onChange={(e) => form.setData('plate_number', e.target.value)} />
                    </Field>
                    <Field label="Catatan">
                        <textarea className={inputClass} rows={2} value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                    </Field>
                    <button type="submit" className={btnPrimary}>
                        Simpan
                    </button>
                </form>

                <div className="space-y-3 lg:col-span-2">
                    <input
                        className={inputClass}
                        placeholder="Cari nama / WA / plat..."
                        defaultValue={filters.q}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/admin/customers', { q: e.target.value }, { preserveState: true });
                            }
                        }}
                    />
                    {customers.data.map((c) => (
                        <div key={c.id} className="surface-panel flex flex-wrap items-center justify-between gap-3 rounded-sm p-4">
                            <div>
                                <p className="text-ivory">{c.name}</p>
                                <p className="text-sm text-mist">
                                    {c.phone} · {c.vehicle || '-'} · {c.plate_number || '-'}
                                </p>
                                {c.last_otp && (
                                    <p className="mt-1 text-xs text-brass">OTP terakhir: {c.last_otp}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button type="button" className={btnGhost} onClick={() => router.post(`/admin/customers/${c.id}/otp`)}>
                                    Kirim OTP
                                </button>
                                <button type="button" className="text-sm text-danger" onClick={() => router.delete(`/admin/customers/${c.id}`)}>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
