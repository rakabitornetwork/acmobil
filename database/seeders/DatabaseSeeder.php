<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\CatalogItem;
use App\Models\Customer;
use App\Models\Mechanic;
use App\Models\PageSection;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'amon@teslatech.my.id'],
            [
                'name' => 'Admin Berkah Teknik',
                'password' => 'gantengmax',
            ]
        );

        $settings = [
            'company_name' => 'Berkah Teknik',
            'tagline' => 'Service AC Mobil · Sparepart · Sewa Alat · Jasa Pengerjaan',
            'whatsapp' => '6281234567890',
            'address' => 'Jl. Bengkel Raya No. 12, Indonesia',
            'hours' => 'Senin–Sabtu · 08.00–17.00 WIB',
            'instagram' => '',
            'facebook' => '',
            'email' => 'hello@berkahteknik.id',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::setValue($key, $value);
        }

        PageSection::query()->updateOrCreate(
            ['key' => 'hero'],
            [
                'title' => 'Performa dingin yang dapat diandalkan',
                'subtitle' => 'Workshop AC mobil & solusi kerja teknis',
                'body' => 'Dari service AC, sparepart, sewa alat kerja, hingga jasa pengerjaan — dikerjakan rapi oleh mekanik berpengalaman.',
                'cta_label' => 'Hubungi WhatsApp',
                'cta_url' => 'https://wa.me/6281234567890',
                'image_path' => 'cms/hero-berkah-teknik-4k.jpg',
            ]
        );

        PageSection::query()->updateOrCreate(
            ['key' => 'about'],
            [
                'title' => 'Tentang Berkah Teknik',
                'subtitle' => 'Presisi, kejujuran, dan hasil yang terasa',
                'body' => 'Berkah Teknik melayani perawatan AC mobil serta kebutuhan teknis bengkel: penjualan sparepart, sewa alat kerja, dan jasa pengerjaan. Setiap pekerjaan dicatat jelas melalui SPK agar pelanggan tahu siapa yang mengerjakan dan sampai mana progresnya.',
            ]
        );

        $services = [
            [
                'title' => 'Service AC Mobil',
                'type' => 'service_ac',
                'description' => 'Diagnosa, isi freon, cuci evaporator, perbaikan kompresor, dan perawatan berkala.',
                'price_label' => 'Mulai dari konsultasi',
                'sort_order' => 1,
            ],
            [
                'title' => 'Penjualan Sparepart',
                'type' => 'sparepart',
                'description' => 'Sparepart AC dan komponen terkait dengan kualitas terpercaya.',
                'price_label' => 'Harga sesuai item',
                'sort_order' => 2,
            ],
            [
                'title' => 'Sewa Alat Kerja',
                'type' => 'tool_rental',
                'description' => 'Sewa peralatan kerja untuk kebutuhan proyek dan bengkel.',
                'price_label' => 'Harian / proyek',
                'sort_order' => 3,
            ],
            [
                'title' => 'Jasa Pengerjaan',
                'type' => 'workmanship',
                'description' => 'Tenaga pengerjaan teknis dengan SPK dan penugasan mekanik yang jelas.',
                'price_label' => 'Sesuai lingkup kerja',
                'sort_order' => 4,
            ],
        ];

        foreach ($services as $service) {
            Service::query()->updateOrCreate(
                ['type' => $service['type'], 'title' => $service['title']],
                $service + ['is_active' => true]
            );
        }

        $testimonials = [
            [
                'name' => 'Andi Pratama',
                'content' => 'AC mobil dingin lagi dalam sehari. Progress bisa dilacak, mekaniknya jelas.',
                'rating' => 5,
                'sort_order' => 1,
            ],
            [
                'name' => 'Siti Rahma',
                'content' => 'Sparepart original dan pengerjaan rapi. Adminnya responsif via WhatsApp.',
                'rating' => 5,
                'sort_order' => 2,
            ],
            [
                'name' => 'Budi Santoso',
                'content' => 'Sewa alat kerja lancar, pengembalian fleksibel. Recommended.',
                'rating' => 4,
                'sort_order' => 3,
            ],
        ];

        foreach ($testimonials as $item) {
            Testimonial::query()->updateOrCreate(
                ['name' => $item['name']],
                $item + ['is_active' => true]
            );
        }

        $announcements = [
            [
                'title' => 'Promo cuci evaporator + isi freon',
                'body' => 'Paket hemat perawatan AC mobil sepanjang bulan ini. Booking via WhatsApp untuk jadwal prioritas.',
                'type' => 'promo',
                'cta_label' => 'Booking via WhatsApp',
                'cta_url' => 'https://wa.me/6281234567890',
                'sort_order' => 1,
            ],
            [
                'title' => 'Jam operasional libur nasional',
                'body' => 'Bengkel tutup pada hari libur nasional. Untuk keadaan darurat, hubungi nomor WhatsApp kami.',
                'type' => 'info',
                'cta_label' => null,
                'cta_url' => null,
                'sort_order' => 2,
            ],
        ];

        foreach ($announcements as $item) {
            Announcement::query()->updateOrCreate(
                ['title' => $item['title']],
                $item + [
                    'is_active' => true,
                    'published_at' => now(),
                ]
            );
        }

        Mechanic::query()->updateOrCreate(
            ['name' => 'Rizal Mekanik'],
            ['phone' => '6281111111111', 'is_active' => true]
        );

        Mechanic::query()->updateOrCreate(
            ['name' => 'Dedi Teknik'],
            ['phone' => '6281222222222', 'is_active' => true]
        );

        Customer::query()->updateOrCreate(
            ['phone' => '6281234567890'],
            [
                'name' => 'Pelanggan Demo',
                'vehicle' => 'Toyota Avanza',
                'plate_number' => 'B 1234 TES',
                'notes' => 'Akun demo untuk uji tracking.',
            ]
        );

        $catalog = [
            ['name' => 'Isi Freon R134a', 'type' => 'service_ac', 'default_price' => 150000, 'unit' => 'paket'],
            ['name' => 'Cuci Evaporator', 'type' => 'service_ac', 'default_price' => 250000, 'unit' => 'paket'],
            ['name' => 'Filter Cabin', 'type' => 'sparepart', 'default_price' => 85000, 'unit' => 'pcs'],
            ['name' => 'Sewa Vacuum Pump', 'type' => 'tool_rental', 'default_price' => 100000, 'unit' => 'hari'],
            ['name' => 'Jasa Pasang Komponen', 'type' => 'workmanship', 'default_price' => 200000, 'unit' => 'jasa'],
        ];

        foreach ($catalog as $item) {
            CatalogItem::query()->updateOrCreate(
                ['name' => $item['name'], 'type' => $item['type']],
                $item + ['is_active' => true, 'stock' => $item['type'] === 'sparepart' ? 20 : null]
            );
        }
    }
}
