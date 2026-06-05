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

        if (! DB::getSchemaBuilder()->hasColumn('hero_slides', 'path_prefix')) {
            return;
        }

        $rows = DB::table('hero_slides')
            ->whereNotNull('path_prefix')
            ->get(['id', 'path_prefix']);

        foreach ($rows as $row) {
            $canonical = $this->canonicalizePathPrefix($row->path_prefix);

            if ($canonical === $row->path_prefix) {
                continue;
            }

            DB::table('hero_slides')
                ->where('id', $row->id)
                ->update(['path_prefix' => $canonical]);
        }
    }

    public function down(): void
    {
        // Data repair is not reversible.
    }

    private function canonicalizePathPrefix(?string $prefix): ?string
    {
        if ($prefix === null) {
            return null;
        }

        $prefix = trim($prefix);

        if ($prefix === '') {
            return null;
        }

        if (! str_starts_with($prefix, '/')) {
            $prefix = '/'.$prefix;
        }

        $prefix = rtrim($prefix, '/');

        return $prefix === '' ? '/' : $prefix;
    }
};
