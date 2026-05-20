<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tilila_editions', function (Blueprint $table) {
            $table->string('ceremony_video_url', 2048)->nullable()->after('theme');
        });
    }

    public function down(): void
    {
        Schema::table('tilila_editions', function (Blueprint $table) {
            $table->dropColumn('ceremony_video_url');
        });
    }
};
