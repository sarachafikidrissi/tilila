<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use App\Models\ExpertArticle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $expert = $this->resolveExpert($request);

        $articles = ExpertArticle::query()
            ->where('expert_id', $expert->id)
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (ExpertArticle $article) => $this->articleToList($article));

        return Inertia::render('expert/articles/index', [
            'articles' => $articles,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->resolveExpert($request);

        return Inertia::render('expert/articles/form', [
            'article' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $expert = $this->resolveExpert($request);
        $data = $this->validated($request);

        ExpertArticle::query()->create([
            'expert_id' => $expert->id,
            'slug' => ExpertArticle::uniqueSlugFromTitle($data['title']['fr']),
            ...$data,
        ]);

        return redirect()
            ->route('expert.articles.index')
            ->with('success', 'Article saved.');
    }

    public function edit(Request $request, ExpertArticle $article): Response
    {
        $this->authorizeArticle($request, $article);

        return Inertia::render('expert/articles/form', [
            'article' => $this->articleToForm($article),
        ]);
    }

    public function update(Request $request, ExpertArticle $article): RedirectResponse
    {
        $this->authorizeArticle($request, $article);
        $data = $this->validated($request);

        $slug = $article->slug;
        $newSlugBase = Str::slug($data['title']['fr']);
        if ($newSlugBase !== '' && ! Str::startsWith($article->slug, $newSlugBase)) {
            $slug = ExpertArticle::uniqueSlugFromTitle($data['title']['fr'], $article->id);
        }

        $article->update([
            ...$data,
            'slug' => $slug,
        ]);

        return redirect()
            ->route('expert.articles.index')
            ->with('success', 'Article updated.');
    }

    public function destroy(Request $request, ExpertArticle $article): RedirectResponse
    {
        $this->authorizeArticle($request, $article);
        $article->delete();

        return redirect()
            ->route('expert.articles.index')
            ->with('success', 'Article deleted.');
    }

    private function resolveExpert(Request $request): Expert
    {
        return Expert::query()->where('user_id', $request->user()->id)->firstOrFail();
    }

    private function authorizeArticle(Request $request, ExpertArticle $article): void
    {
        $expert = $this->resolveExpert($request);
        abort_unless($article->expert_id === $expert->id, 403);
    }

    /**
     * @return array<string, mixed>
     */
    private function articleToList(ExpertArticle $article): array
    {
        return [
            'id' => $article->id,
            'slug' => $article->slug,
            'title' => $article->title ?? ['en' => '', 'fr' => '', 'ar' => ''],
            'status' => $article->status,
            'created_at' => $article->displayDate()->format('Y-m-d H:i'),
            'updated_at' => $article->updated_at?->toISOString(),
            'edit_url' => route('expert.articles.edit', $article),
            'public_url' => $article->isPubliclyVisible()
                ? route('experts.articles.show', $article)
                : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function articleToForm(ExpertArticle $article): array
    {
        return [
            'id' => $article->id,
            'slug' => $article->slug,
            'title' => $this->triLangValue($article->title),
            'content' => $this->triLangValue($article->content),
            'status' => $article->status,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $validated = $request->validate([
            'title' => ['required', 'array'],
            'title.fr' => ['required', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],
            'title.ar' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'array'],
            'content.fr' => ['required', 'string', 'max:50000'],
            'content.en' => ['nullable', 'string', 'max:50000'],
            'content.ar' => ['nullable', 'string', 'max:50000'],
            'status' => ['required', 'in:draft,published'],
        ]);

        $title = $this->triLangValue($validated['title'] ?? []);
        $content = $this->triLangValue($validated['content'] ?? []);

        if (trim(strip_tags($content['fr'])) === '') {
            throw ValidationException::withMessages([
                'content.fr' => ['French content is required.'],
            ]);
        }

        return [
            'title' => $title,
            'content' => $content,
            'status' => $validated['status'],
        ];
    }

    /**
     * @return array{en: string, fr: string, ar: string}
     */
    private function triLangValue(mixed $value): array
    {
        if (! is_array($value)) {
            return ['en' => '', 'fr' => '', 'ar' => ''];
        }

        return [
            'en' => trim((string) ($value['en'] ?? '')),
            'fr' => trim((string) ($value['fr'] ?? '')),
            'ar' => trim((string) ($value['ar'] ?? '')),
        ];
    }
}
