function parseParticipantDate(value) {
    if (!value) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}

export function formatParticipantDate(value) {
    const date = parseParticipantDate(value);
    if (!date) {
        return value ?? '—';
    }

    return date.toLocaleDateString('fr-FR', {
        dateStyle: 'long',
    });
}

export function formatParticipantDateTime(value) {
    const date = parseParticipantDate(value);
    if (!date) {
        return value ?? '—';
    }

    return date.toLocaleString('fr-FR', {
        dateStyle: 'long',
        timeStyle: 'short',
    });
}

export function ParticipantRow({ label, value }) {
    return (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-4 sm:gap-4">
            <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
            </div>
            {typeof value === 'string' && value.startsWith('http') ? (
                <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-beta-blue hover:underline sm:col-span-3"
                >
                    {value}
                </a>
            ) : (
                <div className="text-sm wrap-break-word whitespace-pre-wrap text-foreground sm:col-span-3">
                    {value ?? '—'}
                </div>
            )}
        </div>
    );
}

export function ParticipantFileLink({ label, url }) {
    if (!url) {
        return <ParticipantRow label={label} value={null} />;
    }

    return (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-4 sm:gap-4">
            <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
            </div>
            <div className="sm:col-span-3">
                <a
                    href={url}
                    className="text-sm font-semibold text-beta-blue hover:underline"
                    target="_blank"
                    rel="noreferrer"
                >
                    Download / view file
                </a>
            </div>
        </div>
    );
}
