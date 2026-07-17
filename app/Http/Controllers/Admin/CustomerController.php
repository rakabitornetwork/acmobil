<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\WhatsAppOtpService;
use App\Support\PhoneNormalizer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Customer::query()->latest();

        if ($search = $request->string('q')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('plate_number', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $query->paginate(15)->withQueryString(),
            'filters' => ['q' => $request->string('q')->toString()],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:20'],
            'vehicle' => ['nullable', 'string', 'max:120'],
            'plate_number' => ['nullable', 'string', 'max:30'],
            'notes' => ['nullable', 'string'],
        ]);

        $data['phone'] = PhoneNormalizer::normalize($data['phone']);

        if (Customer::query()->where('phone', $data['phone'])->exists()) {
            return back()->withErrors(['phone' => 'Nomor WhatsApp sudah terdaftar.']);
        }

        Customer::query()->create($data);

        return back()->with('success', 'Pelanggan ditambahkan.');
    }

    public function update(Request $request, Customer $customer)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:20'],
            'vehicle' => ['nullable', 'string', 'max:120'],
            'plate_number' => ['nullable', 'string', 'max:30'],
            'notes' => ['nullable', 'string'],
        ]);

        $data['phone'] = PhoneNormalizer::normalize($data['phone']);

        if (Customer::query()->where('phone', $data['phone'])->where('id', '!=', $customer->id)->exists()) {
            return back()->withErrors(['phone' => 'Nomor WhatsApp sudah dipakai pelanggan lain.']);
        }

        $customer->update($data);

        return back()->with('success', 'Pelanggan diperbarui.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return back()->with('success', 'Pelanggan dihapus.');
    }

    public function resendOtp(Customer $customer, WhatsAppOtpService $otpService)
    {
        $result = $otpService->requestOtp($customer->phone);

        if (! $result['ok']) {
            return back()->with('error', $result['message']);
        }

        $message = $result['message'];
        if (! empty($result['otp_preview'])) {
            $message .= ' OTP: '.$result['otp_preview'];
        }

        return back()->with('success', $message)->with('otp', $result['otp_preview'] ?? null);
    }
}
