<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->enum('display_type', ['banner', 'carousel'])
                ->default('banner')
                ->after('path_prefix');
        });

        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropUnique(['path_prefix']);
        });
    }

    public function down(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->unique('path_prefix');
            $table->dropColumn('display_type');
        });
    }
};
