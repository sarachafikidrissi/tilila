<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

final class YoutubeVideo
{
    /**
     * Convert a YouTube watch, live, short, youtu.be, or embed URL to a canonical embed URL, or null if invalid.
     */
    public static function embedUrlFromInput(string $url): ?string
    {
        $url = trim($url);
        if ($url === '') {
            return null;
        }

        if (preg_match('#youtube(?:-nocookie)?\.com/embed/([a-zA-Z0-9_-]+)#', $url, $m)) {
            return 'https://www.youtube.com/embed/'.$m[1];
        }

        if (preg_match('#(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/(?:shorts|live)/)([a-zA-Z0-9_-]+)#', $url, $m)) {
            return 'https://www.youtube.com/embed/'.$m[1];
        }

        return null;
    }

    public static function watchUrlFromInput(string $url): ?string
    {
        $embed = self::embedUrlFromInput($url);
        if ($embed === null) {
            return null;
        }

        if (! preg_match('#/embed/([a-zA-Z0-9_-]+)#', $embed, $m)) {
            return null;
        }

        return 'https://www.youtube.com/watch?v='.$m[1];
    }

    public static function resolveEmbeddableUrl(?string $url): ?string
    {
        if (! is_string($url)) {
            return null;
        }

        $url = trim($url);
        if ($url === '') {
            return null;
        }

        $embed = self::embedUrlFromInput($url);
        if ($embed === null) {
            return null;
        }

        return self::isEmbeddable($url) ? $embed : null;
    }

    public static function isEmbeddable(string $url): bool
    {
        $watchUrl = self::watchUrlFromInput($url);
        if ($watchUrl === null) {
            return false;
        }

        $cacheKey = 'youtube_embeddable:'.md5($watchUrl);

        return (bool) Cache::remember($cacheKey, now()->addHours(12), function () use ($watchUrl): bool {
            try {
                $response = Http::timeout(4)
                    ->acceptJson()
                    ->get('https://www.youtube.com/oembed', [
                        'url' => $watchUrl,
                        'format' => 'json',
                    ]);

                return $response->successful();
            } catch (\Throwable) {
                return false;
            }
        });
    }
}
