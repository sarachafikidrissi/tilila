import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft, GalleryHorizontal, Gavel, Trophy } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import TransText from '@/components/TransText';
import EventReplay from '@/pages/events/Partials/Details/EventReplay';
import TililaPeopleGrid from '@/components/TililaPeopleGrid';
import { getYoutubeEmbedUrl } from '@/lib/youtubeEmbed';

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
                        en="No images yet for this edition."
                        fr="Aucune image pour cette édition."
                        ar="لا توجد صور لهذه الدورة بعد."
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

export default function TililaEditionDetails() {
    const { edition } = usePage().props;
    const winners = Array.isArray(edition?.winners) ? edition.winners : [];
    const jury = Array.isArray(edition?.jury) ? edition.jury : [];
    const images = Array.isArray(edition?.gallery_images)
        ? edition.gallery_images
        : [];
    const ceremonyEmbed = getYoutubeEmbedUrl(edition?.ceremony_video_url);

    return (
        <>
            <Head title={`Tilila Edition ${edition?.year ?? ''}`} />

            <section className="mx-auto max-w-7xl px-4 py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-xs font-semibold tracking-widest text-tgray">
                            <TransText
                                en="TROPHÉE TILILA"
                                fr="TROPHÉE TILILA"
                                ar="جائزة تيليلا"
                            />
                        </div>
                        <h1 className="mt-3 text-2xl font-semibold text-tblack sm:text-3xl">
                            <TransText
                                en={`Edition — ${edition?.year ?? ''}`}
                                fr={`Édition — ${edition?.year ?? ''}`}
                                ar={`الدورة — ${edition?.year ?? ''}`}
                            />
                        </h1>
                        <p className="mt-2 text-sm text-tgray">
                            <TransText
                                en={edition?.edition_label?.en ?? ''}
                                fr={edition?.edition_label?.fr ?? ''}
                                ar={edition?.edition_label?.ar ?? ''}
                            />
                        </p>
                        <p className="mt-1 text-sm text-tgray">
                            <TransText
                                en={edition?.theme?.en ?? ''}
                                fr={edition?.theme?.fr ?? ''}
                                ar={edition?.theme?.ar ?? ''}
                            />
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/tilila#past-editions"
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-tblack hover:bg-secondary"
                        >
                            <ChevronLeft className="size-4 text-tgray" />
                            <TransText
                                en="Back to archive"
                                fr="Retour aux archives"
                                ar="العودة للأرشيف"
                            />
                        </Link>
                        <Link
                            href={`/tilila/editions/${edition?.id}/winners`}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-tblack hover:bg-secondary"
                        >
                            <Trophy className="size-4 text-tgray" />
                            <TransText
                                en="Winners"
                                fr="Lauréats"
                                ar="الفائزون"
                            />
                        </Link>
                        <Link
                            href={`/tilila/editions/${edition?.id}/jury`}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-tblack hover:bg-secondary"
                        >
                            <Gavel className="size-4 text-tgray" />
                            <TransText en="Jury" fr="Jury" ar="لجنة التحكيم" />
                        </Link>
                        <Link
                            href={`/tilila/editions/${edition?.id}/gallery`}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-tblack hover:bg-secondary"
                        >
                            <GalleryHorizontal className="size-4 text-tgray" />
                            <TransText en="Gallery" fr="Galerie" ar="المعرض" />
                        </Link>
                    </div>
                </div>

                {ceremonyEmbed ? (
                    <div id="ceremony" className="mt-10">
                        <EventReplay
                            title={
                                <TransText
                                    en="Awards ceremony"
                                    fr="Cérémonie des lauréats"
                                    ar="حفل توزيع الجوائز"
                                />
                            }
                            videoTitle={
                                edition?.edition_label?.en
                                    ? `${edition.edition_label.en} — ceremony`
                                    : 'Awards ceremony'
                            }
                            embedUrl={ceremonyEmbed}
                            mode="replay"
                        />
                    </div>
                ) : null}

                <nav
                    className="mt-8 flex flex-wrap gap-2 text-sm font-semibold text-beta-blue"
                    aria-label="Edition sections"
                >
                    {ceremonyEmbed ? (
                        <>
                            <a href="#ceremony" className="hover:underline">
                                <TransText
                                    en="Ceremony"
                                    fr="Cérémonie"
                                    ar="الحفل"
                                />
                            </a>
                            <span className="text-tgray">·</span>
                        </>
                    ) : null}
                    <a href="#winners" className="hover:underline">
                        <TransText en="Winners" fr="Lauréats" ar="الفائزون" />
                    </a>
                    <span className="text-tgray">·</span>
                    <a href="#jury" className="hover:underline">
                        <TransText en="Jury" fr="Jury" ar="لجنة التحكيم" />
                    </a>
                    <span className="text-tgray">·</span>
                    <a href="#gallery" className="hover:underline">
                        <TransText en="Gallery" fr="Galerie" ar="المعرض" />
                    </a>
                </nav>

                <div id="winners">
                    <TililaPeopleGrid
                        title={
                            <TransText
                                en="Winners"
                                fr="Lauréats"
                                ar="الفائزون"
                            />
                        }
                        people={winners}
                        showTrophy
                    />
                </div>
                <div id="jury">
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
                <div id="gallery">
                    <GalleryGrid images={images} />
                </div>
            </section>
        </>
    );
}

TililaEditionDetails.layout = (page) => <AppLayout>{page}</AppLayout>;
