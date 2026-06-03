<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tililab_participants', function (Blueprint $table) {
            $table->string('original_video_link', 2048)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('tililab_participants', function (Blueprint $table) {
            $table->string('original_video_link', 2048)->nullable(false)->change();
        });
    }
};
