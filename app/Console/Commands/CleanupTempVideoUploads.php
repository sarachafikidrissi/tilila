<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CleanupTempVideoUploads extends Command
{
    protected $signature = 'hero-slides:cleanup-temp-videos';

    protected $description = 'Delete orphaned hero slide video uploads in temp storage older than 24 hours';

    public function handle(): void
    {
        $disk = Storage::disk('public');
        $files = $disk->files('hero_slides/videos/temp');
        $deleted = 0;

        foreach ($files as $file) {
            try {
                $lastModified = $disk->lastModified($file);
            } catch (\Exception $e) {
                Log::error('CleanupTempVideoUploads: could not read lastModified', [
                    'file' => $file,
                    'error' => $e->getMessage(),
                ]);
                $this->error("Skipped (lastModified failed): {$file}");
                continue;
            }

            if (now()->timestamp - $lastModified <= 86400) {
                continue;
            }

            try {
                if ($disk->delete($file)) {
                    $deleted++;
                } else {
                    Log::warning('CleanupTempVideoUploads: delete returned false', [
                        'file' => $file,
                    ]);
                    $this->warn("Delete returned false: {$file}");
                }
            } catch (\Exception $e) {
                Log::error('CleanupTempVideoUploads: delete failed', [
                    'file' => $file,
                    'error' => $e->getMessage(),
                ]);
                $this->error("Delete failed: {$file}");
            }
        }

        $this->info("Cleaned up {$deleted} temp video file(s).");
    }
}
