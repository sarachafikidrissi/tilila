<?php

use App\Models\HeroSlide;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

test('admin can upload hero slide video via dedicated endpoint', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
    $file = UploadedFile::fake()->create('hero.mp4', 1024, 'video/mp4');

    $response = $this->actingAs($admin)->postJson(route('admin.hero-slides.upload-video'), [
        'video' => $file,
    ]);

    $response->assertOk()
        ->assertJsonStructure(['path']);

    $path = $response->json('path');
    expect($path)->toStartWith('hero_slides/videos/temp/');
    Storage::disk('public')->assertExists($path);
});

test('admin video upload endpoint rejects invalid file type', function () {
    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
    $file = UploadedFile::fake()->create('hero.txt', 100, 'text/plain');

    $response = $this->actingAs($admin)->postJson(route('admin.hero-slides.upload-video'), [
        'video' => $file,
    ]);

    $response->assertUnprocessable()
        ->assertJsonStructure(['message']);
});

test('store promotes temp video path to permanent storage', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
    $tempPath = 'hero_slides/videos/temp/hero.mp4';
    Storage::disk('public')->put($tempPath, 'video-content');

    $response = $this->actingAs($admin)->post(route('admin.hero-slides.store'), [
        'slide_key' => 'video-slide-store',
        'path_prefix' => '/about',
        'display_type' => 'banner',
        'media_type' => 'video',
        'video_path' => $tempPath,
        'display_mode' => 'banner_image',
        'is_active' => true,
        'sort_order' => 0,
        'image_contain' => false,
        'banner_image_contain' => false,
    ]);

    $response->assertRedirect(route('admin.hero-slides.index'));

    $slide = HeroSlide::query()->where('slide_key', 'video-slide-store')->first();
    $finalPath = 'hero_slides/videos/hero.mp4';

    expect($slide)->not->toBeNull()
        ->and($slide->video_path)->toBe($finalPath);

    Storage::disk('public')->assertMissing($tempPath);
    Storage::disk('public')->assertExists($finalPath);
});

test('update replaces video and deletes the old file once', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
    $oldPath = 'hero_slides/videos/old.mp4';
    $tempPath = 'hero_slides/videos/temp/new.mp4';
    Storage::disk('public')->put($oldPath, 'old-video');
    Storage::disk('public')->put($tempPath, 'new-video');

    $slide = HeroSlide::query()->create([
        'slide_key' => 'video-slide-replace',
        'media_type' => 'video',
        'video_path' => $oldPath,
        'display_mode' => 'banner_image',
        'display_type' => 'banner',
        'is_active' => true,
        'sort_order' => 0,
    ]);

    $response = $this->actingAs($admin)->put(route('admin.hero-slides.update', $slide), [
        'slide_key' => 'video-slide-replace',
        'path_prefix' => null,
        'display_type' => 'banner',
        'media_type' => 'video',
        'video_path' => $tempPath,
        'display_mode' => 'banner_image',
        'is_active' => true,
        'sort_order' => 0,
        'image_contain' => false,
        'banner_image_contain' => false,
    ]);

    $response->assertRedirect(route('admin.hero-slides.index'));

    $finalPath = 'hero_slides/videos/new.mp4';
    $slide->refresh();

    expect($slide->video_path)->toBe($finalPath);

    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertMissing($tempPath);
    Storage::disk('public')->assertExists($finalPath);
});

test('update switching from video to image deletes the old video once', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
    $oldPath = 'hero_slides/videos/old.mp4';
    Storage::disk('public')->put($oldPath, 'old-video');

    $slide = HeroSlide::query()->create([
        'slide_key' => 'video-slide-switch',
        'media_type' => 'video',
        'video_path' => $oldPath,
        'display_mode' => 'banner_image',
        'display_type' => 'banner',
        'is_active' => true,
        'sort_order' => 0,
    ]);

    $response = $this->actingAs($admin)->put(route('admin.hero-slides.update', $slide), [
        'slide_key' => 'video-slide-switch',
        'path_prefix' => null,
        'display_type' => 'banner',
        'media_type' => 'image',
        'display_mode' => 'banner_image',
        'is_active' => true,
        'sort_order' => 0,
        'image_contain' => false,
        'banner_image_contain' => false,
    ]);

    $response->assertRedirect(route('admin.hero-slides.index'));

    $slide->refresh();

    expect($slide->media_type)->toBe('image')
        ->and($slide->video_path)->toBeNull();

    Storage::disk('public')->assertMissing($oldPath);
});

test('cleanup command deletes temp videos older than 24 hours', function () {
    Storage::fake('public');

    $stalePath = 'hero_slides/videos/temp/stale.mp4';
    $recentPath = 'hero_slides/videos/temp/recent.mp4';
    Storage::disk('public')->put($stalePath, 'stale-video');
    Storage::disk('public')->put($recentPath, 'recent-video');

    touch(Storage::disk('public')->path($stalePath), now()->subHours(25)->timestamp);

    Artisan::call('hero-slides:cleanup-temp-videos');

    Storage::disk('public')->assertMissing($stalePath);
    Storage::disk('public')->assertExists($recentPath);
});

test('store clears stale temp video path when file is missing', function () {
    Storage::fake('public');
    Log::spy();

    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
    $tempPath = 'hero_slides/videos/temp/missing.mp4';

    $response = $this->actingAs($admin)->post(route('admin.hero-slides.store'), [
        'slide_key' => 'video-slide-missing-temp',
        'path_prefix' => '/about',
        'display_type' => 'banner',
        'media_type' => 'video',
        'video_path' => $tempPath,
        'display_mode' => 'banner_image',
        'is_active' => true,
        'sort_order' => 0,
        'image_contain' => false,
        'banner_image_contain' => false,
    ]);

    $response->assertRedirect(route('admin.hero-slides.index'));

    $slide = HeroSlide::query()->where('slide_key', 'video-slide-missing-temp')->first();

    expect($slide)->not->toBeNull()
        ->and($slide->video_path)->toBeNull();

    Log::shouldHaveReceived('warning')
        ->once()
        ->with('Temp video file not found during promotion', [
            'temp_path' => $tempPath,
        ]);
});

test('store throws user-friendly error when temp video promotion fails', function () {
    Log::spy();

    $tempPath = 'hero_slides/videos/temp/hero.mp4';
    $disk = Mockery::mock(\Illuminate\Contracts\Filesystem\Filesystem::class);
    $disk->shouldReceive('exists')->with($tempPath)->andReturn(true);
    $disk->shouldReceive('move')->andThrow(new \Exception('Permission denied'));
    Storage::shouldReceive('disk')->with('public')->andReturn($disk);

    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);

    $this->withoutExceptionHandling();

    expect(fn () => $this->actingAs($admin)->post(route('admin.hero-slides.store'), [
        'slide_key' => 'video-slide-move-fail',
        'path_prefix' => '/about',
        'display_type' => 'banner',
        'media_type' => 'video',
        'video_path' => $tempPath,
        'display_mode' => 'banner_image',
        'is_active' => true,
        'sort_order' => 0,
        'image_contain' => false,
        'banner_image_contain' => false,
    ]))->toThrow(
        \RuntimeException::class,
        'The video could not be saved. Please re-upload and try again.',
    );

    Log::shouldHaveReceived('error')
        ->once()
        ->with('Failed to promote temp video file', Mockery::on(function (array $context) use ($tempPath) {
            return $context['temp_path'] === $tempPath
                && $context['final_path'] === 'hero_slides/videos/hero.mp4'
                && $context['error'] === 'Permission denied';
        }));
});

test('cleanup command continues when lastModified fails for a file', function () {
    Log::spy();

    $badPath = 'hero_slides/videos/temp/bad.mp4';
    $stalePath = 'hero_slides/videos/temp/stale.mp4';
    $disk = Mockery::mock(\Illuminate\Contracts\Filesystem\Filesystem::class);
    $disk->shouldReceive('files')
        ->with('hero_slides/videos/temp')
        ->andReturn([$badPath, $stalePath]);
    $disk->shouldReceive('lastModified')
        ->with($badPath)
        ->andThrow(new \Exception('permission denied'));
    $disk->shouldReceive('lastModified')
        ->with($stalePath)
        ->andReturn(now()->subHours(25)->timestamp);
    $disk->shouldReceive('delete')
        ->with($stalePath)
        ->andReturn(true);
    Storage::shouldReceive('disk')->with('public')->andReturn($disk);

    Artisan::call('hero-slides:cleanup-temp-videos');

    expect(Artisan::output())->toContain('Cleaned up 1 temp video file(s).');

    Log::shouldHaveReceived('error')
        ->once()
        ->with('CleanupTempVideoUploads: could not read lastModified', Mockery::on(function (array $context) use ($badPath) {
            return $context['file'] === $badPath
                && $context['error'] === 'permission denied';
        }));
});
