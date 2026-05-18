<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('experts', function (Blueprint $table): void {
            $table->boolean('on_front')->default(false)->after('status');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('experts')) {
            return;
        }

        Schema::table('experts', function (Blueprint $table): void {
            if (Schema::hasColumn('experts', 'on_front')) {
                $table->dropColumn('on_front');
            }
        });
    }
};
