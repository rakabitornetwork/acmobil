<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mechanic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MechanicController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Mechanics/Index', [
            'mechanics' => Mechanic::query()->latest()->paginate(20),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:30'],
            'is_active' => ['boolean'],
        ]);

        Mechanic::query()->create($data + ['is_active' => $request->boolean('is_active', true)]);

        return back()->with('success', 'Mekanik ditambahkan.');
    }

    public function update(Request $request, Mechanic $mechanic)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:30'],
            'is_active' => ['boolean'],
        ]);

        $mechanic->update($data + ['is_active' => $request->boolean('is_active')]);

        return back()->with('success', 'Mekanik diperbarui.');
    }

    public function destroy(Mechanic $mechanic)
    {
        $mechanic->delete();

        return back()->with('success', 'Mekanik dihapus.');
    }
}
