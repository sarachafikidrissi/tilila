<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        DB::table('users')
            ->whereIn('role', ['admin', 'expert'])
            ->whereNull('password_set_at')
            ->update(['password_set_at' => $now]);
    }

    public function down(): void
    {
        // Irreversible data fix; staff accounts should remain login-ready.
    }
};
