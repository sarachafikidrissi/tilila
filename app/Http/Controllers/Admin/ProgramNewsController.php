<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProgramNews;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramNewsController extends Controller
{
    public function index(Request $request): Response
    {
        $program = $request->query('program');

        $query = ProgramNews::query()->orderByDesc('published_at')->orderByDesc('id');
        if ($program) {
            $query->where('program', $program);
        }

        return Inertia::render('admin/program/news/index', [
            'news' => $query->paginate(20)->withQueryString(),
            'filters' => ['program' => $program],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/program/news/form', [
            'article' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $request->file('cover_image')->storePublicly('program/news', 'public');
        }
        ProgramNews::query()->create($data);

        return redirect()->route('admin.program.news.index')
            ->with('success', 'News article created.');
    }

    public function edit(ProgramNews $news): Response
    {
        return Inertia::render('admin/program/news/form', [
            'article' => $news,
        ]);
    }

    public function update(Request $request, ProgramNews $news): RedirectResponse
    {
        $data = $this->validated($request);
        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $request->file('cover_image')->storePublicly('program/news', 'public');
        }
        $news->update($data);

        return redirect()->route('admin.program.news.index')
            ->with('success', 'News article updated.');
    }

    public function destroy(ProgramNews $news): RedirectResponse
    {
        $news->delete();

        return redirect()->route('admin.program.news.index')
            ->with('success', 'News article deleted.');
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        return $request->validate([
            'program' => ['nullable', 'string', 'in:tilila,tililab'],
            'title' => ['required', 'array'],
            'title.en' => ['nullable', 'string'],
            'title.fr' => ['required', 'string'],
            'title.ar' => ['nullable', 'string'],
            'slug' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'array'],
            'body' => ['nullable', 'array'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['boolean'],
            'cover_image' => ['nullable', 'image', 'max:5120'],
        ]);
    }
}
