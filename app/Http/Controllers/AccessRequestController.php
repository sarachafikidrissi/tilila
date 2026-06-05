<?php

namespace App\Http\Controllers;

use App\Enums\AccessRequestStatus;
use App\Mail\NewAccessRequestSubmitted;
use App\Models\AccessRequest;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AccessRequestController extends Controller
{
    public function submitted(): Response
    {
        return Inertia::render('access-request/submitted');
    }

    public function apply(Request $request): RedirectResponse
    {
        $request->session()->flash('authMode', 'request');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'reason' => ['required', 'string', 'max:5000'],
            'organization' => ['nullable', 'string', 'max:255'],
            'profession' => ['required', 'string', 'max:255'],
        ]);

        $email = Str::lower($validated['email']);

        $existingUser = User::query()->where('email', $email)->first();

        if ($existingUser) {
            if ($existingUser->hasPasswordSet()) {
                return back()
                    ->withInput($request->except('password'))
                    ->with('authMode', 'request')
                    ->withErrors([
                        'email' => 'An account with this email already exists. Log in to request access, or use another email.',
                    ]);
            }

            $accessRequest = $existingUser->accessRequest;

            if ($accessRequest?->isPending()) {
                return redirect()
                    ->route('access-request.submitted')
                    ->with('warning', 'A request for this email is already under review.');
            }

            if ($accessRequest?->isApproved() && ! $existingUser->hasPasswordSet()) {
                return back()
                    ->withInput($request->except('password'))
                    ->with('authMode', 'request')
                    ->withErrors([
                        'email' => 'Your request was approved. Check your email for the activation link to set your password.',
                    ]);
            }

            if ($accessRequest?->isRejected()) {
                return back()
                    ->withInput($request->except('password'))
                    ->with('authMode', 'request')
                    ->withErrors([
                        'email' => 'This email was not approved. Contact support if you need help.',
                    ]);
            }
        }

        try {
            $accessRequest = DB::transaction(function () use ($validated, $email, $existingUser) {
                $user = $existingUser ?? User::query()->create([
                    'name' => $validated['name'],
                    'email' => $email,
                    'password' => Hash::make(Str::random(64)),
                    'password_set_at' => null,
                    'role' => 'user',
                ]);

                if ($existingUser) {
                    $user->update(['name' => $validated['name']]);
                }

                $record = AccessRequest::query()->create([
                    'user_id' => $user->id,
                    'status' => AccessRequestStatus::Pending,
                    'reason' => $validated['reason'],
                    'organization' => $validated['organization'],
                    'profession' => $validated['profession'],
                ]);

                return $record;
            });
        } catch (QueryException $e) {
            if ($this->isUniqueConstraintViolation($e)) {
                return redirect()
                    ->route('access-request.submitted')
                    ->with('warning', 'A request for this email is already under review.');
            }

            throw $e;
        }

        return $this->redirectAfterSuccessfulStore($accessRequest);
    }

    public function create(Request $request): Response|RedirectResponse
    {
        $accessRequest = $request->user()->accessRequest;

        if ($accessRequest?->isRejected()) {
            return Inertia::render('access-request/create', [
                'prefill' => [
                    'reason' => $accessRequest->reason,
                    'organization' => $accessRequest->organization ?? '',
                    'profession' => $accessRequest->profession,
                ],
                'isReapplication' => true,
            ]);
        }

        if ($accessRequest) {
            return $this->redirectForExistingRequest($accessRequest);
        }

        return Inertia::render('access-request/create', [
            'prefill' => null,
            'isReapplication' => false,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:5000'],
            'organization' => ['nullable', 'string', 'max:255'],
            'profession' => ['required', 'string', 'max:255'],
        ]);

        $userId = (int) $request->user()->id;

        try {
            $result = DB::transaction(function () use ($userId, $validated) {
                $existing = AccessRequest::query()
                    ->where('user_id', $userId)
                    ->lockForUpdate()
                    ->first();

                if ($existing) {
                    if ($existing->isRejected()) {
                        $existing->update([
                            'status' => AccessRequestStatus::Pending,
                            'reason' => $validated['reason'],
                            'organization' => $validated['organization'],
                            'profession' => $validated['profession'],
                            'reviewed_at' => null,
                            'reviewed_by' => null,
                            'resubmitted_at' => now(),
                        ]);

                        return [
                            'action' => 'resubmitted',
                            'record' => $existing->fresh(),
                        ];
                    }

                    return [
                        'action' => 'blocked',
                        'record' => $existing,
                    ];
                }

                $record = AccessRequest::query()->create([
                    'user_id' => $userId,
                    'status' => AccessRequestStatus::Pending,
                    ...$validated,
                ]);

                return [
                    'action' => 'created',
                    'record' => $record,
                ];
            });
        } catch (QueryException $e) {
            if ($this->isUniqueConstraintViolation($e)) {
                $existing = AccessRequest::query()->where('user_id', $userId)->first();

                if ($existing) {
                    return $this->redirectForBlockedStore($existing);
                }

                return redirect()
                    ->route('access-request.create')
                    ->with('warning', 'You have already submitted an access request.');
            }

            throw $e;
        }

        if ($result['action'] === 'blocked') {
            return $this->redirectForBlockedStore($result['record']);
        }

        return $this->redirectAfterSuccessfulStore($result['record']);
    }

    public function pending(Request $request): Response|RedirectResponse
    {
        $accessRequest = $request->user()->accessRequest;

        if (! $accessRequest) {
            return redirect()->route('access-request.create');
        }

        if (! $accessRequest->isPending()) {
            return $this->redirectForExistingRequest($accessRequest);
        }

        return Inertia::render('access-request/pending');
    }

    public function rejected(Request $request): Response|RedirectResponse
    {
        $accessRequest = $request->user()->accessRequest;

        if (! $accessRequest) {
            return redirect()->route('access-request.create');
        }

        if (! $accessRequest->isRejected()) {
            return $this->redirectForExistingRequest($accessRequest);
        }

        return Inertia::render('access-request/rejected');
    }

    private function redirectAfterSuccessfulStore(AccessRequest $accessRequest): RedirectResponse
    {
        $accessRequest->load('user');

        User::query()
            ->where('role', 'admin')
            ->pluck('email')
            ->each(fn (string $email) => Mail::to($email)->send(new NewAccessRequestSubmitted($accessRequest)));

        if ($accessRequest->user->hasPasswordSet()) {
            return redirect()
                ->route('access-request.pending')
                ->with('success', 'Your access request has been submitted.');
        }

        return redirect()
            ->route('access-request.submitted')
            ->with('success', 'Your account request has been submitted. You will receive an email once an administrator approves it.');
    }

    private function redirectForBlockedStore(AccessRequest $accessRequest): RedirectResponse
    {
        if ($accessRequest->isPending()) {
            return redirect()
                ->route('access-request.pending')
                ->with('warning', 'Your access request is already under review.');
        }

        if ($accessRequest->isApproved()) {
            return redirect()
                ->route('experts.index')
                ->with('warning', 'You already have access to expert profiles.');
        }

        if ($accessRequest->isRejected()) {
            return redirect()
                ->route('access-request.rejected')
                ->with('warning', 'Please use the re-apply form to submit a new request.');
        }

        return redirect()
            ->route('access-request.create')
            ->with('warning', 'You have already submitted an access request.');
    }

    private function redirectForExistingRequest(AccessRequest $accessRequest): RedirectResponse
    {
        if ($accessRequest->isApproved()) {
            return redirect()->route('experts.index');
        }

        if ($accessRequest->isPending()) {
            return redirect()->route('access-request.pending');
        }

        if ($accessRequest->isRejected()) {
            return redirect()->route('access-request.rejected');
        }

        return redirect()->route('access-request.create');
    }

    private function isUniqueConstraintViolation(QueryException $e): bool
    {
        $code = (string) $e->getCode();

        if (in_array($code, ['23000', '23505'], true)) {
            return true;
        }

        $sqlState = (string) ($e->errorInfo[0] ?? '');

        if (in_array($sqlState, ['23000', '23505'], true)) {
            return true;
        }

        return str_contains(strtolower($e->getMessage()), 'unique');
    }
}
