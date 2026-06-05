<?php

namespace App\Http\Controllers;

use App\Concerns\PasswordValidationRules;
use App\Enums\AccessRequestStatus;
use App\Models\AccessRequest;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AccessRequestActivationController extends Controller
{
    use PasswordValidationRules;

    public function show(string $token): Response|RedirectResponse
    {
        $accessRequest = $this->resolveActivatableRequest($token);

        if ($accessRequest instanceof RedirectResponse) {
            return $accessRequest;
        }

        return Inertia::render('access-request/activate', [
            'token' => $token,
            'email' => $accessRequest->user->email,
            'name' => $accessRequest->user->name,
        ]);
    }

    public function store(Request $request, string $token): RedirectResponse
    {
        $accessRequest = $this->resolveActivatableRequest($token);

        if ($accessRequest instanceof RedirectResponse) {
            return $accessRequest;
        }

        $validated = $request->validate([
            'password' => $this->passwordRules(),
        ]);

        $user = $accessRequest->user;

        $user->forceFill([
            'password' => $validated['password'],
            'password_set_at' => now(),
            'email_verified_at' => $user->email_verified_at ?? now(),
        ])->save();

        if ($user->wasChanged('email_verified_at')) {
            event(new Verified($user));
        }

        Auth::login($user);

        return redirect()
            ->route('experts.index')
            ->with('success', 'Your account is active. You can now view expert profiles.');
    }

    private function resolveActivatableRequest(string $token): AccessRequest|RedirectResponse
    {
        $accessRequest = AccessRequest::query()
            ->with('user')
            ->where('token', $token)
            ->first();

        if (! $accessRequest) {
            return redirect()
                ->route('login')
                ->withErrors(['email' => 'This activation link is invalid.']);
        }

        if ($accessRequest->status !== AccessRequestStatus::Approved) {
            return redirect()
                ->route('login')
                ->withErrors(['email' => 'This activation link is no longer valid.']);
        }

        if ($accessRequest->expires_at && $accessRequest->expires_at->isPast()) {
            return redirect()
                ->route('login')
                ->withErrors(['email' => 'This activation link has expired. Please contact support.']);
        }

        if ($accessRequest->user->password_set_at !== null) {
            return redirect()
                ->route('login')
                ->with('status', 'Your account is already active. You can log in.');
        }

        return $accessRequest;
    }
}
