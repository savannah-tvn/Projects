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
        Schema::table('users', function(Blueprint $table) {
            $table->renameColumn('firstName', 'first_name');
            $table->renameColumn('lastName', 'last_name');
            $table->renameColumn('birthDate', 'birth_date');
            $table->renameColumn('cardDate', 'card_date');
            $table->renameColumn('cardNumber', 'card_number');
            $table->renameColumn('cardOwner', 'card_owner');
        });

        Schema::table('reviews', function(Blueprint $table) {
            $table->renameColumn('reviewerID', 'reviewer_id');
            $table->renameColumn('collectionID', 'collection_id');
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
