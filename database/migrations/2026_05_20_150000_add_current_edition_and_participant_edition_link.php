<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tilila_editions', function (Blueprint $table) {
            $table->boolean('is_current')->default(false)->after('sort');
        });

        Schema::table('tilila_contest_participants', function (Blueprint $table) {
            $table->foreignId('tilila_edition_id')
                ->nullable()
                ->after('id')
                ->constrained('tilila_editions')
                ->nullOnDelete();
        });

        $currentEditionId = DB::table('tilila_editions')
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->value('id');

        if ($currentEditionId !== null) {
            DB::table('tilila_editions')->update(['is_current' => false]);
            DB::table('tilila_editions')
                ->where('id', $currentEditionId)
                ->update(['is_current' => true]);

            DB::table('tilila_contest_participants')
                ->whereNull('tilila_edition_id')
                ->update(['tilila_edition_id' => $currentEditionId]);
        }
    }

    public function down(): void
    {
        Schema::table('tilila_contest_participants', function (Blueprint $table) {
            $table->dropConstrainedForeignId('tilila_edition_id');
        });

        Schema::table('tilila_editions', function (Blueprint $table) {
            $table->dropColumn('is_current');
        });
    }
};
