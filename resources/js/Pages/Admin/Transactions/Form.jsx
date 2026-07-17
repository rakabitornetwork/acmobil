import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, btnPrimary, btnGhost, typeLabel, formatRupiah } from '../../../Components/ui';

const emptyItem = () => ({
    catalog_item_id: '',
    name: '',
    type: 'service_ac',
    qty: 1,
    unit_price: 0,
});

export default function TransactionForm({ transaction, customers, catalog }) {
    const form = useForm({
        customer_id: transaction?.customer_id || '',
        status: transaction?.status || 'unpaid',
        notes: transaction?.notes || '',
        items: transaction?.items?.length
            ? transaction.items.map((i) => ({
                  catalog_item_id: i.catalog_item_id || '',
                  name: i.name,
                  type: i.type,
                  qty: i.qty,
                  unit_price: i.unit_price,
              }))
            : [emptyItem()],
    });

    const total = form.data.items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.unit_price || 0), 0);

    const applyCatalog = (index, catalogId) => {
        const selected = catalog.find((c) => String(c.id) === String(catalogId));
        const items = [...form.data.items];
        if (!selected) {
            items[index] = { ...items[index], catalog_item_id: '' };
            form.setData('items', items);
            return;
        }
        items[index] = {
            catalog_item_id: selected.id,
            name: selected.name,
            type: selected.type,
            qty: items[index].qty || 1,
            unit_price: selected.default_price,
        };
        form.setData('items', items);
    };

    const submit = (e) => {
        e.preventDefault();
        if (transaction) {
            form.post(`/admin/transactions/${transaction.id}`);
        } else {
            form.post('/admin/transactions');
        }
    };

    return (
        <AdminLayout title={transaction ? 'Edit Transaksi' : 'Buat Transaksi'}>
            <Head title={transaction ? 'Edit Transaksi' : 'Buat Transaksi'} />
            <form onSubmit={submit} className="space-y-6">
                <div className="surface-panel grid gap-4 rounded-sm p-5 md:grid-cols-2">
                    <Field label="Pelanggan" error={form.errors.customer_id}>
                        <select
                            className={inputClass}
                            value={form.data.customer_id}
                            onChange={(e) => form.setData('customer_id', e.target.value)}
                        >
                            <option value="">Pilih pelanggan</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} — {c.phone}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Status">
                        <select className={inputClass} value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                            <option value="draft">Draft</option>
                            <option value="unpaid">Belum Lunas</option>
                            <option value="paid">Lunas</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                    </Field>
                    <Field label="Catatan">
                        <textarea className={inputClass} rows={2} value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                    </Field>
                </div>

                <div className="surface-panel rounded-sm p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-display text-2xl">Item</h2>
                        <button
                            type="button"
                            className={btnGhost}
                            onClick={() => form.setData('items', [...form.data.items, emptyItem()])}
                        >
                            + Tambah baris
                        </button>
                    </div>
                    <div className="space-y-4">
                        {form.data.items.map((item, index) => (
                            <div key={index} className="grid gap-3 border-b border-steel/40 pb-4 md:grid-cols-6">
                                <Field label="Dari katalog">
                                    <select
                                        className={inputClass}
                                        value={item.catalog_item_id || ''}
                                        onChange={(e) => applyCatalog(index, e.target.value)}
                                    >
                                        <option value="">Ketik manual</option>
                                        {catalog.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({typeLabel(c.type)})
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Nama">
                                    <input
                                        className={inputClass}
                                        value={item.name}
                                        onChange={(e) => {
                                            const items = [...form.data.items];
                                            items[index].name = e.target.value;
                                            form.setData('items', items);
                                        }}
                                    />
                                </Field>
                                <Field label="Tipe">
                                    <select
                                        className={inputClass}
                                        value={item.type}
                                        onChange={(e) => {
                                            const items = [...form.data.items];
                                            items[index].type = e.target.value;
                                            form.setData('items', items);
                                        }}
                                    >
                                        <option value="service_ac">Service AC</option>
                                        <option value="sparepart">Sparepart</option>
                                        <option value="tool_rental">Sewa Alat</option>
                                        <option value="workmanship">Jasa Pengerjaan</option>
                                    </select>
                                </Field>
                                <Field label="Qty">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={inputClass}
                                        value={item.qty}
                                        onChange={(e) => {
                                            const items = [...form.data.items];
                                            items[index].qty = e.target.value;
                                            form.setData('items', items);
                                        }}
                                    />
                                </Field>
                                <Field label="Harga">
                                    <input
                                        type="number"
                                        className={inputClass}
                                        value={item.unit_price}
                                        onChange={(e) => {
                                            const items = [...form.data.items];
                                            items[index].unit_price = e.target.value;
                                            form.setData('items', items);
                                        }}
                                    />
                                </Field>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        className="text-sm text-danger"
                                        onClick={() =>
                                            form.setData(
                                                'items',
                                                form.data.items.filter((_, i) => i !== index),
                                            )
                                        }
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-right font-display text-3xl text-brass-light">{formatRupiah(total)}</p>
                </div>

                <button type="submit" className={btnPrimary} disabled={form.processing}>
                    {form.processing ? 'Menyimpan...' : 'Simpan transaksi'}
                </button>
            </form>
        </AdminLayout>
    );
}
