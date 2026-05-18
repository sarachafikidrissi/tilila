<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expert_of_months', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('expert_id')->constrained('experts')->cascadeOnDelete();
            $table->unsignedTinyInteger('month');
            $table->unsignedSmallInteger('year');
            $table->string('video_url', 2048);
            $table->timestamps();

            $table->unique(['year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expert_of_months');
    }
};
