<?php

use App\Http\Controllers\Admin\CatalogController;
use App\Http\Controllers\Admin\CmsController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MechanicController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\WorkOrderController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auth\CustomerLoginController;
use App\Http\Controllers\Customer\PortalController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AdminLoginController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [AdminLoginController::class, 'store']);
});

Route::post('/admin/logout', [AdminLoginController::class, 'destroy'])
    ->middleware('auth')
    ->name('admin.logout');

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');

    Route::get('/cms', [CmsController::class, 'edit'])->name('cms.edit');
    Route::post('/cms/settings', [CmsController::class, 'updateSettings'])->name('cms.settings');
    Route::post('/cms/sections/{key}', [CmsController::class, 'updateSection'])->name('cms.sections');
    Route::post('/cms/services', [CmsController::class, 'storeService'])->name('cms.services.store');
    Route::post('/cms/services/{service}', [CmsController::class, 'updateService'])->name('cms.services.update');
    Route::delete('/cms/services/{service}', [CmsController::class, 'destroyService'])->name('cms.services.destroy');
    Route::post('/cms/gallery', [CmsController::class, 'storeGallery'])->name('cms.gallery.store');
    Route::delete('/cms/gallery/{gallery}', [CmsController::class, 'destroyGallery'])->name('cms.gallery.destroy');
    Route::post('/cms/testimonials', [CmsController::class, 'storeTestimonial'])->name('cms.testimonials.store');
    Route::post('/cms/testimonials/{testimonial}', [CmsController::class, 'updateTestimonial'])->name('cms.testimonials.update');
    Route::delete('/cms/testimonials/{testimonial}', [CmsController::class, 'destroyTestimonial'])->name('cms.testimonials.destroy');

    Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');
    Route::post('/catalog', [CatalogController::class, 'store'])->name('catalog.store');
    Route::post('/catalog/{catalog}', [CatalogController::class, 'update'])->name('catalog.update');
    Route::delete('/catalog/{catalog}', [CatalogController::class, 'destroy'])->name('catalog.destroy');

    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::post('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');
    Route::post('/customers/{customer}/otp', [CustomerController::class, 'resendOtp'])->name('customers.otp');

    Route::get('/mechanics', [MechanicController::class, 'index'])->name('mechanics.index');
    Route::post('/mechanics', [MechanicController::class, 'store'])->name('mechanics.store');
    Route::post('/mechanics/{mechanic}', [MechanicController::class, 'update'])->name('mechanics.update');
    Route::delete('/mechanics/{mechanic}', [MechanicController::class, 'destroy'])->name('mechanics.destroy');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/create', [TransactionController::class, 'create'])->name('transactions.create');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::get('/transactions/{transaction}/print', [TransactionController::class, 'print'])->name('transactions.print');
    Route::get('/transactions/{transaction}/edit', [TransactionController::class, 'edit'])->name('transactions.edit');
    Route::post('/transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::post('/transactions/{transaction}/paid', [TransactionController::class, 'markPaid'])->name('transactions.paid');
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    Route::get('/work-orders', [WorkOrderController::class, 'index'])->name('work-orders.index');
    Route::get('/work-orders/create', [WorkOrderController::class, 'create'])->name('work-orders.create');
    Route::post('/work-orders', [WorkOrderController::class, 'store'])->name('work-orders.store');
    Route::get('/work-orders/{workOrder}', [WorkOrderController::class, 'show'])->name('work-orders.show');
    Route::get('/work-orders/{workOrder}/print', [WorkOrderController::class, 'print'])->name('work-orders.print');
    Route::get('/work-orders/{workOrder}/edit', [WorkOrderController::class, 'edit'])->name('work-orders.edit');
    Route::post('/work-orders/{workOrder}', [WorkOrderController::class, 'update'])->name('work-orders.update');
    Route::delete('/work-orders/{workOrder}', [WorkOrderController::class, 'destroy'])->name('work-orders.destroy');
});

Route::prefix('pelanggan')->name('customer.')->group(function () {
    Route::middleware('guest:customer')->group(function () {
        Route::get('/login', [CustomerLoginController::class, 'create'])->name('login');
        Route::post('/login/otp', [CustomerLoginController::class, 'requestOtp'])->name('login.otp');
        Route::post('/login/verify', [CustomerLoginController::class, 'verify'])->name('login.verify');
    });

    Route::post('/logout', [CustomerLoginController::class, 'destroy'])
        ->middleware('auth:customer')
        ->name('logout');

    Route::middleware('auth:customer')->group(function () {
        Route::get('/', [PortalController::class, 'dashboard'])->name('dashboard');
        Route::get('/spk/{workOrder}', [PortalController::class, 'show'])->name('spk.show');
    });
});
