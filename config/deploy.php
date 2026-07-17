<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Update dari GitHub (panel admin)
    |--------------------------------------------------------------------------
    |
    | Repo: https://github.com/rakabitornetwork/acmobil
    | Set DEPLOY_GITHUB_ENABLED=true di .env VPS untuk mengaktifkan tombol update.
    |
    */

    'enabled' => (bool) env('DEPLOY_GITHUB_ENABLED', true),

    'remote' => env('DEPLOY_GITHUB_REMOTE', 'origin'),

    'branch' => env('DEPLOY_GITHUB_BRANCH', 'main'),

    'github_compare_base' => env(
        'DEPLOY_GITHUB_COMPARE_BASE',
        'https://github.com/rakabitornetwork/acmobil'
    ),

    /** CLI PHP (bukan php-fpm). Contoh VPS: /usr/bin/php8.3 */
    'php_binary' => env('DEPLOY_PHP_BINARY'),

    'composer_binary' => env('DEPLOY_COMPOSER_BINARY', 'composer'),

    'timeout' => (int) env('DEPLOY_COMMAND_TIMEOUT', 300),

    /*
    | Di VPS, vendor/node_modules/build/storage sering tampak "kotor" — itu normal.
    | Production default: izinkan deploy (checkout -f akan timpa file ter-track di ignore list).
    */
    'allow_dirty_working_tree' => (bool) env('DEPLOY_ALLOW_DIRTY', true),

    'ignore_dirty_paths' => [
        'vendor',
        'node_modules',
        'public/build',
        'public/hot',
        'public/storage',
        'storage',
        'bootstrap/cache',
        '.env',
        '.npmrc',
        'build',
    ],

];
