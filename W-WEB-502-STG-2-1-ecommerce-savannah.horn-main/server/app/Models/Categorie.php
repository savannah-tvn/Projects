<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categorie extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'categorie';
    protected $fillable = [
        'name',
        'categorie_name'
    ];
    public function collection(): HasMany
    {
        return $this->hasMany(Collection::class, 'categorie_name', 'name');
    }
}
