<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Articles extends Model
{
    use HasFactory, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'description',
        'caracteristique',
        'collection_name',
        'prix',
        'poids',
        'promotion',
        'couleur',
        'stock_bobine',
        'stock_bande',
        'stock_vrac'
    ];
    public function photo(): HasMany
    {
        return $this->hasMany(PhotosArticles::class, 'ArticleId', 'id');
    }
}
