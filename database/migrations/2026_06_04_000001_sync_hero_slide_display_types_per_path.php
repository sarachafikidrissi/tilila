<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (! DB::getSchemaBuilder()->hasTable('hero_slides')) {
            return;
        }

        if (! DB::getSchemaBuilder()->hasColumn('hero_slides', 'display_type')) {
            return;
        }

        $pathPrefixes = DB::table('hero_slides')
            ->whereNotNull('path_prefix')
            ->where('path_prefix', '!=', '/')
            ->distinct()
            ->pluck('path_prefix');

        foreach ($pathPrefixes as $pathPrefix) {
            $primary = DB::table('hero_slides')
                ->where('path_prefix', $pathPrefix)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->first();

            if ($primary === null) {
                continue;
            }

            DB::table('hero_slides')
                ->where('path_prefix', $pathPrefix)
                ->update(['display_type' => $primary->display_type ?? 'banner']);
        }
    }

    public function down(): void
    {
        // Data repair is not reversible.
    }
};
