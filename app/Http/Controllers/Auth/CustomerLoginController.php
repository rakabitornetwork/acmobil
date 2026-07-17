<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\WhatsAppOtpService;
use App\Support\PhoneNormalizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CustomerLoginController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Customer/Login');
    }

    public function requestOtp(Request $request, WhatsAppOtpService $otpService)
    {
        $data = $request->validate([
            'phone' => ['required', 'string', 'min:8', 'max:20'],
        ]);

        $result = $otpService->requestOtp($data['phone']);

        if (! $result['ok']) {
            return back()->withErrors(['phone' => $result['message']])->onlyInput('phone');
        }

        $flash = [
            'success' => $result['message'],
            'otp_phone' => PhoneNormalizer::normalize($data['phone']),
        ];

        if (! empty($result['otp_preview'])) {
            $flash['otp'] = $result['otp_preview'];
        }

        return back()->with($flash);
    }

    public function verify(Request $request, WhatsAppOtpService $otpService)
    {
        $data = $request->validate([
            'phone' => ['required', 'string'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $customer = $otpService->verify($data['phone'], $data['otp']);

        if (! $customer) {
            return back()->withErrors([
                'otp' => 'Kode OTP tidak valid atau sudah kedaluwarsa.',
            ])->with('otp_phone', PhoneNormalizer::normalize($data['phone']));
        }

        Auth::guard('customer')->login($customer, true);
        $request->session()->regenerate();

        return redirect()->route('customer.dashboard');
    }

    public function destroy(Request $request)
    {
        Auth::guard('customer')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('customer.login');
    }
}
