<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Collection extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'collection';
    protected $fillable = [
        'name',
        'categorie_name'
    ];
    public function articles(): HasMany
    {
        return $this->hasMany(Articles::class, 'collection_name', 'name');
    }
}
