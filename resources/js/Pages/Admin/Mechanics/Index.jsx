import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, btnPrimary } from '../../../Components/ui';

export default function MechanicsIndex({ mechanics }) {
    const form = useForm({
        name: '',
        phone: '',
        is_active: true,
    });

    return (
        <AdminLayout title="Mekanik">
            <Head title="Mekanik" />
            <div className="grid gap-6 lg:grid-cols-3">
                <form
                    className="surface-panel space-y-3 rounded-sm p-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post('/admin/mechanics', { onSuccess: () => form.reset() });
                    }}
                >
                    <h2 className="font-display text-2xl">Tambah mekanik</h2>
                    <Field label="Nama" error={form.errors.name}>
                        <input className={inputClass} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    </Field>
                    <Field label="Telepon">
                        <input className={inputClass} value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                    </Field>
                    <button type="submit" className={btnPrimary}>
                        Simpan
                    </button>
                </form>
                <div className="space-y-3 lg:col-span-2">
                    {mechanics.data.map((m) => (
                        <div key={m.id} className="surface-panel flex items-center justify-between rounded-sm p-4">
                            <div>
                                <p className="text-ivory">{m.name}</p>
                                <p className="text-sm text-mist">{m.phone || '-'} · {m.is_active ? 'Aktif' : 'Nonaktif'}</p>
                            </div>
                            <button type="button" className="text-sm text-danger" onClick={() => router.delete(`/admin/mechanics/${m.id}`)}>
                                Hapus
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
