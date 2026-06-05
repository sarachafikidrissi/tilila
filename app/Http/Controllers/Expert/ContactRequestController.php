<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use App\Models\ExpertContactRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ContactRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $expert = Expert::query()->where('user_id', $request->user()->id)->firstOrFail();

        $requests = ExpertContactRequest::query()
            ->where('expert_id', $expert->id)
            ->with('user:id,name,email')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (ExpertContactRequest $r) => [
                'id' => $r->id,
                'purpose' => $r->purpose,
                'requester_name' => $r->requester_name,
                'requester_email' => $r->requester_email,
                'requester_phone' => $r->requester_phone,
                'requester_organization' => $r->requester_organization,
                'message' => $r->message,
                'status' => $r->status,
                'reviewed_at' => optional($r->reviewed_at)?->toISOString(),
                'created_at' => optional($r->created_at)?->toISOString(),
                'user' => $r->user ? [
                    'id' => $r->user->id,
                    'name' => $r->user->name,
                    'email' => $r->user->email,
                ] : null,
            ]);

        $pendingCount = $requests->where('status', ExpertContactRequest::STATUS_PENDING)->count();

        return Inertia::render('expert/contact-requests/index', [
            'requests' => $requests->values(),
            'pendingCount' => $pendingCount,
        ]);
    }

    public function update(Request $request, ExpertContactRequest $contactRequest): RedirectResponse
    {
        $expert = Expert::query()->where('user_id', $request->user()->id)->firstOrFail();
        abort_unless((int) $contactRequest->expert_id === (int) $expert->id, 403);
        abort_unless($contactRequest->isPending(), 422);

        $data = $request->validate([
            'status' => [
                'required',
                Rule::in([
                    ExpertContactRequest::STATUS_ACCEPTED,
                    ExpertContactRequest::STATUS_DECLINED,
                ]),
            ],
        ]);

        $contactRequest->update([
            'status' => $data['status'],
            'reviewed_at' => now(),
        ]);

        return back();
    }
}
