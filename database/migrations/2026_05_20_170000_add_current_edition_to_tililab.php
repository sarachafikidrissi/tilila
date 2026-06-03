<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('tililab_editions', 'is_current')) {
            Schema::table('tililab_editions', function (Blueprint $table) {
                $table->boolean('is_current')->default(false)->after('sort');
            });
        }

        if (! Schema::hasColumn('tililab_participants', 'tililab_edition_id')) {
            Schema::table('tililab_participants', function (Blueprint $table) {
                $table->foreignId('tililab_edition_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('tililab_editions')
                    ->nullOnDelete();
            });
        }

        $currentEditionId = DB::table('tililab_editions')
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->value('id');

        if ($currentEditionId !== null) {
            DB::table('tililab_editions')->update(['is_current' => false]);
            DB::table('tililab_editions')
                ->where('id', $currentEditionId)
                ->update(['is_current' => true]);

            DB::table('tililab_participants')
                ->whereNull('tililab_edition_id')
                ->update(['tililab_edition_id' => $currentEditionId]);
        }
    }

    public function down(): void
    {
        Schema::table('tililab_participants', function (Blueprint $table) {
            $table->dropConstrainedForeignId('tililab_edition_id');
        });

        Schema::table('tililab_editions', function (Blueprint $table) {
            $table->dropColumn('is_current');
        });
    }
};
