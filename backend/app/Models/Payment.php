<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'booking_id',
        'payment_reference',
        'gateway',
        'transaction_id',
        'amount',
        'currency',
        'payment_status',
        'payment_method',
        'gateway_response',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_response' => 'array',
        'paid_at' => 'datetime',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }
}

