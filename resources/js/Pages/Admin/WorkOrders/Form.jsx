import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import DatePicker from '../../../Components/DatePicker';
import { Field, inputClass, btnPrimary } from '../../../Components/ui';

function toScheduleValue(value) {
    if (!value) return '';
    const raw = String(value).replace(' ', 'T');
    return raw.length >= 16 ? raw.slice(0, 16) : raw.slice(0, 10);
}

export default function WorkOrderForm({ workOrder, customers, mechanics, transactions, prefill_transaction_id }) {
    const form = useForm({
        customer_id: workOrder?.customer_id || '',
        transaction_id: workOrder?.transaction_id || prefill_transaction_id || '',
        mechanic_id: workOrder?.mechanic_id || '',
        status: workOrder?.status || 'pending',
        vehicle: workOrder?.vehicle || '',
        plate_number: workOrder?.plate_number || '',
        description: workOrder?.description || '',
        notes: workOrder?.notes || '',
        scheduled_at: toScheduleValue(workOrder?.scheduled_at),
    });

    useEffect(() => {
        if (!prefill_transaction_id) return;
        const tx = transactions.find((t) => t.id === prefill_transaction_id);
        if (tx) {
            form.setData({
                ...form.data,
                transaction_id: tx.id,
                customer_id: tx.customer_id,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prefill_transaction_id]);

    const onTransactionChange = (id) => {
        const tx = transactions.find((t) => String(t.id) === String(id));
        form.setData({
            ...form.data,
            transaction_id: id,
            customer_id: tx?.customer_id || form.data.customer_id,
            vehicle: tx?.customer?.vehicle || form.data.vehicle,
            plate_number: tx?.customer?.plate_number || form.data.plate_number,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (workOrder) {
            form.post(`/admin/work-orders/${workOrder.id}`);
        } else {
            form.post('/admin/work-orders');
        }
    };

    return (
        <AdminLayout title={workOrder ? 'Edit SPK' : 'Buat SPK'}>
            <Head title={workOrder ? 'Edit SPK' : 'Buat SPK'} />
            <form onSubmit={submit} className="surface-panel max-w-3xl space-y-4 rounded-sm p-6">
                <Field label="Transaksi terkait">
                    <select
                        className={inputClass}
                        value={form.data.transaction_id || ''}
                        onChange={(e) => onTransactionChange(e.target.value)}
                    >
                        <option value="">Tanpa transaksi</option>
                        {transactions.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.number} — {t.customer?.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Pelanggan" error={form.errors.customer_id}>
                    <select
                        className={inputClass}
                        value={form.data.customer_id}
                        onChange={(e) => {
                            const c = customers.find((x) => String(x.id) === e.target.value);
                            form.setData({
                                ...form.data,
                                customer_id: e.target.value,
                                vehicle: c?.vehicle || form.data.vehicle,
                                plate_number: c?.plate_number || form.data.plate_number,
                            });
                        }}
                    >
                        <option value="">Pilih pelanggan</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} — {c.phone}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Mekanik">
                    <select
                        className={inputClass}
                        value={form.data.mechanic_id || ''}
                        onChange={(e) => form.setData('mechanic_id', e.target.value)}
                    >
                        <option value="">Belum ditugaskan</option>
                        {mechanics.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Status">
                    <select className={inputClass} value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                        <option value="pending">Menunggu</option>
                        <option value="in_progress">Dikerjakan</option>
                        <option value="done">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Kendaraan">
                        <input className={inputClass} value={form.data.vehicle} onChange={(e) => form.setData('vehicle', e.target.value)} />
                    </Field>
                    <Field label="Plat nomor">
                        <input className={inputClass} value={form.data.plate_number} onChange={(e) => form.setData('plate_number', e.target.value)} />
                    </Field>
                </div>
                <Field label="Deskripsi pekerjaan">
                    <textarea className={inputClass} rows={4} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                </Field>
                <Field label="Catatan internal">
                    <textarea className={inputClass} rows={2} value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                </Field>
                <DatePicker
                    label="Jadwal"
                    value={form.data.scheduled_at}
                    error={form.errors.scheduled_at}
                    onChange={(val) => form.setData('scheduled_at', val)}
                />

                <button type="submit" className={btnPrimary} disabled={form.processing}>
                    Simpan SPK
                </button>
            </form>
        </AdminLayout>
    );
}
