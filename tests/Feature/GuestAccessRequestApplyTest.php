<?php

use App\Mail\NewAccessRequestSubmitted;
use App\Models\AccessRequest;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('guest can submit account request without password', function () {
    Mail::fake();

    User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);

    $response = $this->post(route('access-request.apply'), [
        'name' => 'Jane Applicant',
        'email' => 'jane.applicant@example.com',
        'reason' => 'I need access for research.',
        'organization' => 'Test Org',
        'profession' => 'Researcher',
    ]);

    $response->assertRedirect(route('access-request.submitted'));

    $user = User::query()->where('email', 'jane.applicant@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->password_set_at)->toBeNull()
        ->and($user->accessRequest)->not->toBeNull()
        ->and($user->accessRequest->status->value)->toBe('pending');

    Mail::assertSent(NewAccessRequestSubmitted::class);
});

test('pending account request user cannot log in', function () {
    $user = User::factory()->create([
        'email' => 'pending.user@example.com',
        'password' => 'password',
        'password_set_at' => null,
    ]);

    AccessRequest::factory()->pending()->create(['user_id' => $user->id]);

    $response = $this->post(route('login.store'), [
        'email' => 'pending.user@example.com',
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('approved user can activate account with token', function () {
    $user = User::factory()->create([
        'password_set_at' => null,
    ]);

    $accessRequest = AccessRequest::factory()->approved()->create([
        'user_id' => $user->id,
        'token' => 'test-activation-token',
        'expires_at' => now()->addDay(),
    ]);

    $response = $this->post(route('access-request.activate.store', $accessRequest->token), [
        'password' => 'NewPassword1!',
        'password_confirmation' => 'NewPassword1!',
    ]);

    $response->assertRedirect(route('experts.index'));

    $user->refresh();

    expect($user->password_set_at)->not->toBeNull();
    $this->assertAuthenticatedAs($user);
});
