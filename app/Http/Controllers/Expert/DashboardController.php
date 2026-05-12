<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('expert/dashboard', [
            'expert' => $this->resolveExpert($request),
        ]);
    }

    public function network(Request $request): Response
    {
        $currentExpert = Expert::query()->where('user_id', $request->user()->id)->firstOrFail();

        $experts = Expert::query()
            ->where('status', 'published')
            ->orderBy('id')
            ->get()
            ->map(fn (Expert $expert) => $expert->toDirectoryArray())
            ->values();

        return Inertia::render('expert/network', [
            'expert' => $this->resolveExpert($request),
            'currentExpertId' => $currentExpert->id,
            'experts' => $experts,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function resolveExpert(Request $request): array
    {
        $expert = Expert::query()->where('user_id', $request->user()->id)->firstOrFail();

        return [
            'id' => $expert->id,
            'name' => $expert->name,
            'title' => $expert->title,
            'email' => $expert->email,
            'status' => $expert->status,
            'country' => $expert->country,
            'city_i18n' => $expert->city_i18n,
            'updated_at' => optional($expert->updated_at)?->toISOString(),
        ];
    }
}
