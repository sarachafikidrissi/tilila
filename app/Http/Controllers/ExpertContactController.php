<?php

namespace App\Http\Controllers;

use App\Models\Expert;
use App\Models\ExpertContactRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ExpertContactController extends Controller
{
    /**
     * @return list<string>
     */
    public static function purposes(): array
    {
        return ['interview', 'speaker_panel', 'collaboration', 'media', 'other'];
    }

    public function store(Request $request, Expert $expert): RedirectResponse
    {
        abort_unless($expert->isPublished(), 404);

        $user = $request->user();
        abort_unless($user !== null, 401);

        if ((int) $expert->user_id === (int) $user->id) {
            return back()->withErrors([
                'contact' => 'You cannot send a contact request to your own profile.',
            ]);
        }

        $data = $request->validate([
            'purpose' => ['required', Rule::in(self::purposes())],
            'message' => 'required|string|max:5000',
            'locale' => 'nullable|string|max:8',
        ]);

        ExpertContactRequest::query()->create([
            'expert_id' => $expert->id,
            'user_id' => $user->id,
            'purpose' => $data['purpose'],
            'requester_name' => $user->name,
            'requester_email' => $user->email,
            'requester_phone' => null,
            'requester_organization' => null,
            'message' => $data['message'],
            'status' => ExpertContactRequest::STATUS_PENDING,
            'locale' => $data['locale'] ?? null,
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 1000),
        ]);

        return back()->with('success', 'Your contact request was sent to the expert.');
    }
}
