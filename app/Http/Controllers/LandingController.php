<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\GalleryItem;
use App\Models\PageSection;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function __invoke(): Response
    {
        $settings = SiteSetting::map();
        $sections = PageSection::query()->get()->keyBy('key');

        return Inertia::render('Landing/Home', [
            'settings' => $settings,
            'hero' => $sections->get('hero'),
            'about' => $sections->get('about'),
            'announcements' => Announcement::query()
                ->published()
                ->orderBy('sort_order')
                ->orderByDesc('published_at')
                ->get(),
            'services' => Service::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'gallery' => GalleryItem::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'testimonials' => Testimonial::query()->where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }
}
