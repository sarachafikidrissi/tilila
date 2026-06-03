import { ChevronLeft, ChevronRight } from 'lucide-react';
import TransText from '@/components/TransText';
import { router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { TILILA_EDITIONS_HISTORY } from '@/pages/user/tilila/data/tilila-editions-history';
import {
    editionRowFromHistory,
    normalizeEdition,
} from '@/pages/user/tilila/utils/editions';

function hasThemeText(theme) {
    if (!theme || typeof theme !== 'object') return false;
    return Boolean(theme.en || theme.fr || theme.ar);
}

function openEdition(edition) {
    if (edition.details_url.includes('#')) {
        window.location.assign(edition.details_url);
        return;
    }
    router.visit(edition.details_url);
}

export default function TililaPastEditionsCarousel({
    editions = [],
    excludeEditionId = null,
    excludeYear = null,
}) {
    const rows = useMemo(() => {
        const shouldExclude = (edition) => {
            if (!edition) return true;
            if (edition.is_current) return true;
            if (
                excludeEditionId != null &&
                String(edition.id) === String(excludeEditionId)
            ) {
                return true;
            }
            if (
                excludeYear != null &&
                String(edition.year) === String(excludeYear)
            ) {
                return true;
            }
            return false;
        };

        const fromApi = Array.isArray(editions)
            ? editions
                  .map(normalizeEdition)
                  .filter((edition) => edition && !shouldExclude(edition))
            : [];
        if (fromApi.length > 0) {
            return [...fromApi].sort((a, b) => Number(b.year) - Number(a.year));
        }
        return [...TILILA_EDITIONS_HISTORY]
            .map(editionRowFromHistory)
            .filter((edition) => !shouldExclude(edition))
            .sort((a, b) => Number(b.year) - Number(a.year));
    }, [editions, excludeEditionId, excludeYear]);

    const trackRef = useRef(null);
    const [paused, setPaused] = useState(false);
    const lastInteractionAtRef = useRef(0);
    const autoTimerRef = useRef(null);

    const scrollBySlides = (dir) => {
        const el = trackRef.current;
        if (!el) return;
        const w = el.clientWidth;
        el.scrollBy({
            left: dir * Math.max(260, Math.floor(w * 0.88)),
            behavior: 'smooth',
        });
    };

    const scrollToStart = () => {
        const el = trackRef.current;
        if (!el) return;
        el.scrollTo({ left: 0, behavior: 'smooth' });
    };

    const autoAdvance = () => {
        const el = trackRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        const x = el.scrollLeft;
        const w = el.clientWidth;
        const step = Math.max(260, Math.floor(w * 0.88));
        if (max <= 0) return;
        if (x >= max - 8) {
            scrollToStart();
            return;
        }
        el.scrollBy({ left: step, behavior: 'smooth' });
    };

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

        if (prefersReducedMotion || paused || rows.length <= 1) {
            if (autoTimerRef.current) {
                clearInterval(autoTimerRef.current);
                autoTimerRef.current = null;
            }
            return;
        }

        if (autoTimerRef.current) clearInterval(autoTimerRef.current);
        autoTimerRef.current = setInterval(() => {
            if (Date.now() - (lastInteractionAtRef.current || 0) < 3500) return;
            autoAdvance();
        }, 4200);

        return () => {
            if (autoTimerRef.current) {
                clearInterval(autoTimerRef.current);
                autoTimerRef.current = null;
            }
        };
    }, [paused, rows.length]);

    if (rows.length === 0) return null;

    return (
        <section
            id="past-editions"
            className="border-b border-border bg-linear-to-b from-muted/50 to-background py-14 sm:py-16"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-beta-blue uppercase">
                            <TransText
                                en="Past editions"
                                fr="Éditions passées"
                                ar="دورات سابقة"
                            />
                        </p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            <TransText
                                en="Swipe through Tilila years"
                                fr="Parcourez les années Tilila"
                                ar="تصفح سنوات تيليلا"
                            />
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                            <TransText
                                en="Each card links to the edition hub (or the full timeline when using the public recap)."
                                fr="Chaque carte mène vers la fiche édition (ou la frise récapitulative en mode public)."
                                ar="كل بطاقة تفتح صفحة الدورة (أو الخط الزمني في الوضع العام)."
                            />
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                lastInteractionAtRef.current = Date.now();
                                const el = trackRef.current;
                                if (el) {
                                    const max = el.scrollWidth - el.clientWidth;
                                    const x = el.scrollLeft;
                                    if (x <= 8 && max > 0) {
                                        el.scrollTo({
                                            left: max,
                                            behavior: 'smooth',
                                        });
                                        return;
                                    }
                                }
                                scrollBySlides(-1);
                            }}
                            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-muted"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                lastInteractionAtRef.current = Date.now();
                                const el = trackRef.current;
                                if (el) {
                                    const max = el.scrollWidth - el.clientWidth;
                                    const x = el.scrollLeft;
                                    if (x >= max - 8 && max > 0) {
                                        scrollToStart();
                                        return;
                                    }
                                }
                                scrollBySlides(1);
                            }}
                            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-muted"
                            aria-label="Next"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>

                <div className="relative mt-8">
                    <div className="bg-linear-to-e pointer-events-none absolute inset-y-0 start-0 z-10 w-10 from-background to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-10 bg-linear-to-l from-background to-transparent" />
                    <div
                        ref={trackRef}
                        onPointerDown={() => {
                            lastInteractionAtRef.current = Date.now();
                        }}
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                        onFocusCapture={() => setPaused(true)}
                        onBlurCapture={() => setPaused(false)}
                        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        aria-label="Past Tilila editions"
                    >
                        {rows.map((edition) => (
                            <div
                                key={edition.id}
                                className="w-[85%] shrink-0 snap-start sm:w-[55%] md:w-[40%] lg:w-[32%]"
                            >
                                <button
                                    type="button"
                                    onClick={() => openEdition(edition)}
                                    className="group flex h-full min-h-[380px] w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-start shadow-md ring-1 ring-border/40 transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-beta-blue/50"
                                >
                                    <div className="relative aspect-[16/11] w-full shrink-0 bg-muted">
                                        {edition.cover_image_src ? (
                                            <img
                                                src={edition.cover_image_src}
                                                alt=""
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-linear-to-br from-tblack to-tblack/80 text-sm text-twhite/60">
                                                <TransText
                                                    en="Tilila"
                                                    fr="Tilila"
                                                    ar="تيليلا"
                                                />
                                            </div>
                                        )}
                                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-tblack/60 via-transparent to-transparent" />
                                        <div className="absolute start-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-tblack shadow-sm ring-1 ring-border/60">
                                            {edition.year}
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="text-base font-bold text-foreground">
                                            <TransText
                                                en={
                                                    edition.edition_label?.en ??
                                                    ''
                                                }
                                                fr={
                                                    edition.edition_label?.fr ??
                                                    ''
                                                }
                                                ar={
                                                    edition.edition_label?.ar ??
                                                    ''
                                                }
                                            />
                                        </div>
                                        {hasThemeText(edition.theme) ? (
                                            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                                <TransText
                                                    en={edition.theme.en}
                                                    fr={edition.theme.fr}
                                                    ar={edition.theme.ar}
                                                />
                                            </p>
                                        ) : null}
                                        <span className="mt-auto pt-4 text-sm font-semibold text-beta-blue">
                                            <TransText
                                                en="Open edition →"
                                                fr="Ouvrir l’édition →"
                                                ar="افتح الدورة →"
                                            />
                                        </span>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
