<?php

namespace App\Providers;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->ensureAnnouncementImageColumn();
        $this->ensureUserAvatarColumn();
    }

    /**
     * Safety net jika VPS sudah pull kode upload gambar
     * tetapi belum menjalankan migrate.
     */
    private function ensureAnnouncementImageColumn(): void
    {
        try {
            if (! Schema::hasTable('announcements')) {
                return;
            }

            if (Schema::hasColumn('announcements', 'image_path')) {
                return;
            }

            Schema::table('announcements', function (Blueprint $table) {
                $table->string('image_path')->nullable()->after('body');
            });
        } catch (\Throwable) {
            // Abaikan jika DB belum siap / read-only saat boot
        }
    }

    private function ensureUserAvatarColumn(): void
    {
        try {
            if (! Schema::hasTable('users')) {
                return;
            }

            if (Schema::hasColumn('users', 'avatar_path')) {
                return;
            }

            Schema::table('users', function (Blueprint $table) {
                $table->string('avatar_path')->nullable()->after('email');
            });
        } catch (\Throwable) {
            // Abaikan jika DB belum siap / read-only saat boot
        }
    }
}
