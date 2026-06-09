<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tililab_editions', function (Blueprint $table) {
            if (! Schema::hasColumn('tililab_editions', 'cover_image_path')) {
                $table->string('cover_image_path', 500)->nullable()->after('theme');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tililab_editions', function (Blueprint $table) {
            if (Schema::hasColumn('tililab_editions', 'cover_image_path')) {
                $table->dropColumn('cover_image_path');
            }
        });
    }
};
