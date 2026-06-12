<?php

use App\Models\HeroSlide;
use App\Models\User;

test('admin store canonicalizes path_prefix before persisting', function () {
    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);

    $response = $this->actingAs($admin)->post(route('admin.hero-slides.store'), [
        'slide_key' => 'test-about-prefix',
        'path_prefix' => '  about  ',
        'display_type' => 'banner',
        'media_type' => 'image',
        'display_mode' => 'banner_image',
        'is_active' => true,
        'sort_order' => 0,
        'image_contain' => false,
        'banner_image_contain' => false,
    ]);

    $response->assertRedirect(route('admin.hero-slides.index'));

    $slide = HeroSlide::query()->where('slide_key', 'test-about-prefix')->first();

    expect($slide)->not->toBeNull()
        ->and($slide->path_prefix)->toBe('/about');
});
