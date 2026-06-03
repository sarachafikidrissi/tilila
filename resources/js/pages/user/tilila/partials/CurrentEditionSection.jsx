import { Link } from '@inertiajs/react';
import { GalleryHorizontal, Gavel, Sparkles } from 'lucide-react';

import TransText from '@/components/TransText';
import TililaPeopleGrid from '@/components/TililaPeopleGrid';
import EventReplay from '@/pages/events/Partials/Details/EventReplay';
import { getYoutubeEmbedUrl } from '@/lib/youtubeEmbed';
import { coverImageSrc } from '@/pages/user/tilila/utils/editions';

function GalleryGrid({ images }) {
    const rows = Array.isArray(images) ? images : [];

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-foreground">
                <TransText en="Gallery" fr="Galerie" ar="المعرض" />
            </h3>
            {rows.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
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
                                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
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

export default function CurrentEditionSection({ edition, onOpenParticipate }) {
    if (!edition) {
        return null;
    }

    const jury = Array.isArray(edition.jury) ? edition.jury : [];
    const images = Array.isArray(edition.gallery_images)
        ? edition.gallery_images
        : [];
    const ceremonyEmbed = getYoutubeEmbedUrl(edition.ceremony_video_url);
    const coverSrc = coverImageSrc(
        edition.cover_image_path,
        edition.gallery_images,
    );
    const editionId = edition.id;

    return (
        <section
            id="current-edition"
            className="border-b border-border bg-linear-to-b from-beta-blue/5 via-background to-background py-14 sm:py-16"
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
                                en={`Edition ${edition.year ?? ''}`}
                                fr={`Édition ${edition.year ?? ''}`}
                                ar={`دورة ${edition.year ?? ''}`}
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
                                en="Winners will be announced after the jury deliberation and awards ceremony. Submit your campaign while submissions are open."
                                fr="Les lauréats seront annoncés après les délibérations du jury et la cérémonie. Déposez votre candidature tant que les inscriptions sont ouvertes."
                                ar="يُعلَن عن الفائزين بعد مداولات لجنة التحكيم وحفل التوزيع. قدّم حملتك ما دامت الترشيحات مفتوحة."
                            />
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            {typeof onOpenParticipate === 'function' ? (
                                <button
                                    type="button"
                                    onClick={onOpenParticipate}
                                    className="inline-flex items-center justify-center rounded-lg bg-beta-blue px-5 py-2.5 text-sm font-semibold text-twhite shadow-sm transition hover:bg-beta-blue/90"
                                >
                                    <TransText
                                        en="Submit your campaign"
                                        fr="Déposer une candidature"
                                        ar="قدّم ترشيحك"
                                    />
                                </button>
                            ) : null}
                            {editionId ? (
                                <>
                                    <Link
                                        href={`/tilila/editions/${editionId}/jury`}
                                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                                    >
                                        <Gavel className="size-4 text-muted-foreground" />
                                        <TransText
                                            en="Jury"
                                            fr="Jury"
                                            ar="لجنة التحكيم"
                                        />
                                    </Link>
                                    {(edition.has_gallery ||
                                        images.length > 0) && (
                                        <Link
                                            href={`/tilila/editions/${editionId}/gallery`}
                                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                                        >
                                            <GalleryHorizontal className="size-4 text-muted-foreground" />
                                            <TransText
                                                en="Gallery"
                                                fr="Galerie"
                                                ar="المعرض"
                                            />
                                        </Link>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>

                {ceremonyEmbed ? (
                    <div id="ceremony" className="mt-12">
                        <EventReplay
                            title={
                                <TransText
                                    en="Awards ceremony"
                                    fr="Cérémonie des lauréats"
                                    ar="حفل توزيع الجوائز"
                                />
                            }
                            videoTitle={
                                edition.edition_label?.en
                                    ? `${edition.edition_label.en} — ceremony`
                                    : 'Awards ceremony'
                            }
                            embedUrl={ceremonyEmbed}
                            mode="replay"
                        />
                    </div>
                ) : null}

                {jury.length > 0 ? (
                    <div id="jury" className="mt-12">
                        <TililaPeopleGrid
                            title={
                                <TransText
                                    en="Jury"
                                    fr="Jury"
                                    ar="لجنة التحكيم"
                                />
                            }
                            people={jury}
                        />
                    </div>
                ) : null}

                {(edition.has_gallery || images.length > 0) && (
                    <div id="gallery">
                        <GalleryGrid images={images} />
                    </div>
                )}
            </div>
        </section>
    );
}
