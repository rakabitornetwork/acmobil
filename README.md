# Berkah Teknik

Aplikasi web workshop **Berkah Teknik** — service AC mobil, sparepart, sewa alat, dan jasa pengerjaan.

Sistem ini menggabungkan:

- **Landing page CMS** — konten beranda (hero, tentang, layanan, galeri, testimoni) dikelola dari admin
- **Panel admin** — katalog, pelanggan, transaksi, SPK (surat perintah kerja), dan mekanik
- **Portal pelanggan** — login via OTP WhatsApp untuk melacak progres pekerjaan

---

## Fitur utama

| Area | Fungsi |
|------|--------|
| Publik | Landing page, CTA WhatsApp, tautan lacak pekerjaan |
| Admin `/admin` | Dashboard, CMS landing, katalog, pelanggan, transaksi (slip cetak), SPK, mekanik |
| Pelanggan `/pelanggan` | Login OTP WhatsApp, daftar SPK aktif/riwayat, detail SPK |
| Integrasi | Gateway WhatsApp untuk kirim OTP |

---

## Stack teknologi

| Lapisan | Teknologi |
|---------|-----------|
| Backend | PHP 8.3+, Laravel 13 |
| Frontend | React 19, Inertia.js, Tailwind CSS 4 |
| Build | Vite 8 |
| Database | SQLite (default) / MySQL / PostgreSQL |
| Session & cache | Database driver (Redis opsional) |

---

## Persyaratan sistem

### Server

- Ubuntu 22.04 / 24.04 (atau distro Linux setara)
- **PHP 8.3+** dengan ekstensi: `bcmath`, `ctype`, `curl`, `fileinfo`, `json`, `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`, `gd`
  - SQLite: `pdo_sqlite`, `sqlite3`
  - MySQL: `pdo_mysql`
- **Composer** 2.x
- **Node.js** 20+ dan **npm** (untuk build aset frontend)
- Web server: **Apache** (`mod_rewrite`) atau **Nginx**
- Database: SQLite (tanpa server DB) **atau** MySQL 8+ / MariaDB

### Opsional

- Redis (jika ingin mengganti cache/session/queue)
- Gateway WhatsApp API (untuk OTP produksi)
- SSL/TLS (Let's Encrypt)

---

## Struktur proyek (singkat)

```
.
├── app/                 # Controllers, Models, Services
├── database/            # Migrations, seeders, SQLite
├── public/              # Entry Laravel standar + hasil build Vite
├── resources/js/        # Halaman React (Inertia)
├── routes/web.php       # Routing aplikasi
├── index.php            # Front controller (document root = root proyek)
├── .htaccess            # Rewrite Apache untuk shared hosting / Virtualmin
├── build -> public/build
└── storage/             # Upload, log, cache
```

Aplikasi ini mendukung dua cara document root:

1. **Root proyek** (seperti shared hosting / Virtualmin) — memakai `index.php` + `.htaccess` di root
2. **Folder `public/`** (Laravel klasik) — document root mengarah ke `public/`

---

## Instalasi lokal (development)

```bash
# 1. Clone / salin proyek
cd /path/ke/berkah-teknik

# 2. Dependensi PHP & Node
composer install
npm install --ignore-scripts

# 3. Environment
cp .env.example .env
php artisan key:generate

# 4. Database SQLite
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link

# 5. Build frontend (atau pakai npm run dev)
npm run build

# 6. Jalankan server development (sekali perintah)
composer run dev
```

Atau jalankan terpisah:

```bash
php artisan serve
npm run dev
```

Buka: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## Instalasi di VPS (produksi)

Panduan di bawah memakai **Ubuntu + Apache + PHP-FPM + MySQL**. Sesuaikan nama domain dan path.

### 1. Persiapan server

```bash
sudo apt update && sudo apt upgrade -y

# PHP 8.3 + ekstensi umum Laravel
sudo apt install -y \
  apache2 \
  php8.3 php8.3-fpm php8.3-cli php8.3-common \
  php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip \
  php8.3-bcmath php8.3-gd php8.3-sqlite3 php8.3-mysql \
  mysql-server \
  unzip curl git

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Node.js 22 (NodeSource) — contoh
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Aktifkan modul Apache:

```bash
sudo a2enmod rewrite proxy_fcgi setenvif ssl headers
sudo a2enconf php8.3-fpm
sudo systemctl restart apache2
```

### 2. Database MySQL (disarankan untuk produksi)

```bash
sudo mysql -e "CREATE DATABASE berkah_teknik CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'berkah'@'localhost' IDENTIFIED BY 'GANTI_PASSWORD_KUAT';"
sudo mysql -e "GRANT ALL PRIVILEGES ON berkah_teknik.* TO 'berkah'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

> Untuk skala kecil / VPS terbatas, SQLite tetap bisa dipakai: set `DB_CONNECTION=sqlite` dan buat file `database/database.sqlite`.

### 3. Deploy kode aplikasi

```bash
# Contoh path document root
sudo mkdir -p /var/www/berkah-teknik
sudo chown -R $USER:www-data /var/www/berkah-teknik

# Clone dari Git (atau upload via rsync/scp)
cd /var/www/berkah-teknik
git clone <URL_REPO_ANDA> .

# Atau jika sudah di-upload ke public_html:
# cd /home/user/public_html
```

### 4. Konfigurasi environment

```bash
cp .env.example .env
nano .env
```

Isi minimal untuk produksi:

```env
APP_NAME="Berkah Teknik"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domain-anda.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=berkah_teknik
DB_USERNAME=berkah
DB_PASSWORD=GANTI_PASSWORD_KUAT

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

# WhatsApp OTP (wajib di produksi agar OTP terkirim)
WHATSAPP_API_URL=https://api-gateway-anda/endpoint
WHATSAPP_API_TOKEN=token_anda
WHATSAPP_API_DEVICE=device_id
```

Lalu:

```bash
php artisan key:generate
```

### 5. Install dependensi & build

```bash
composer install --no-dev --optimize-autoloader
npm install --ignore-scripts
npm run build

php artisan migrate --force --seed
php artisan storage:link

# Optimasi produksi
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 6. Izin folder

```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo find storage bootstrap/cache -type d -exec chmod 775 {} \;
sudo find storage bootstrap/cache -type f -exec chmod 664 {} \;

# Jika document root = root proyek (shared hosting style)
ln -sfn public/build build
```

Pastikan file upload PHP cukup (sudah ada `.user.ini` di proyek: 16M / 20M). Sesuaikan juga `php.ini` / pool FPM jika perlu.

### 7. Virtual host Apache

#### Opsi A — Document root = root proyek (cocok dengan setup Virtualmin / `public_html`)

Proyek sudah punya `index.php` dan `.htaccess` di root yang meneruskan `/build` dan `/storage`.

```apache
<VirtualHost *:80>
    ServerName domain-anda.com
    DocumentRoot /var/www/berkah-teknik

    <Directory /var/www/berkah-teknik>
        AllowOverride All
        Require all granted
    </Directory>

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/berkah-error.log
    CustomLog ${APACHE_LOG_DIR}/berkah-access.log combined
</VirtualHost>
```

#### Opsi B — Document root = `public/` (Laravel klasik, lebih aman)

```apache
<VirtualHost *:80>
    ServerName domain-anda.com
    DocumentRoot /var/www/berkah-teknik/public

    <Directory /var/www/berkah-teknik/public>
        AllowOverride All
        Require all granted
    </Directory>

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/berkah-error.log
    CustomLog ${APACHE_LOG_DIR}/berkah-access.log combined
</VirtualHost>
```

Aktifkan situs:

```bash
sudo a2ensite berkah-teknik.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### 8. SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d domain-anda.com
```

Pastikan `APP_URL` memakai `https://...`.

### 9. Contoh Nginx (document root `public/`)

```nginx
server {
    listen 80;
    server_name domain-anda.com;
    root /var/www/berkah-teknik/public;
    index index.php;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## Akun default (setelah `db:seed`)

| Peran | URL | Kredensial |
|-------|-----|------------|
| Admin | `/admin/login` | Email: `amon@teslatech.my.id` · Password: `gantengmax` |
| Pelanggan demo | `/pelanggan/login` | Nomor: `6281234567890` |

**Wajib diganti di produksi:** password admin dan data kontak demo dari seeder.

---

## Variabel lingkungan penting

| Variabel | Keterangan |
|----------|------------|
| `APP_KEY` | Dihasilkan `php artisan key:generate` |
| `APP_URL` | URL publik lengkap (https) |
| `APP_ENV` / `APP_DEBUG` | Produksi: `production` / `false` |
| `DB_*` | Koneksi database |
| `WHATSAPP_API_URL` | Endpoint kirim pesan WhatsApp |
| `WHATSAPP_API_TOKEN` | Bearer token API |
| `WHATSAPP_API_DEVICE` | ID perangkat gateway |

Jika gateway WhatsApp belum dikonfigurasi dan `APP_DEBUG=true`, OTP dapat muncul sebagai preview di UI (hanya untuk development). Di produksi set `APP_DEBUG=false` dan isi kredensial WhatsApp.

---

## URL penting

| URL | Fungsi |
|-----|--------|
| `/` | Landing page |
| `/admin/login` | Login admin |
| `/admin` | Dashboard admin |
| `/admin/cms` | Kelola konten landing |
| `/admin/catalog` | Katalog |
| `/admin/customers` | Pelanggan |
| `/admin/transactions` | Transaksi |
| `/admin/work-orders` | SPK |
| `/admin/mechanics` | Mekanik |
| `/pelanggan/login` | Login pelanggan (OTP) |
| `/pelanggan` | Dashboard pelanggan |
| `/up` | Health check Laravel |

---

## Update aplikasi di VPS

```bash
cd /var/www/berkah-teknik

# Mode maintenance (opsional)
php artisan down

git pull origin main   # atau branch Anda
composer install --no-dev --optimize-autoloader
npm install --ignore-scripts
npm run build
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan up
```

---

## Pengembangan lokal cepat

```bash
composer run setup   # install + .env + migrate + npm build
composer run dev     # serve + queue + log + Vite HMR
composer test        # jalankan PHPUnit
```

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Halaman putih / 500 | Cek `storage/logs/laravel.log`, pastikan `APP_KEY` ada, folder `storage` & `bootstrap/cache` writable |
| CSS/JS tidak muncul | Jalankan `npm run build`, pastikan symlink `build → public/build` (jika docroot root), hard refresh browser |
| Upload gagal | Naikkan `upload_max_filesize` / `post_max_size`, cek izin `storage/app/public` |
| OTP tidak terkirim | Isi `WHATSAPP_API_*`, cek koneksi keluar ke gateway, lihat log |
| Rewrite 404 | Pastikan `AllowOverride All` + `mod_rewrite` (Apache) atau `try_files` (Nginx) |
| Permission denied | `chown` ke user web server (`www-data`) pada `storage` dan `bootstrap/cache` |

---

## Keamanan produksi (checklist)

- [ ] `APP_DEBUG=false`, `APP_ENV=production`
- [ ] Password admin seeder diganti
- [ ] HTTPS aktif
- [ ] Kredensial DB & WhatsApp tidak di-commit ke Git
- [ ] Document root mengarah ke `public/` jika memungkinkan
- [ ] Backup database berkala
- [ ] `php artisan config:cache` setelah mengubah `.env`

---

## Lisensi

Kode kerangka berbasis [Laravel](https://laravel.com) (MIT). Konten dan kustomisasi Berkah Teknik mengikuti kebijakan pemilik proyek.
