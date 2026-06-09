<?php

namespace App\Http\Controllers;

use App\Models\ProgramNews;
use Inertia\Inertia;
use Inertia\Response;

class ProgramNewsController extends Controller
{
    public function index(?string $program = null): Response
    {
        $news = ProgramNews::query()
            ->published($program)
            ->paginate(12);

        return Inertia::render('user/program/news-index', [
            'program' => $program,
            'news' => $news,
        ]);
    }

    public function show(ProgramNews $news): Response
    {
        abort_unless($news->is_published && $news->published_at?->isPast(), 404);

        return Inertia::render('user/program/news-show', [
            'article' => $news,
            'program' => $news->program,
        ]);
    }
}
