export const EVENT_TYPE_PRESETS = [
    { value: 'tilitalks', label: 'TiliTalks' },
    { value: 'tilila-awards', label: 'Tilila Awards' },
    { value: 'tililab', label: 'Tililab' },
];

export const EVENT_TYPE_OTHER = 'other';

export const EVENT_STATUSES = ['upcoming', 'live', 'finished'];

const LEGACY_TYPE_MAP = {
    tilitalk: 'tilitalks',
    talk: 'tilitalks',
    webinar: 'tilitalks',
    workshop: 'tilitalks',
    trophy: 'tilila-awards',
    awards: 'tilila-awards',
};

const PRESET_VALUES = EVENT_TYPE_PRESETS.map((t) => t.value);

export function normalizeStoredType(type) {
    const raw = String(type ?? '').trim();
    const key = raw.toLowerCase();

    if (LEGACY_TYPE_MAP[key]) {
        return LEGACY_TYPE_MAP[key];
    }

    if (PRESET_VALUES.includes(key)) {
        return key;
    }

    return raw;
}

export function splitTypeForForm(storedType) {
    const normalized = normalizeStoredType(storedType);

    if (PRESET_VALUES.includes(normalized)) {
        return { type_kind: normalized, type_custom: '' };
    }

    const raw = String(storedType ?? '').trim();

    return { type_kind: EVENT_TYPE_OTHER, type_custom: raw };
}

export function normalizeStoredStatus(status) {
    const s = String(status ?? 'upcoming').toLowerCase();

    if (s === 'draft') {
        return 'upcoming';
    }

    if (s === 'archived') {
        return 'finished';
    }

    if (EVENT_STATUSES.includes(s)) {
        return s;
    }

    return 'upcoming';
}

export function initialEventTypeFields(storedType = 'tilitalks') {
    return splitTypeForForm(storedType);
}

export function resolveTypeForSubmit({ type_kind, type_custom }) {
    if (type_kind === EVENT_TYPE_OTHER) {
        return String(type_custom ?? '').trim();
    }

    return type_kind;
}

export function buildEventSubmitPayload(data) {
    const { type_kind, type_custom, ...rest } = data;

    return {
        ...rest,
        type: resolveTypeForSubmit({ type_kind, type_custom }),
    };
}

export function typeLabel(type) {
    const preset = EVENT_TYPE_PRESETS.find(
        (t) => t.value === normalizeStoredType(type),
    );

    if (preset) {
        return preset.label;
    }

    const raw = String(type ?? '').trim();

    return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : '—';
}

/** Map stored type to public agenda category filter key. */
export function categoryKeyForFilter(type) {
    const t = normalizeStoredType(type);

    if (t === 'tililab') {
        return 'tililab';
    }

    if (t === 'tilila-awards') {
        return 'awards';
    }

    return 'tilitalks';
}
