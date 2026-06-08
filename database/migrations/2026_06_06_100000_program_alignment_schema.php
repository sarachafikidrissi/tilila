<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tilila_editions', function (Blueprint $table) {
            if (! Schema::hasColumn('tilila_editions', 'applications_close_at')) {
                $table->timestamp('applications_close_at')->nullable()->after('is_current');
            }
        });

        Schema::table('tililab_editions', function (Blueprint $table) {
            if (! Schema::hasColumn('tililab_editions', 'applications_close_at')) {
                $table->timestamp('applications_close_at')->nullable()->after('is_current');
            }
        });

        Schema::table('tilila_contest_participants', function (Blueprint $table) {
            $table->string('company', 255)->nullable()->after('country');
            $table->string('brand', 255)->nullable()->after('company');
            $table->string('agency', 255)->nullable()->after('brand');
            $table->string('representative_role', 255)->nullable()->after('last_name');
            $table->string('campaign_title', 255)->nullable()->after('agency');
            $table->date('first_broadcast_date')->nullable()->after('campaign_title');
            $table->string('category', 64)->nullable()->after('first_broadcast_date');
            $table->text('creative_concept')->nullable()->after('submission_description');
            $table->text('edi_contribution')->nullable()->after('creative_concept');
            $table->string('audio_path', 2048)->nullable()->after('submission_video_path');
            $table->string('visual_path', 2048)->nullable()->after('audio_path');
            $table->json('extra_document_paths')->nullable()->after('visual_path');
            $table->boolean('declared_accuracy')->default(false)->after('accepted_rules');
            $table->boolean('declared_rights')->default(false)->after('declared_accuracy');
        });

        Schema::table('tililab_participants', function (Blueprint $table) {
            $table->date('birth_date')->nullable()->after('country');
            $table->string('cin', 32)->nullable()->after('birth_date');
            $table->string('education_level', 255)->nullable()->after('cin');
            $table->string('profession', 255)->nullable()->after('education_level');
            $table->string('social_links', 2048)->nullable()->after('profession');
            $table->string('project_title', 255)->nullable()->after('social_links');
            $table->string('prior_work_link', 2048)->nullable()->after('project_title');
            $table->string('portfolio_path', 2048)->nullable()->after('prior_work_link');
            $table->string('pdf_dossier_path', 2048)->nullable()->after('portfolio_path');
            $table->text('candidate_presentation')->nullable()->after('bio');
            $table->text('project_presentation')->nullable()->after('candidate_presentation');
            $table->text('main_message')->nullable()->after('project_presentation');
            $table->text('motivation')->nullable()->after('main_message');
            $table->boolean('declared_under_30')->default(false)->after('motivation');
            $table->boolean('declared_accuracy')->default(false)->after('declared_under_30');
            $table->boolean('declared_rights')->default(false)->after('declared_accuracy');
            $table->boolean('accepted_rules')->default(false)->after('declared_rights');
        });

        Schema::create('program_testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('program', 32);
            $table->json('quote');
            $table->string('name', 255);
            $table->json('role')->nullable();
            $table->unsignedSmallInteger('edition_year')->nullable();
            $table->string('photo_path', 2048)->nullable();
            $table->string('video_url', 2048)->nullable();
            $table->unsignedSmallInteger('sort')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['program', 'is_published', 'sort']);
        });

        Schema::create('program_news', function (Blueprint $table) {
            $table->id();
            $table->string('program', 32)->nullable();
            $table->json('title');
            $table->string('slug')->unique();
            $table->json('excerpt')->nullable();
            $table->json('body')->nullable();
            $table->string('cover_image_path', 2048)->nullable();
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->index(['program', 'is_published', 'published_at']);
        });

        Schema::create('program_contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('program', 32)->nullable();
            $table->string('name', 255);
            $table->string('email', 255);
            $table->string('subject', 255)->nullable();
            $table->text('message');
            $table->string('locale', 8)->nullable();
            $table->ipAddress('ip')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_contact_messages');
        Schema::dropIfExists('program_news');
        Schema::dropIfExists('program_testimonials');

        Schema::table('tililab_participants', function (Blueprint $table) {
            $table->dropColumn([
                'birth_date', 'cin', 'education_level', 'profession', 'social_links',
                'project_title', 'prior_work_link', 'portfolio_path', 'pdf_dossier_path',
                'candidate_presentation', 'project_presentation', 'main_message', 'motivation',
                'declared_under_30', 'declared_accuracy', 'declared_rights', 'accepted_rules',
            ]);
        });

        Schema::table('tilila_contest_participants', function (Blueprint $table) {
            $table->dropColumn([
                'company', 'brand', 'agency', 'representative_role', 'campaign_title',
                'first_broadcast_date', 'category', 'creative_concept', 'edi_contribution',
                'audio_path', 'visual_path', 'extra_document_paths',
                'declared_accuracy', 'declared_rights',
            ]);
        });

        Schema::table('tililab_editions', function (Blueprint $table) {
            $table->dropColumn('applications_close_at');
        });

        Schema::table('tilila_editions', function (Blueprint $table) {
            $table->dropColumn('applications_close_at');
        });
    }
};
