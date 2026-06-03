import TransText from '@/components/TransText';

function hasTrophyLabel(trophy) {
    if (!trophy || typeof trophy !== 'object') {
        return false;
    }

    return Boolean(
        String(trophy.en ?? '').trim() ||
        String(trophy.fr ?? '').trim() ||
        String(trophy.ar ?? '').trim(),
    );
}

export default function TililaPeopleGrid({
    title,
    people = [],
    showTrophy = false,
}) {
    const rows = Array.isArray(people) ? people : [];

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-tblack">{title}</h2>
            {rows.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-border bg-beta-white p-10 text-center text-sm text-tgray">
                    <TransText
                        en="No entries yet."
                        fr="Aucune entrée pour le moment."
                        ar="لا توجد إدخالات بعد."
                    />
                </div>
            ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rows.map((p, idx) => {
                        const img = p?.photo_path
                            ? `/storage/${p.photo_path}`
                            : '';

                        return (
                            <div
                                key={`${p?.full_name ?? 'person'}-${idx}`}
                                className="rounded-2xl border border-border bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                                        {img ? (
                                            <img
                                                src={img}
                                                alt=""
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="min-w-0">
                                        {showTrophy &&
                                        hasTrophyLabel(p?.trophy) ? (
                                            <div className="text-xs font-bold tracking-wide text-beta-blue uppercase">
                                                <TransText
                                                    en={p.trophy.en}
                                                    fr={p.trophy.fr}
                                                    ar={p.trophy.ar}
                                                />
                                            </div>
                                        ) : null}
                                        <div
                                            className={
                                                showTrophy &&
                                                hasTrophyLabel(p?.trophy)
                                                    ? 'mt-1 text-base font-semibold text-foreground'
                                                    : 'text-base font-semibold text-foreground'
                                            }
                                        >
                                            {p?.full_name ?? ''}
                                        </div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            <TransText
                                                en={p?.bio?.en ?? ''}
                                                fr={p?.bio?.fr ?? ''}
                                                ar={p?.bio?.ar ?? ''}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
