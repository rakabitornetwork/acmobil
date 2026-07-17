<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = CatalogItem::query()->latest();

        if ($search = $request->string('q')->toString()) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($type = $request->string('type')->toString()) {
            $query->where('type', $type);
        }

        return Inertia::render('Admin/Catalog/Index', [
            'items' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'q' => $request->string('q')->toString(),
                'type' => $request->string('type')->toString(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'type' => ['required', 'in:sparepart,service_ac,tool_rental,workmanship'],
            'default_price' => ['required', 'numeric', 'min:0'],
            'unit' => ['nullable', 'string', 'max:40'],
            'stock' => ['nullable', 'integer'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        CatalogItem::query()->create($data + [
            'unit' => $data['unit'] ?? 'pcs',
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Item katalog ditambahkan.');
    }

    public function update(Request $request, CatalogItem $catalog)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'type' => ['required', 'in:sparepart,service_ac,tool_rental,workmanship'],
            'default_price' => ['required', 'numeric', 'min:0'],
            'unit' => ['nullable', 'string', 'max:40'],
            'stock' => ['nullable', 'integer'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $catalog->update($data + [
            'unit' => $data['unit'] ?? 'pcs',
            'is_active' => $request->boolean('is_active'),
        ]);

        return back()->with('success', 'Item katalog diperbarui.');
    }

    public function destroy(CatalogItem $catalog)
    {
        $catalog->delete();

        return back()->with('success', 'Item katalog dihapus.');
    }
}
