<?php

namespace App\Http\Controllers;

use App\Models\ExpertArticle;
use Inertia\Inertia;
use Inertia\Response;

class ExpertArticleController extends Controller
{
    public function show(ExpertArticle $article): Response
    {
        abort_unless($article->isPubliclyVisible(), 404);

        $article->load('expert');

        abort_unless($article->expert?->isPublished(), 404);

        return Inertia::render('experts/articles/show', [
            'article' => $article->toFeedArray(),
        ]);
    }
}
