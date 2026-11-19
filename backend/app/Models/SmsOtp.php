<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsOtp extends Model
{
    protected $fillable = [
        'phone',
        'otp_code',
        'purpose',
        'expires_at',
        'attempts',
        'resend_after',
        'is_used',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'resend_after' => 'datetime',
        'attempts' => 'integer',
        'is_used' => 'boolean',
    ];
}
