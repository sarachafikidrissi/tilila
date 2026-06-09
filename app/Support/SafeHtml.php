<?php

namespace App\Support;

class SafeHtml
{
    private const ALLOWED_TAGS = '<p><br><strong><b><em><i><u><ul><ol><li><a><h2><h3><h4><blockquote><span>';

    public static function sanitize(?string $html): string
    {
        if ($html === null || trim($html) === '') {
            return '';
        }

        $withoutScripts = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $html) ?? $html;
        $clean = strip_tags($withoutScripts, self::ALLOWED_TAGS);

        return preg_replace(
            '/\s(href|src)\s*=\s*([\'"])\s*javascript:[^\'"]*\2/i',
            '',
            $clean,
        ) ?? $clean;
    }

    /**
     * @param  array{en: string, fr: string, ar: string}  $content
     * @return array{en: string, fr: string, ar: string}
     */
    public static function sanitizeTriLang(array $content): array
    {
        return [
            'en' => self::sanitize($content['en'] ?? ''),
            'fr' => self::sanitize($content['fr'] ?? ''),
            'ar' => self::sanitize($content['ar'] ?? ''),
        ];
    }
}
