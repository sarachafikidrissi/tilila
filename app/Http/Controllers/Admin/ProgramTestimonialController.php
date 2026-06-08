<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProgramTestimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramTestimonialController extends Controller
{
    public function index(Request $request): Response
    {
        $program = $request->query('program');

        $query = ProgramTestimonial::query()->orderBy('sort')->orderByDesc('id');
        if ($program) {
            $query->where('program', $program);
        }

        return Inertia::render('admin/program/testimonials/index', [
            'testimonials' => $query->paginate(20)->withQueryString(),
            'filters' => ['program' => $program],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/program/testimonials/form', [
            'testimonial' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->storePublicly('program/testimonials', 'public');
        }
        ProgramTestimonial::query()->create($data);

        return redirect()->route('admin.program.testimonials.index')
            ->with('success', 'Testimonial created.');
    }

    public function edit(ProgramTestimonial $testimonial): Response
    {
        return Inertia::render('admin/program/testimonials/form', [
            'testimonial' => $testimonial,
        ]);
    }

    public function update(Request $request, ProgramTestimonial $testimonial): RedirectResponse
    {
        $data = $this->validated($request);
        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->storePublicly('program/testimonials', 'public');
        }
        $testimonial->update($data);

        return redirect()->route('admin.program.testimonials.index')
            ->with('success', 'Testimonial updated.');
    }

    public function destroy(ProgramTestimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return redirect()->route('admin.program.testimonials.index')
            ->with('success', 'Testimonial deleted.');
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        return $request->validate([
            'program' => ['required', 'string', 'in:tilila,tililab'],
            'quote' => ['required', 'array'],
            'quote.en' => ['nullable', 'string'],
            'quote.fr' => ['required', 'string'],
            'quote.ar' => ['nullable', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'array'],
            'edition_year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'video_url' => ['nullable', 'url', 'max:2048'],
            'sort' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ]);
    }
}
