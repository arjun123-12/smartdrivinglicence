<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
    protected $fillable = [
        'payment_id',
        'booking_id',
        'refund_reference',
        'amount',
        'currency',
        'reason',
        'refund_status',
        'gateway_refund_id',
        'processed_at',
        'processed_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'processed_at' => 'datetime',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}

