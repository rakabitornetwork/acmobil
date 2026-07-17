import { Head, useForm, usePage } from '@inertiajs/react';
import { Field, inputClass, btnPrimary, btnGhost } from '../../Components/ui';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Login() {
    const { flash, errors } = usePage().props;
    const otpPhone = flash?.otp_phone || '';

    const requestForm = useForm({ phone: otpPhone || '' });
    const verifyForm = useForm({ phone: otpPhone || '', otp: '' });

    const step = otpPhone ? 'verify' : 'request';

    return (
        <PublicLayout>
            <Head title="Lacak Pekerjaan" />
            <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-28">
                <p className="text-xs uppercase tracking-[0.3em] text-brass">Portal Pelanggan</p>
                <h1 className="mt-3 font-display text-5xl text-ivory">Lacak pekerjaan bengkel</h1>
                <p className="mt-4 text-mist">
                    Masuk dengan nomor WhatsApp yang sudah terdaftar di Berkah Teknik.
                </p>

                {flash?.success && (
                    <div className="mt-6 rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                        {flash.success}
                    </div>
                )}
                {flash?.otp && (
                    <div className="mt-3 rounded-sm border border-brass/30 bg-brass/10 px-4 py-3 text-sm text-brass-light">
                        Mode debug — OTP: <strong className="tracking-widest">{flash.otp}</strong>
                    </div>
                )}

                {step === 'request' ? (
                    <form
                        className="mt-8 space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            requestForm.post('/pelanggan/login/otp');
                        }}
                    >
                        <Field label="Nomor WhatsApp" error={errors?.phone || requestForm.errors.phone}>
                            <input
                                className={inputClass}
                                placeholder="08xxxxxxxxxx"
                                value={requestForm.data.phone}
                                onChange={(e) => requestForm.setData('phone', e.target.value)}
                            />
                        </Field>
                        <button type="submit" className={`${btnPrimary} w-full`} disabled={requestForm.processing}>
                            Kirim Kode OTP
                        </button>
                    </form>
                ) : (
                    <form
                        className="mt-8 space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            verifyForm.setData('phone', otpPhone);
                            verifyForm.post('/pelanggan/login/verify');
                        }}
                    >
                        <Field label="Nomor WhatsApp">
                            <input className={inputClass} value={otpPhone} readOnly />
                        </Field>
                        <Field label="Kode OTP" error={errors?.otp || verifyForm.errors.otp}>
                            <input
                                className={`${inputClass} tracking-[0.4em]`}
                                maxLength={6}
                                placeholder="••••••"
                                value={verifyForm.data.otp}
                                onChange={(e) => verifyForm.setData('otp', e.target.value)}
                                autoFocus
                            />
                        </Field>
                        <button type="submit" className={`${btnPrimary} w-full`} disabled={verifyForm.processing}>
                            Verifikasi & Masuk
                        </button>
                        <button
                            type="button"
                            className={`${btnGhost} w-full`}
                            onClick={() => {
                                requestForm.setData('phone', otpPhone);
                                requestForm.post('/pelanggan/login/otp');
                            }}
                        >
                            Kirim ulang OTP
                        </button>
                    </form>
                )}
            </div>
        </PublicLayout>
    );
}
