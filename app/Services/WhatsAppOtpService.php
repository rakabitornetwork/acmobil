<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\CustomerOtp;
use App\Support\PhoneNormalizer;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppOtpService
{
    public function requestOtp(string $phone): array
    {
        $phone = PhoneNormalizer::normalize($phone);
        $customer = Customer::query()->where('phone', $phone)->first();

        if (! $customer) {
            return [
                'ok' => false,
                'message' => 'Nomor WhatsApp belum terdaftar. Hubungi admin bengkel.',
            ];
        }

        $recent = CustomerOtp::query()
            ->where('phone', $phone)
            ->where('created_at', '>=', now()->subMinute())
            ->exists();

        if ($recent) {
            return [
                'ok' => false,
                'message' => 'Tunggu sebentar sebelum meminta OTP lagi.',
            ];
        }

        $code = (string) random_int(100000, 999999);

        CustomerOtp::query()->create([
            'phone' => $phone,
            'code' => Hash::make($code),
            'expires_at' => now()->addMinutes(5),
        ]);

        $customer->update([
            'last_otp' => $code,
            'last_otp_sent_at' => now(),
        ]);

        $sent = $this->sendViaGateway($phone, $code);

        if (! $sent) {
            Log::info('OTP pelanggan (gateway tidak aktif)', [
                'phone' => $phone,
                'otp' => $code,
            ]);
        }

        return [
            'ok' => true,
            'message' => $sent
                ? 'Kode OTP telah dikirim ke WhatsApp Anda.'
                : 'Kode OTP dibuat. Hubungi admin jika belum menerima pesan.',
            'otp_preview' => config('app.debug') ? $code : null,
            'customer_id' => $customer->id,
        ];
    }

    public function verify(string $phone, string $code): ?Customer
    {
        $phone = PhoneNormalizer::normalize($phone);

        $otp = CustomerOtp::query()
            ->where('phone', $phone)
            ->whereNull('consumed_at')
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (! $otp || ! Hash::check($code, $otp->code)) {
            return null;
        }

        $otp->update(['consumed_at' => now()]);

        return Customer::query()->where('phone', $phone)->first();
    }

    protected function sendViaGateway(string $phone, string $code): bool
    {
        $url = config('services.whatsapp.url');
        $token = config('services.whatsapp.token');

        if (! $url || ! $token) {
            return false;
        }

        $message = "Berkah Teknik — Kode OTP Anda: {$code}. Berlaku 5 menit.";

        try {
            $response = Http::withToken($token)
                ->timeout(10)
                ->post($url, [
                    'target' => $phone,
                    'message' => $message,
                    'device' => config('services.whatsapp.device'),
                ]);

            return $response->successful();
        } catch (\Throwable $e) {
            Log::warning('Gagal kirim OTP WhatsApp', ['error' => $e->getMessage()]);

            return false;
        }
    }
}
