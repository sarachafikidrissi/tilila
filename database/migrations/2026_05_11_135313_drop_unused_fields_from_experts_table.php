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
        if (! Schema::hasTable('experts')) {
            return;
        }

        $columns = ['location', 'industries', 'badge'];
        $drop = array_values(array_filter($columns, static fn (string $column): bool =>
            Schema::hasColumn('experts', $column)
        ));

        if ($drop === []) {
            return;
        }

        Schema::table('experts', function (Blueprint $table) use ($drop): void {
            $table->dropColumn($drop);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('experts')) {
            return;
        }

        Schema::table('experts', function (Blueprint $table): void {
            if (! Schema::hasColumn('experts', 'location')) {
                $table->text('location')->nullable();
            }
            if (! Schema::hasColumn('experts', 'industries')) {
                $table->json('industries')->nullable();
            }
            if (! Schema::hasColumn('experts', 'badge')) {
                $table->string('badge')->nullable();
            }
        });
    }
};
