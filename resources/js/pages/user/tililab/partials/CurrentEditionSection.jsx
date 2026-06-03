import { Link } from '@inertiajs/react';
import { GalleryHorizontal, Gavel, Sparkles } from 'lucide-react';

import TransText from '@/components/TransText';
import TililaPeopleGrid from '@/components/TililaPeopleGrid';
import { coverImageSrc } from '@/pages/user/tililab/utils/editions';

function GalleryGrid({ images }) {
    const rows = Array.isArray(images) ? images : [];

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-tblack">
                <TransText en="Gallery" fr="Galerie" ar="المعرض" />
            </h2>
            {rows.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-border bg-beta-white p-10 text-center text-sm text-tgray">
                    <TransText
                        en="Gallery images will be published during the edition."
                        fr="Les images de la galerie seront publiées au fil de l’édition."
                        ar="سيتم نشر صور المعرض خلال الدورة."
                    />
                </div>
            ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rows.map((path) => {
                        const src = path ? `/storage/${path}` : '';
                        return (
                            <a
                                key={path}
                                href={src}
                                target="_blank"
                                rel="noreferrer"
                                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                            >
                                <div className="aspect-4/3 bg-muted">
                                    {src ? (
                                        <img
                                            src={src}
                                            alt=""
                                            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : null}
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function TililabCurrentEditionSection({ edition }) {
    if (!edition) {
        return null;
    }

    const jury = Array.isArray(edition.jury) ? edition.jury : [];
    const images = Array.isArray(edition.gallery_images)
        ? edition.gallery_images
        : [];
    const coverSrc = coverImageSrc(edition.gallery_images, edition.winners);
    const editionId = edition.id;

    return (
        <section
            id="current-edition"
            className="border-b border-border bg-linear-to-b from-alpha-blue/30 via-background to-background py-14 sm:py-16"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
                    {coverSrc ? (
                        <div className="w-full shrink-0 overflow-hidden rounded-3xl border border-border bg-muted shadow-md lg:max-w-md">
                            <img
                                src={coverSrc}
                                alt=""
                                className="aspect-4/3 w-full object-cover"
                                loading="eager"
                                decoding="async"
                            />
                        </div>
                    ) : null}

                    <div className="min-w-0 flex-1">
                        <p className="inline-flex items-center gap-2 rounded-full border border-beta-blue/30 bg-beta-blue/10 px-3 py-1 text-xs font-bold tracking-[0.18em] text-beta-blue uppercase">
                            <Sparkles className="size-3.5" aria-hidden />
                            <TransText
                                en="Current edition"
                                fr="Édition en cours"
                                ar="الدورة الحالية"
                            />
                        </p>
                        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            <TransText
                                en={`Tililab ${edition.year ?? ''}`}
                                fr={`Tililab ${edition.year ?? ''}`}
                                ar={`تيليلاب ${edition.year ?? ''}`}
                            />
                        </h2>
                        <p className="mt-2 text-base font-semibold text-foreground">
                            <TransText
                                en={edition.edition_label?.en ?? ''}
                                fr={edition.edition_label?.fr ?? ''}
                                ar={edition.edition_label?.ar ?? ''}
                            />
                        </p>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                            <TransText
                                en={edition.theme?.en ?? ''}
                                fr={edition.theme?.fr ?? ''}
                                ar={edition.theme?.ar ?? ''}
                            />
                        </p>
                        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
                            <TransText
                                en="Winners will be announced after the national final. Submit your application while registrations are open."
                                fr="Les lauréats seront annoncés après la finale nationale. Déposez votre candidature tant que les inscriptions sont ouvertes."
                                ar="يُعلَن عن الفائزين بعد النهائي الوطني. قدّم ترشيحك ما دامت التسجيلات مفتوحة."
                            />
                        </p>

                        <nav
                            className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-beta-blue"
                            aria-label="Current edition sections"
                        >
                            <a
                                href="#current-edition-jury"
                                className="hover:underline"
                            >
                                <TransText
                                    en="Jury"
                                    fr="Jury"
                                    ar="لجنة التحكيم"
                                />
                            </a>
                            {(edition.has_gallery || images.length > 0) && (
                                <>
                                    <span className="text-tgray">·</span>
                                    <a
                                        href="#current-edition-gallery"
                                        className="hover:underline"
                                    >
                                        <TransText
                                            en="Gallery"
                                            fr="Galerie"
                                            ar="المعرض"
                                        />
                                    </a>
                                </>
                            )}
                        </nav>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/tililab/form"
                                className="inline-flex items-center justify-center rounded-lg bg-beta-blue px-5 py-2.5 text-sm font-semibold text-twhite shadow-sm transition hover:bg-beta-blue/90"
                            >
                                <TransText
                                    en="Open application form"
                                    fr="Ouvrir le formulaire"
                                    ar="افتح الاستمارة"
                                />
                            </Link>
                            {editionId ? (
                                <Link
                                    href={`/tililab/editions/${editionId}#jury`}
                                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                                >
                                    <Gavel className="size-4 text-muted-foreground" />
                                    <TransText
                                        en="Full edition page"
                                        fr="Fiche édition complète"
                                        ar="صفحة الدورة الكاملة"
                                    />
                                </Link>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div id="current-edition-jury">
                    <TililaPeopleGrid
                        title={
                            <TransText en="Jury" fr="Jury" ar="لجنة التحكيم" />
                        }
                        people={jury}
                    />
                </div>

                {(edition.has_gallery || images.length > 0) && (
                    <div id="current-edition-gallery">
                        <GalleryGrid images={images} />
                    </div>
                )}
            </div>
        </section>
    );
}
