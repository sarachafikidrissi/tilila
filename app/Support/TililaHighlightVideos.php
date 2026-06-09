<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class TililaHighlightVideos
{
    public static function teaserUrl(): ?string
    {
        return self::publicDiskUrl('teaser_video_path');
    }

    public static function bestOfUrl(): ?string
    {
        return self::publicDiskUrl('best_of_video_path');
    }

    private static function publicDiskUrl(string $configKey): ?string
    {
        $relative = ltrim((string) config("tilila.{$configKey}"), '/');

        if ($relative === '' || ! Storage::disk('public')->exists($relative)) {
            return null;
        }

        return Storage::disk('public')->url($relative);
    }
}
