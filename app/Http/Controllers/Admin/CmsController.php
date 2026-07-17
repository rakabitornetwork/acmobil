<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\GalleryItem;
use App\Models\PageSection;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CmsController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Cms/Index', [
            'settings' => SiteSetting::map(),
            'hero' => PageSection::query()->where('key', 'hero')->first(),
            'about' => PageSection::query()->where('key', 'about')->first(),
            'services' => Service::query()->orderBy('sort_order')->get(),
            'gallery' => GalleryItem::query()->orderBy('sort_order')->get(),
            'testimonials' => Testimonial::query()->orderBy('sort_order')->get(),
            'announcements' => Announcement::query()->orderBy('sort_order')->orderByDesc('published_at')->get(),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'company_name' => ['nullable', 'string', 'max:120'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'hours' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:120'],
        ]);

        foreach ($data as $key => $value) {
            SiteSetting::setValue($key, $value);
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('cms', 'public');
            SiteSetting::setValue('logo', $path);
        }

        return back()->with('success', 'Pengaturan situs disimpan.');
    }

    public function updateSection(Request $request, string $key)
    {
        abort_unless(in_array($key, ['hero', 'about'], true), 404);

        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'body' => ['nullable', 'string'],
            'cta_label' => ['nullable', 'string', 'max:120'],
            'cta_url' => ['nullable', 'string', 'max:255'],
        ]);

        $section = PageSection::query()->updateOrCreate(['key' => $key], $data);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => ['image', 'max:12288', 'mimes:jpg,jpeg,png,webp'],
            ]);

            if ($section->image_path) {
                Storage::disk('public')->delete($section->image_path);
            }
            $section->update([
                'image_path' => $request->file('image')->store('cms', 'public'),
            ]);
        }

        return back()->with('success', 'Bagian '.$key.' disimpan.');
    }

    public function storeService(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'type' => ['required', 'in:service_ac,sparepart,tool_rental,workmanship'],
            'description' => ['nullable', 'string'],
            'price_label' => ['nullable', 'string', 'max:120'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $service = Service::query()->create($data + ['is_active' => $request->boolean('is_active', true)]);

        if ($request->hasFile('image')) {
            $service->update(['image_path' => $request->file('image')->store('cms', 'public')]);
        }

        return back()->with('success', 'Layanan ditambahkan.');
    }

    public function updateService(Request $request, Service $service)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'type' => ['required', 'in:service_ac,sparepart,tool_rental,workmanship'],
            'description' => ['nullable', 'string'],
            'price_label' => ['nullable', 'string', 'max:120'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $service->update($data + ['is_active' => $request->boolean('is_active')]);

        if ($request->hasFile('image')) {
            if ($service->image_path) {
                Storage::disk('public')->delete($service->image_path);
            }
            $service->update(['image_path' => $request->file('image')->store('cms', 'public')]);
        }

        return back()->with('success', 'Layanan diperbarui.');
    }

    public function destroyService(Service $service)
    {
        if ($service->image_path) {
            Storage::disk('public')->delete($service->image_path);
        }
        $service->delete();

        return back()->with('success', 'Layanan dihapus.');
    }

    public function storeGallery(Request $request)
    {
        $data = $request->validate([
            'caption' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['required', 'image', 'max:4096'],
            'is_active' => ['boolean'],
        ]);

        $path = $request->file('image')->store('cms', 'public');

        GalleryItem::query()->create([
            'caption' => $data['caption'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
            'image_path' => $path,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Foto galeri ditambahkan.');
    }

    public function destroyGallery(GalleryItem $gallery)
    {
        Storage::disk('public')->delete($gallery->image_path);
        $gallery->delete();

        return back()->with('success', 'Foto galeri dihapus.');
    }

    public function storeTestimonial(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'content' => ['required', 'string'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        Testimonial::query()->create($data + ['is_active' => $request->boolean('is_active', true)]);

        return back()->with('success', 'Testimoni ditambahkan.');
    }

    public function updateTestimonial(Request $request, Testimonial $testimonial)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'content' => ['required', 'string'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $testimonial->update($data + ['is_active' => $request->boolean('is_active')]);

        return back()->with('success', 'Testimoni diperbarui.');
    }

    public function destroyTestimonial(Testimonial $testimonial)
    {
        $testimonial->delete();

        return back()->with('success', 'Testimoni dihapus.');
    }

    public function storeAnnouncement(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'body' => ['nullable', 'string'],
            'type' => ['required', 'in:info,promo,urgent'],
            'cta_label' => ['nullable', 'string', 'max:120'],
            'cta_url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'image' => ['nullable', 'image', 'max:4096', 'mimes:jpg,jpeg,png,webp'],
        ]);

        unset($data['image']);

        $announcement = Announcement::query()->create([
            ...$data,
            'is_active' => $request->boolean('is_active', true),
            'published_at' => $data['published_at'] ?? now(),
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        if ($request->hasFile('image')) {
            $announcement->update([
                'image_path' => $request->file('image')->store('cms', 'public'),
            ]);
        }

        return back()->with('success', 'Berita singkat ditambahkan.');
    }

    public function updateAnnouncement(Request $request, Announcement $announcement)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'body' => ['nullable', 'string'],
            'type' => ['required', 'in:info,promo,urgent'],
            'cta_label' => ['nullable', 'string', 'max:120'],
            'cta_url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'image' => ['nullable', 'image', 'max:4096', 'mimes:jpg,jpeg,png,webp'],
        ]);

        unset($data['image']);

        $announcement->update([
            ...$data,
            'is_active' => $request->boolean('is_active'),
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        if ($request->hasFile('image')) {
            if ($announcement->image_path) {
                Storage::disk('public')->delete($announcement->image_path);
            }
            $announcement->update([
                'image_path' => $request->file('image')->store('cms', 'public'),
            ]);
        }

        return back()->with('success', 'Berita singkat diperbarui.');
    }

    public function destroyAnnouncement(Announcement $announcement)
    {
        if ($announcement->image_path) {
            Storage::disk('public')->delete($announcement->image_path);
        }
        $announcement->delete();

        return back()->with('success', 'Berita singkat dihapus.');
    }
}
