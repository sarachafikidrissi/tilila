<?php

namespace App\Support;

use App\Models\ProgramNews;
use App\Models\ProgramTestimonial;

class ProgramPageProps
{
    /** @return array<string, mixed> */
    public static function forProgram(string $program): array
    {
        return [
            'testimonials' => ProgramTestimonial::query()
                ->publishedForProgram($program)
                ->limit(6)
                ->get(),
            'news' => ProgramNews::query()
                ->published($program)
                ->limit(3)
                ->get(),
        ];
    }
}
