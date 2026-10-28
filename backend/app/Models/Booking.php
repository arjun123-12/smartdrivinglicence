<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'booking_reference',
        'customer_id',
        'instructor_id',
        'service_type_id',
        'package_id',
        'location_id',
        'start_time',
        'end_time',
        'timezone',
        'booking_status',
        'price_snapshot',
        'currency',
        'payment_status',
        'pickup_address',
        'notes',
        'cancellation_reason',
        'cancelled_at',
        'rescheduled_from_id',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'cancelled_at' => 'datetime',
        'price_snapshot' => 'decimal:2',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }

    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function package()
    {
        return $this->belongsTo(LessonPackage::class, 'package_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function items()
    {
        return $this->hasMany(BookingItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function latestPayment()
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }
}

