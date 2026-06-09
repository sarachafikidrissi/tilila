<?php

use App\Models\TililabEdition;
use App\Models\TililaContestParticipant;
use App\Models\TililaEdition;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('tilila regulation page is accessible', function () {
    $this->get(route('program.reglement.tilila'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('user/program/reglement')->where('program', 'tilila'));
});

test('tililab regulation page is accessible', function () {
    $this->get(route('program.reglement.tililab'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('user/program/reglement')->where('program', 'tililab'));
});

test('tilila regulation document can be downloaded', function () {
    expect(file_exists(public_path('documents/reglement-tilila-awards-2026.docx')))->toBeTrue();

    $this->get(route('program.reglement.tilila.download'))
        ->assertOk();
});

test('tilila participation rejects hommage category', function () {
    Storage::fake('public');

    TililaEdition::query()->create([
        'year' => 2026,
        'edition_label' => ['en' => '2026', 'fr' => '2026', 'ar' => '2026'],
        'is_current' => true,
        'applications_close_at' => now()->addMonth(),
    ]);

    $response = $this->post(route('tilila.participate.store'), [
        'first_name' => 'Test',
        'last_name' => 'User',
        'representative_role' => 'Manager',
        'email' => 'test@example.com',
        'phone' => '0600000000',
        'company' => 'Co',
        'brand' => 'Brand',
        'agency' => 'Agency',
        'campaign_title' => 'Campaign',
        'first_broadcast_date' => '2026-01-01',
        'category' => 'hommage',
        'creative_concept' => 'Concept',
        'edi_contribution' => 'EDI',
        'declared_accuracy' => true,
        'declared_rights' => true,
        'accepted_rules' => true,
    ]);

    $response->assertSessionHasErrors('category');
});

test('tililab participation rejects applicants aged 30 or older', function () {
    Storage::fake('public');

    TililabEdition::query()->create([
        'year' => 2026,
        'edition_label' => ['en' => '2026', 'fr' => '2026', 'ar' => '2026'],
        'is_current' => true,
        'applications_close_at' => now()->addMonth(),
    ]);

    $response = $this->post(route('tililab.form.store'), [
        'first_name' => 'Old',
        'last_name' => 'Applicant',
        'email' => 'old@example.com',
        'phone' => '0600000000',
        'city' => 'Casablanca',
        'birth_date' => now()->subYears(31)->toDateString(),
        'cin' => 'AB123456',
        'education_level' => 'Bac+3',
        'profession' => 'Creator',
        'project_title' => 'Project',
        'candidate_presentation' => 'About me',
        'project_presentation' => 'About project',
        'main_message' => 'Message',
        'motivation' => 'Motivation',
        'original_video' => UploadedFile::fake()->create('clip.mp4', 100, 'video/mp4'),
        'declared_under_30' => true,
        'declared_accuracy' => true,
        'declared_rights' => true,
        'accepted_rules' => true,
    ]);

    $response->assertSessionHasErrors('birth_date');
});

test('tilila participation stores uploads on private disk', function () {
    Storage::fake('local');

    TililaEdition::query()->create([
        'year' => 2026,
        'edition_label' => ['en' => '2026', 'fr' => '2026', 'ar' => '2026'],
        'is_current' => true,
        'applications_close_at' => now()->addMonth(),
    ]);

    $this->post(route('tilila.participate.store'), [
        'first_name' => 'Test',
        'last_name' => 'User',
        'representative_role' => 'Manager',
        'email' => 'upload@example.com',
        'phone' => '0600000000',
        'company' => 'Co',
        'brand' => 'Brand',
        'agency' => 'Agency',
        'campaign_title' => 'Campaign',
        'first_broadcast_date' => '2026-01-01',
        'category' => 'prix_jury',
        'creative_concept' => 'Concept',
        'edi_contribution' => 'EDI',
        'submission_visual' => UploadedFile::fake()->image('visual.jpg'),
        'declared_accuracy' => true,
        'declared_rights' => true,
        'accepted_rules' => true,
    ])->assertSessionHasNoErrors();

    $participant = TililaContestParticipant::query()->first();
    expect($participant)->not->toBeNull();
    expect(Storage::disk('local')->exists($participant->visual_path))->toBeTrue();
    Storage::disk('public')->assertMissing($participant->visual_path);
});

test('tilila participant files require admin authentication', function () {
    Storage::fake('local');

    $edition = TililaEdition::query()->create([
        'year' => 2026,
        'edition_label' => ['en' => '2026', 'fr' => '2026', 'ar' => '2026'],
        'is_current' => true,
    ]);

    $participant = TililaContestParticipant::query()->create([
        'tilila_edition_id' => $edition->id,
        'first_name' => 'A',
        'last_name' => 'B',
        'representative_role' => 'Role',
        'email' => 'secure@example.com',
        'phone' => '0600000000',
        'company' => 'Co',
        'brand' => 'Brand',
        'agency' => 'Agency',
        'campaign_title' => 'Campaign',
        'first_broadcast_date' => '2026-01-01',
        'category' => 'prix_jury',
        'creative_concept' => 'Concept',
        'edi_contribution' => 'EDI',
        'visual_path' => 'tilila/submissions/visuals/test.jpg',
        'declared_accuracy' => true,
        'declared_rights' => true,
        'accepted_rules' => true,
    ]);

    Storage::disk('local')->put($participant->visual_path, 'image');

    $this->get(route('admin.tilila.participants.file', [
        'participant' => $participant->id,
        'type' => 'visual',
    ]))->assertRedirect();

    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin)
        ->get(route('admin.tilila.participants.file', [
            'participant' => $participant->id,
            'type' => 'visual',
        ]))
        ->assertOk();
});

test('closed tilila edition blocks participation', function () {
    TililaEdition::query()->create([
        'year' => 2026,
        'edition_label' => ['en' => '2026', 'fr' => '2026', 'ar' => '2026'],
        'is_current' => true,
        'applications_close_at' => now()->subDay(),
    ]);

    $response = $this->post(route('tilila.participate.store'), [
        'first_name' => 'Test',
        'last_name' => 'User',
        'representative_role' => 'Manager',
        'email' => 'closed@example.com',
        'phone' => '0600000000',
        'company' => 'Co',
        'brand' => 'Brand',
        'agency' => 'Agency',
        'campaign_title' => 'Campaign',
        'first_broadcast_date' => '2026-01-01',
        'category' => 'prix_jury',
        'creative_concept' => 'Concept',
        'edi_contribution' => 'EDI',
        'declared_accuracy' => true,
        'declared_rights' => true,
        'accepted_rules' => true,
    ]);

    $response->assertSessionHasErrors('company');
});
