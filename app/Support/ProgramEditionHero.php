<?php

namespace App\Support;

use App\Models\TililabEdition;
use App\Models\TililaEdition;

class ProgramEditionHero
{
    /**
     * @return array<string, mixed>
     */
    public static function forTilila(TililaEdition $edition): array
    {
        return self::normalizeStoredVideoFields($edition->toArray());
    }

    /**
     * @return array<string, mixed>
     */
    public static function forTililab(TililabEdition $edition): array
    {
        $edition->withJuryPhotoEnrichment();

        return self::normalizeStoredVideoFields($edition->toArray());
    }

    /**
     * @param  array<string, mixed>  $edition
     * @return array<string, mixed>
     */
    public static function normalizeStoredVideoFields(array $edition): array
    {
        $path = is_string($edition['ceremony_video_path'] ?? null)
            ? trim((string) $edition['ceremony_video_path'])
            : '';
        $url = is_string($edition['ceremony_video_url'] ?? null)
            ? trim((string) $edition['ceremony_video_url'])
            : '';

        $edition['ceremony_video_path'] = $path !== '' ? $path : null;
        $edition['ceremony_video_url'] = $url !== '' ? $url : null;

        return $edition;
    }
}
