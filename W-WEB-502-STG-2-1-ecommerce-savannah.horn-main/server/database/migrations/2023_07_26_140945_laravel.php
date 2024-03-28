<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categorie', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('categorie_name')->nullable();
            $table->timestamps();
        });
        
        Schema::table('categorie', function (Blueprint $table) {
            $table->foreign('categorie_name')->references('name')->on('categorie')->onDelete('cascade');
        });
        
        Schema::create('collection', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('categorie_name');
            $table->timestamps();

            $table->foreign('categorie_name')->references('name')->on('categorie')->onDelete('cascade');

        });
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('description');
            $table->string('caracteristique');
            $table->string('collection_name');
            $table->integer('prix');
            $table->integer('poids');
            $table->string('couleur');
            $table->integer('stock');
            $table->integer('promotion')->nullable();

            $table->foreign('collection_name')->references('name')->on('collection')->onDelete('cascade');

        });
        Schema::create('photosArticles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('articleId');
            $table->string('urlPhoto');
            $table->timestamps();

            $table->foreign('articleId')->references('id')->on('articles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
