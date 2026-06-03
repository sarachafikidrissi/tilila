import TransText from '@/components/TransText';
import { TILILA_EDITIONS_HISTORY } from '@/pages/user/tilila/data/tilila-editions-history';
import { cn } from '@/lib/utils';

export default function EditionsHistorySection() {
    return (
        <section
            id="editions-history"
            className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-bold tracking-[0.2em] text-beta-blue uppercase">
                    <TransText
                        en="Trophée Tilila"
                        fr="Trophée Tilila"
                        ar="جائزة تيليلا"
                    />
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-tblack sm:text-4xl">
                    <TransText
                        en="Seven editions of impact"
                        fr="Sept éditions d’impact"
                        ar="سبع دورات للأثر"
                    />
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-tgray sm:text-base">
                    <TransText
                        en="From the first ceremony in 2018 to the 2025 edition honouring rural women, the Trophée has grown with 2M’s Parity and Diversity Committee—recognising advertising that respects women, diversity, and inclusion."
                        fr="De la première cérémonie en 2018 à l’édition 2025 dédiée aux femmes rurales, le Trophée s’est imposé avec le Comité Parité et Diversité de 2M—en récompensant une publicité respectueuse des femmes, de la diversité et de l’inclusion."
                        ar="من أول حفل في 2018 إلى دورة 2025 المكرّسة للمرأة الريفية، رسّخت الجائزة مع لجنة المساواة والتنوع بـ2M إعلاناً يحترم المرأة والتنوع والإدماج."
                    />
                </p>
            </div>

            <div className="mt-12 space-y-6">
                <ol className="space-y-6">
                    {TILILA_EDITIONS_HISTORY.map((edition, index) => (
                        <li key={edition.year}>
                            <article
                                className={cn(
                                    'overflow-hidden rounded-3xl border border-border bg-white shadow-sm ring-1 ring-border/60',
                                    'transition-shadow hover:shadow-md',
                                )}
                            >
                                <div className="grid gap-0 md:grid-cols-[minmax(0,280px)_1fr]">
                                    <div className="relative aspect-5/4 max-h-56 bg-muted md:max-h-none md:min-h-[220px]">
                                        <img
                                            src={edition.posterSrc}
                                            alt=""
                                            className="h-full w-full object-cover object-top"
                                            loading={
                                                index < 2 ? 'eager' : 'lazy'
                                            }
                                            decoding="async"
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-tblack/45 via-transparent to-transparent" />
                                        <div className="absolute start-3 top-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-tblack shadow-sm ring-1 ring-border/60">
                                            {edition.year}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center p-6 sm:p-8">
                                        <h3 className="text-lg font-bold text-tblack sm:text-xl">
                                            <TransText
                                                en={edition.title.en}
                                                fr={edition.title.fr}
                                                ar={edition.title.ar}
                                            />
                                        </h3>
                                        <p className="mt-2 text-sm font-medium text-beta-blue">
                                            <TransText
                                                en={edition.ceremony.en}
                                                fr={edition.ceremony.fr}
                                                ar={edition.ceremony.ar}
                                            />
                                        </p>
                                        {edition.focus ? (
                                            <p className="mt-3 text-sm leading-relaxed text-tgray">
                                                <TransText
                                                    en={edition.focus.en}
                                                    fr={edition.focus.fr}
                                                    ar={edition.focus.ar}
                                                />
                                            </p>
                                        ) : null}
                                        {edition.lines.length > 0 ? (
                                            <ul className="mt-4 space-y-2 border-t border-border/80 pt-4 text-sm leading-relaxed text-tgray">
                                                {edition.lines.map(
                                                    (line, i) => (
                                                        <li
                                                            key={`${edition.year}-${i}`}
                                                            className="flex gap-2"
                                                        >
                                                            <span
                                                                className="mt-2 size-1 shrink-0 rounded-full bg-beta-blue/80"
                                                                aria-hidden
                                                            />
                                                            <span>
                                                                <TransText
                                                                    en={line.en}
                                                                    fr={line.fr}
                                                                    ar={line.ar}
                                                                />
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
