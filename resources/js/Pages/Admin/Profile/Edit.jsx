import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, btnPrimary, btnGhost, ImageFileInput } from '../../../Components/ui';

export default function ProfileEdit({ user }) {
    const form = useForm({
        name: user.name || '',
        email: user.email || '',
        current_password: '',
        password: '',
        password_confirmation: '',
        avatar: null,
        remove_avatar: false,
    });

    const [localPreview, setLocalPreview] = useState(null);

    useEffect(() => {
        if (!form.data.avatar) {
            setLocalPreview(null);
            return undefined;
        }
        const url = URL.createObjectURL(form.data.avatar);
        setLocalPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [form.data.avatar]);

    const previewUrl = localPreview || (form.data.remove_avatar ? null : user.avatar_url);

    return (
        <AdminLayout title="Akun Admin">
            <Head title="Akun Admin" />

            <form
                className="surface-panel mx-auto max-w-xl space-y-5 rounded-sm p-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post('/admin/profile', {
                        forceFormData: true,
                        preserveScroll: true,
                        onSuccess: () =>
                            form.setData({
                                ...form.data,
                                current_password: '',
                                password: '',
                                password_confirmation: '',
                                avatar: null,
                                remove_avatar: false,
                            }),
                    });
                }}
            >
                <div>
                    <h2 className="font-display text-2xl text-ivory">Profil</h2>
                    <p className="mt-1 text-sm text-mist">Ubah foto, nama, email, dan password akun admin.</p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brass/30 bg-steel/40 text-xl font-medium text-brass-light">
                        {previewUrl ? (
                            <img src={previewUrl} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <span>{user.initials || 'A'}</span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                        <ImageFileInput
                            label="Foto profil"
                            buttonLabel={previewUrl ? 'Ganti foto' : 'Pilih foto'}
                            file={form.data.avatar}
                            error={form.errors.avatar}
                            onChange={(file) => {
                                form.setData({
                                    ...form.data,
                                    avatar: file,
                                    remove_avatar: false,
                                });
                            }}
                        />
                        {user.avatar_url && !form.data.remove_avatar && (
                            <button
                                type="button"
                                className={`${btnGhost} !py-2 text-xs`}
                                onClick={() =>
                                    form.setData({
                                        ...form.data,
                                        avatar: null,
                                        remove_avatar: true,
                                    })
                                }
                            >
                                Hapus foto
                            </button>
                        )}
                    </div>
                </div>

                <Field label="Nama" error={form.errors.name}>
                    <input
                        className={inputClass}
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        autoComplete="name"
                        required
                    />
                </Field>

                <Field label="Email" error={form.errors.email}>
                    <input
                        type="email"
                        className={inputClass}
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        autoComplete="username"
                        required
                    />
                </Field>

                <div className="border-t border-brass/15 pt-5">
                    <h3 className="font-display text-xl text-ivory">Ganti password</h3>
                    <p className="mt-1 text-sm text-mist">Kosongkan jika tidak ingin mengubah password.</p>
                </div>

                <Field label="Password saat ini" error={form.errors.current_password}>
                    <input
                        type="password"
                        className={inputClass}
                        value={form.data.current_password}
                        onChange={(e) => form.setData('current_password', e.target.value)}
                        autoComplete="current-password"
                    />
                </Field>

                <Field label="Password baru" error={form.errors.password}>
                    <input
                        type="password"
                        className={inputClass}
                        value={form.data.password}
                        onChange={(e) => form.setData('password', e.target.value)}
                        autoComplete="new-password"
                    />
                </Field>

                <Field label="Konfirmasi password baru" error={form.errors.password_confirmation}>
                    <input
                        type="password"
                        className={inputClass}
                        value={form.data.password_confirmation}
                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                    />
                </Field>

                <button type="submit" className={btnPrimary} disabled={form.processing}>
                    {form.processing ? 'Menyimpan…' : 'Simpan perubahan'}
                </button>
            </form>
        </AdminLayout>
    );
}
