<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tililab_editions', function (Blueprint $table) {
            if (! Schema::hasColumn('tililab_editions', 'ceremony_video_path')) {
                $table->string('ceremony_video_path', 500)->nullable()->after('ceremony_video_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tililab_editions', function (Blueprint $table) {
            if (Schema::hasColumn('tililab_editions', 'ceremony_video_path')) {
                $table->dropColumn('ceremony_video_path');
            }
        });
    }
};
