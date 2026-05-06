<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tililab_participants', function (Blueprint $table) {
            if (Schema::hasColumn('tililab_participants', 'organization')) {
                $table->dropColumn('organization');
            }
            if (Schema::hasColumn('tililab_participants', 'job_title')) {
                $table->dropColumn('job_title');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tililab_participants', function (Blueprint $table) {
            if (! Schema::hasColumn('tililab_participants', 'job_title')) {
                $table->string('job_title', 255)->nullable()->after('phone');
            }
            if (! Schema::hasColumn('tililab_participants', 'organization')) {
                $table->string('organization', 255)->nullable()->after('job_title');
            }
        });
    }
};

