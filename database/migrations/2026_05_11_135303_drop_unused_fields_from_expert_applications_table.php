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
        if (! Schema::hasTable('expert_applications')) {
            return;
        }

        $columns = [
            'full_name',
            'city',
            'current_title',
            'expertise',
            'bio',
            'linkedin_url',
            'portfolio_url',
            'industries',
            'quote_i18n',
        ];

        $drop = array_values(array_filter($columns, static fn (string $column): bool =>
            Schema::hasColumn('expert_applications', $column)
        ));

        if ($drop === []) {
            return;
        }

        Schema::table('expert_applications', function (Blueprint $table) use ($drop) {
            $table->dropColumn($drop);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('expert_applications')) {
            return;
        }

        Schema::table('expert_applications', function (Blueprint $table): void {
            if (! Schema::hasColumn('expert_applications', 'full_name')) {
                $table->string('full_name')->nullable();
            }
            if (! Schema::hasColumn('expert_applications', 'city')) {
                $table->string('city', 120)->nullable();
            }
            if (! Schema::hasColumn('expert_applications', 'current_title')) {
                $table->string('current_title')->nullable();
            }
            if (! Schema::hasColumn('expert_applications', 'expertise')) {
                $table->text('expertise')->nullable();
            }
            if (! Schema::hasColumn('expert_applications', 'bio')) {
                $table->text('bio')->nullable();
            }
            if (! Schema::hasColumn('expert_applications', 'linkedin_url')) {
                $table->string('linkedin_url')->nullable();
            }
            if (! Schema::hasColumn('expert_applications', 'portfolio_url')) {
                $table->string('portfolio_url')->nullable();
            }
            if (! Schema::hasColumn('expert_applications', 'industries')) {
                $table->json('industries')->nullable();
            }
            if (! Schema::hasColumn('expert_applications', 'quote_i18n')) {
                $table->json('quote_i18n')->nullable();
            }
        });
    }
};
