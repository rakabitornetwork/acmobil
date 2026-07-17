import { Head, useForm } from '@inertiajs/react';
import { Field, inputClass, btnPrimary } from '../../Components/ui';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-obsidian px-6">
            <Head title="Login Admin" />
            <div className="surface-panel w-full max-w-md rounded-sm p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-brass">Admin</p>
                <h1 className="mt-2 font-display text-4xl text-ivory">Masuk Panel</h1>
                <form
                    className="mt-8 space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/admin/login');
                    }}
                >
                    <Field label="Email" error={errors.email}>
                        <input
                            type="email"
                            className={inputClass}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoFocus
                        />
                    </Field>
                    <Field label="Password" error={errors.password}>
                        <input
                            type="password"
                            className={inputClass}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </Field>
                    <label className="flex items-center gap-2 text-sm text-mist">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        Ingat saya
                    </label>
                    <button type="submit" disabled={processing} className={`${btnPrimary} w-full`}>
                        {processing ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </div>
    );
}
