<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{

        /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'price_total',
        'delivery_status',
        'paid_status',
        'guest_last_name',
        'guest_first_name',
        'guest_address',
        'tracking_number'
    ];

    use HasFactory;
}
