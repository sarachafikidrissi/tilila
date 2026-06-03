import {
    ChevronLeft,
    ChevronRight,
    GalleryHorizontal,
    Gavel,
    Trophy,
} from 'lucide-react';
import TransText from '@/components/TransText';
import { router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { normalizeEdition } from '@/pages/user/tilila/utils/editions';

export default function ArchiveSection({ editions = [] }) {
    const rows = useMemo(() => {
        return Array.isArray(editions)
            ? editions.map(normalizeEdition).filter(Boolean)
            : [];
    }, [editions]);

    const trackRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const [paused, setPaused] = useState(false);
    const lastInteractionAtRef = useRef(0);
    const autoTimerRef = useRef(null);

    const updateNavState = () => {
        const el = trackRef.current;
        if (!el) return;
        if (rows.length <= 1) {
            setCanPrev(false);
            setCanNext(false);
            return;
        }
        // We support looping, so buttons should generally stay enabled.
        setCanPrev(true);
        setCanNext(true);

        const max = el.scrollWidth - el.clientWidth;
        const x = el.scrollLeft;
        // Keep state updated for accessibility (but don't disable with loop UX).
        void max;
        void x;
    };

    useEffect(() => {
        updateNavState();
        const el = trackRef.current;
        if (!el) return;
        const onScroll = () => updateNavState();
        el.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateNavState, { passive: true });
        return () => {
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateNavState);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows.length]);

    const scrollBySlides = (dir) => {
        const el = trackRef.current;
        if (!el) return;
        const w = el.clientWidth;
        el.scrollBy({
            left: dir * Math.max(240, Math.floor(w * 0.92)),
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
        const step = Math.max(240, Math.floor(w * 0.92));

        if (max <= 0) return;

        // Loop: if we're near the end, go back to start.
        if (x >= max - 8) {
            scrollToStart();
            return;
        }

        el.scrollBy({ left: step, behavior: 'smooth' });
    };

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        // Respect reduced motion.
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
            const now = Date.now();
            // small grace period after user interaction
            if (now - (lastInteractionAtRef.current || 0) < 3500) return;
            autoAdvance();
        }, 4500);

        return () => {
            if (autoTimerRef.current) {
                clearInterval(autoTimerRef.current);
                autoTimerRef.current = null;
            }
        };
    }, [paused, rows.length]);

    return (
        <section
            id="archive"
            className="mx-auto max-w-7xl border-t border-border/50 px-4 pt-14 pb-12 sm:px-6 lg:px-8"
        >
            <div className="text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-tblack sm:text-4xl">
                    <TransText
                        en="Archive of Editions"
                        fr="Archives des éditions"
                        ar="أرشيف الدورات"
                    />
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-tgray">
                    <TransText
                        en="Open each edition below for galleries, jury, and more detail. The timeline above summarises all seven ceremonies, themes, and main laureates."
                        fr="Ouvrez chaque édition ci-dessous pour galeries, jury et détails. La frise plus haut résume les sept cérémonies, thèmes et lauréats principaux."
                        ar="افتحوا كل دورة أدناه للمعرض ولجنة التحكيم والمزيد. الخط الزمني أعلاه يلخّص الدورات السبع والمواضيع والفائزين الرئيسيين."
                    />
                </p>
            </div>

            <div className="mt-10 rounded-3xl border border-border/60 bg-white/70 p-4 shadow-sm backdrop-blur sm:p-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold text-tblack">
                        <TransText en="Editions" fr="Éditions" ar="الدورات" />
                    </div>
                    <div className="flex items-center gap-2">
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
                            disabled={!canPrev}
                            className={[
                                'inline-flex items-center justify-center rounded-full border border-border bg-background/80 p-2 text-tblack shadow-sm transition-colors hover:bg-secondary',
                                !canPrev ? 'cursor-not-allowed opacity-40' : '',
                            ].join(' ')}
                            aria-label="Previous editions"
                        >
                            <ChevronLeft className="size-4" />
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
                                        el.scrollTo({
                                            left: 0,
                                            behavior: 'smooth',
                                        });
                                        return;
                                    }
                                }
                                scrollBySlides(1);
                            }}
                            disabled={!canNext}
                            className={[
                                'inline-flex items-center justify-center rounded-full border border-border bg-background/80 p-2 text-tblack shadow-sm transition-colors hover:bg-secondary',
                                !canNext ? 'cursor-not-allowed opacity-40' : '',
                            ].join(' ')}
                            aria-label="Next editions"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>

                <div className="relative mt-4">
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-white/90 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-white/90 to-transparent" />
                    <div
                        ref={trackRef}
                        onPointerDown={() => {
                            lastInteractionAtRef.current = Date.now();
                        }}
                        onWheel={() => {
                            lastInteractionAtRef.current = Date.now();
                        }}
                        onKeyDown={() => {
                            lastInteractionAtRef.current = Date.now();
                        }}
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                        onFocusCapture={() => setPaused(true)}
                        onBlurCapture={() => setPaused(false)}
                        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pr-2 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        aria-label="Tilila editions carousel"
                    >
                        {rows.map((edition) => (
                            <div
                                key={edition.id}
                                className="w-[88%] shrink-0 snap-start sm:w-[70%] md:w-[48%] lg:w-[32%]"
                            >
                                <div
                                    role="link"
                                    tabIndex={0}
                                    onClick={() =>
                                        router.visit(edition.details_url)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === 'Enter' ||
                                            e.key === ' '
                                        ) {
                                            e.preventDefault();
                                            router.visit(edition.details_url);
                                        }
                                    }}
                                    className="group flex h-[440px] cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-beta-blue/50 sm:h-[350px]"
                                    aria-label={`Edition ${edition.year}`}
                                >
                                    <div className="relative h-[240px] bg-muted sm:h-[260px]">
                                        {edition.cover_image_src ? (
                                            <img
                                                src={edition.cover_image_src}
                                                alt=""
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : null}
                                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0" />
                                        <div className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-tblack shadow-sm">
                                            {edition.year}
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col gap-3 px-5 py-5">
                                        <div className="min-w-0">
                                            <div className="text-base font-semibold text-tblack">
                                                <TransText
                                                    en={
                                                        edition.edition_label
                                                            ?.en ?? ''
                                                    }
                                                    fr={
                                                        edition.edition_label
                                                            ?.fr ?? ''
                                                    }
                                                    ar={
                                                        edition.edition_label
                                                            ?.ar ?? ''
                                                    }
                                                />
                                            </div>
                                            <div className="mt-1 line-clamp-2 text-sm text-tgray">
                                                <TransText
                                                    en={`Theme: “${edition.theme?.en ?? ''}”`}
                                                    fr={`Thème : « ${edition.theme?.fr ?? ''} »`}
                                                    ar={`الموضوع: « ${edition.theme?.ar ?? ''} »`}
                                                />
                                            </div>
                                        </div>

                                        {/* <div className="mt-auto flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.visit(edition.winners_url || '/tilila');
                                                }}
                                                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-tblack transition-colors hover:bg-secondary"
                                            >
                                                <Trophy className="size-3.5 text-tgray" />
                                                <TransText
                                                    en="Winners"
                                                    fr="Lauréats"
                                                    ar="الفائزون"
                                                />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.visit(edition.jury_url || '/tilila');
                                                }}
                                                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-tblack transition-colors hover:bg-secondary"
                                            >
                                                <Gavel className="size-3.5 text-tgray" />
                                                <TransText
                                                    en="Jury"
                                                    fr="Jury"
                                                    ar="لجنة التحكيم"
                                                />
                                            </button>
                                            {edition.has_gallery ? (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.visit(
                                                            edition.gallery_url || '/tilila',
                                                        );
                                                    }}
                                                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-tblack transition-colors hover:bg-secondary"
                                                >
                                                    <GalleryHorizontal className="size-3.5 text-tgray" />
                                                    <TransText
                                                        en="Gallery"
                                                        fr="Galerie"
                                                        ar="المعرض"
                                                    />
                                                </button>
                                            ) : null}
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* <div className="mt-8 flex items-center justify-center">
                    <a
                        href="/tilila"
                        className="text-sm font-semibold text-beta-blue hover:opacity-80"
                    >
                        <TransText
                            en="View older editions"
                            fr="Voir les éditions précédentes"
                            ar="عرض الدورات الأقدم"
                        />
                    </a>
                </div> */}
            </div>
        </section>
    );
}
