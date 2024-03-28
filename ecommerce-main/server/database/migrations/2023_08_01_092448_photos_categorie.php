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
        Schema::create('photosCategorie', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('categorieId');
            $table->string('urlPhoto');
            $table->timestamps();

            $table->foreign('categorieId')->references('id')->on('categorie')->onDelete('cascade');
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
