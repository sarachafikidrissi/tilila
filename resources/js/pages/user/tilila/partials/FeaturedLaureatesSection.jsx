import { Link, usePage } from '@inertiajs/react';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';

function latestLaureates(editions, limit = 3) {
    const out = [];
    if (!Array.isArray(editions)) return out;

    for (const edition of editions) {
        const winners = Array.isArray(edition?.winners) ? edition.winners : [];
        if (winners.length === 0) continue;

        for (const person of winners) {
            out.push({
                person,
                editionId: edition?.id,
                editionYear: edition?.year,
            });
            if (out.length >= limit) return out;
        }
    }

    return out;
}

export default function FeaturedLaureatesSection() {
    const { locale } = useTranslation();
    const { editions } = usePage().props;

    const featured = latestLaureates(editions, 3);

    return (
        <section id="featured" className="mx-auto max-w-7xl px-4 pt-8 pb-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="text-xs font-semibold tracking-widest text-tgray">
                        <TransText en="FEATURED" fr="À LA UNE" ar="مميّز" />
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-tblack">
                        <TransText
                            en="Featured Laureates"
                            fr="Lauréats à la une"
                            ar="فائزون مميزون"
                        />
                    </h2>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {featured.length === 0 ? (
                    <div className="rounded-3xl border border-border bg-background p-10 text-center text-sm text-tgray lg:col-span-3">
                        <TransText
                            en="No winners have been added yet."
                            fr="Aucun lauréat n’a encore été ajouté."
                            ar="لم تتم إضافة فائزين بعد."
                        />
                    </div>
                ) : (
                    featured.map(({ person, editionId, editionYear }, idx) => {
                        const imageUrl = person?.photo_path
                            ? `/storage/${person.photo_path}`
                            : '';
                        const title =
                            locale === 'ar'
                                ? person?.full_name
                                : locale === 'fr'
                                  ? person?.full_name
                                  : person?.full_name;

                        const detailsUrl = editionId
                            ? `/tilila/editions/${editionId}`
                            : '/tilila#archive';

                        return (
                            <Link
                                key={`${person?.full_name ?? 'winner'}-${idx}`}
                                href={detailsUrl}
                                className="block overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition hover:shadow-md"
                            >
                                <div className="relative">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={title ?? ''}
                                            className="aspect-4/3 w-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div className="aspect-4/3 w-full bg-muted" />
                                    )}
                                    <span className="absolute top-4 left-4 rounded-full bg-background px-3 py-1 text-xs font-semibold text-tblack">
                                        {editionYear ?? ''}
                                    </span>
                                </div>
                                <div className="p-5">
                                    {person?.trophy &&
                                    (person.trophy.en ||
                                        person.trophy.fr ||
                                        person.trophy.ar) ? (
                                        <p className="text-xs font-bold tracking-wide text-beta-blue uppercase">
                                            <TransText
                                                en={person.trophy.en}
                                                fr={person.trophy.fr}
                                                ar={person.trophy.ar}
                                            />
                                        </p>
                                    ) : null}
                                    <h3
                                        className={
                                            person?.trophy
                                                ? 'mt-1 text-sm font-semibold text-tblack'
                                                : 'text-sm font-semibold text-tblack'
                                        }
                                    >
                                        {person?.full_name ?? '—'}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-tgray">
                                        <TransText
                                            en={person?.bio?.en ?? ''}
                                            fr={person?.bio?.fr ?? ''}
                                            ar={person?.bio?.ar ?? ''}
                                        />
                                    </p>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </section>
    );
}
