<?php

namespace App\Support;

final class EventOptions
{
    public const TYPE_TILITALKS = 'tilitalks';

    public const TYPE_TILILA_AWARDS = 'tilila-awards';

    public const TYPE_TILILAB = 'tililab';

    /** @var list<string> */
    public const TYPE_PRESETS = [
        self::TYPE_TILITALKS,
        self::TYPE_TILILA_AWARDS,
        self::TYPE_TILILAB,
    ];

    /** @var list<string> */
    public const STATUSES = ['upcoming', 'live', 'finished'];

    /**
     * @return list<string>
     */
    public static function typePresets(): array
    {
        return self::TYPE_PRESETS;
    }

    /**
     * @return list<string>
     */
    public static function statuses(): array
    {
        return self::STATUSES;
    }

    public static function isPresetType(string $type): bool
    {
        return in_array(strtolower(trim($type)), self::TYPE_PRESETS, true);
    }

    public static function typeLabel(string $type): string
    {
        return match (strtolower(trim($type))) {
            self::TYPE_TILITALKS, 'tilitalk', 'talk', 'webinar', 'workshop' => 'TiliTalks',
            self::TYPE_TILILA_AWARDS, 'trophy', 'awards' => 'Tilila Awards',
            self::TYPE_TILILAB => 'Tililab',
            default => ucfirst(str_replace(['-', '_'], ' ', trim($type))),
        };
    }

    public static function normalizeStoredType(string $type): string
    {
        $t = strtolower(trim($type));

        return match ($t) {
            'tilitalk', 'talk', 'webinar', 'workshop' => self::TYPE_TILITALKS,
            'trophy', 'awards' => self::TYPE_TILILA_AWARDS,
            'tililab' => self::TYPE_TILILAB,
            default => trim($type),
        };
    }

    public static function normalizeStoredStatus(string $status): string
    {
        $s = strtolower(trim($status));

        return match ($s) {
            'draft' => 'upcoming',
            'archived' => 'finished',
            default => in_array($s, self::STATUSES, true) ? $s : 'upcoming',
        };
    }

    /**
     * @return array{0: string, 1: string} [type_kind, type_custom]
     */
    public static function splitTypeForForm(string $storedType): array
    {
        $normalized = self::normalizeStoredType($storedType);

        if (self::isPresetType($normalized)) {
            return [$normalized, ''];
        }

        return ['other', trim($storedType)];
    }
}
