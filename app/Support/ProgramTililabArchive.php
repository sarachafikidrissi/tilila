<?php

namespace App\Support;

use App\Models\TililaEdition;
use App\Models\TililabEdition;

class ProgramTililabArchive
{
    /** @var array<string, string|null> */
    private static array $tililaCeremonyByYear = [];

    /** @var array<string, array<string, string>> */
    private static array $tililaJuryPhotosByYear = [];

    public static function enrichEdition(TililabEdition $edition): TililabEdition
    {
        if (
            empty($edition->ceremony_video_path)
            && empty($edition->ceremony_video_url)
        ) {
            $edition->ceremony_video_url = self::resolveCeremonyVideoUrl($edition->year);
        }

        $jury = is_array($edition->jury) ? $edition->jury : [];
        $edition->jury = self::enrichJuryPhotos($jury, $edition->year);

        return $edition;
    }

    /**
     * @param  list<array<string, mixed>>  $jury
     * @return list<array<string, mixed>>
     */
    public static function enrichJuryPhotos(array $jury, int|string|null $tililabYear): array
    {
        if ($jury === []) {
            return $jury;
        }

        $tililaYear = self::resolveTililaYear((int) $tililabYear);
        if ($tililaYear === null) {
            return $jury;
        }

        $photoMap = self::tililaJuryPhotoMapForYear($tililaYear);
        if ($photoMap === []) {
            return $jury;
        }

        return array_values(array_map(function (mixed $person) use ($photoMap): array {
            if (! is_array($person)) {
                return [];
            }

            $photoPath = $person['photo_path'] ?? null;
            if (is_string($photoPath) && $photoPath !== '') {
                return $person;
            }

            $name = self::normalizePersonName((string) ($person['full_name'] ?? ''));
            if ($name !== '' && isset($photoMap[$name])) {
                $person['photo_path'] = $photoMap[$name];
            }

            return $person;
        }, $jury));
    }

    public static function resolveCeremonyVideoUrl(int|string|null $tililabYear): ?string
    {
        $year = (int) $tililabYear;
        if ($year <= 0) {
            return null;
        }

        $tililaYear = self::resolveTililaYear($year);
        if ($tililaYear === null) {
            return null;
        }

        $key = (string) $tililaYear;

        if (! array_key_exists($key, self::$tililaCeremonyByYear)) {
            self::$tililaCeremonyByYear[$key] = TililaEdition::query()
                ->where('year', $key)
                ->value('ceremony_video_url');
        }

        $url = self::$tililaCeremonyByYear[$key];

        return is_string($url) && $url !== '' ? $url : null;
    }

    private static function resolveTililaYear(int $tililabYear): ?int
    {
        if ($tililabYear >= 2026) {
            return 2025;
        }

        if (TililaEdition::query()->where('year', (string) $tililabYear)->exists()) {
            return $tililabYear;
        }

        return null;
    }

    /** @return array<string, string> */
    private static function tililaJuryPhotoMapForYear(int $tililaYear): array
    {
        $key = (string) $tililaYear;

        if (! array_key_exists($key, self::$tililaJuryPhotosByYear)) {
            $rows = TililaEdition::query()->where('year', $key)->value('jury');
            $rows = is_array($rows) ? $rows : [];

            $map = [];
            foreach ($rows as $row) {
                if (! is_array($row)) {
                    continue;
                }

                $name = self::normalizePersonName((string) ($row['full_name'] ?? ''));
                $path = $row['photo_path'] ?? null;

                if ($name !== '' && is_string($path) && $path !== '') {
                    $map[$name] = $path;
                }
            }

            self::$tililaJuryPhotosByYear[$key] = $map;
        }

        return self::$tililaJuryPhotosByYear[$key];
    }

    private static function normalizePersonName(string $name): string
    {
        $normalized = preg_replace('/\s+/u', ' ', trim($name));

        return mb_strtolower(is_string($normalized) ? $normalized : '');
    }
}
