<?php

namespace App\Services;

use App\Models\CatalogItem;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class CatalogSyncService
{
    public function syncFromPaidTransaction(Transaction $transaction): void
    {
        DB::transaction(function () use ($transaction) {
            $transaction->loadMissing('items');

            foreach ($transaction->items as $item) {
                if ($item->catalog_item_id) {
                    continue;
                }

                $catalog = CatalogItem::query()->firstOrCreate(
                    [
                        'name' => $item->name,
                        'type' => $item->type,
                    ],
                    [
                        'default_price' => $item->unit_price,
                        'unit' => 'pcs',
                        'is_active' => true,
                    ]
                );

                $item->update(['catalog_item_id' => $catalog->id]);
            }
        });
    }
}
