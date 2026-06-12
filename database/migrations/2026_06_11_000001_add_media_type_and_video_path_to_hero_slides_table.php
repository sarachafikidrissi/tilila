<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->enum('media_type', ['image', 'video'])
                ->default('image')
                ->after('image_path');
            $table->string('video_path', 500)->nullable()->after('media_type');
        });
    }

    public function down(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropColumn(['media_type', 'video_path']);
        });
    }
};
