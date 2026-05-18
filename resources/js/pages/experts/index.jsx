import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import FiltersBar from '@/pages/experts/Partials/FiltersBar';
import ExpertOfMonthSection from '@/pages/experts/Partials/ExpertOfMonthSection';
import FeaturedExperts from '@/pages/experts/Partials/FeaturedExperts';
import ExpertCard from '@/pages/experts/Partials/ExpertCard';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';
import {
    buildCountryOptions,
    buildLanguageOptions,
} from '@/components/helpers/expert-form-options';

export default function ExpertsIndex({
    experts: expertsProp = [],
    featuredExperts = [],
    expertOfMonth = null,
}) {
    const { locale, t } = useTranslation();
    const [regionQuick, setRegionQuick] = useState('all');
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('relevance');
    const [view, setView] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        country: 'all',
        location: 'all',
        language: 'all',
    });

    const countryOptions = useMemo(() => buildCountryOptions(locale), [locale]);
    const languageOptions = useMemo(
        () => buildLanguageOptions(locale),
        [locale],
    );

    const getCityLabel = (expert) => {
        if (!expert) {
            return '';
        }

        const cityByLocale =
            locale === 'ar'
                ? expert.city_i18n?.ar
                : locale === 'fr'
                  ? expert.city_i18n?.fr
                  : expert.city_i18n?.en;

        return (
            cityByLocale ||
            expert.city_i18n?.en ||
            expert.city_i18n?.fr ||
            expert.city_i18n?.ar ||
            ''
        );
    };

    const locationOptions = useMemo(
        () =>
            Array.from(
                new Set(
                    (expertsProp ?? [])
                        .map((item) => getCityLabel(item))
                        .filter(Boolean),
                ),
            ).sort((a, b) => a.localeCompare(b)),
        [expertsProp, locale],
    );

    const filterLabels = useMemo(
        () => ({
            country: countryOptions.reduce((accumulator, option) => {
                accumulator[option.value] = option.label;
                return accumulator;
            }, {}),
            location: locationOptions.reduce((accumulator, value) => {
                accumulator[value] = value;
                return accumulator;
            }, {}),
            language: languageOptions.reduce((accumulator, option) => {
                accumulator[option.value] = option.label;
                return accumulator;
            }, {}),
        }),
        [countryOptions, languageOptions, locationOptions],
    );

    const activeFilters = useMemo(() => {
        const items = [];

        if (filters.country !== 'all') {
            items.push({
                key: 'country',
                label: filterLabels.country[filters.country] ?? filters.country,
            });
        }

        if (filters.location !== 'all') {
            items.push({
                key: 'location',
                label:
                    filterLabels.location[filters.location] ?? filters.location,
            });
        }

        if (filters.language !== 'all') {
            items.push({
                key: 'language',
                label:
                    filterLabels.language[filters.language] ?? filters.language,
            });
        }

        return items;
    }, [filterLabels, filters]);

    const experts = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = expertsProp;

        if (filters.country !== 'all') {
            list = list.filter((expert) => expert.country === filters.country);
        }

        if (filters.location !== 'all') {
            const selectedLocation = filters.location.trim().toLowerCase();
            list = list.filter(
                (expert) =>
                    String(getCityLabel(expert)).trim().toLowerCase() ===
                    selectedLocation,
            );
        }

        if (regionQuick === 'morocco') {
            list = list.filter(
                (e) =>
                    e.region_scope === 'morocco' || e.country === 'Morocco',
            );
        } else if (regionQuick === 'africa') {
            list = list.filter(
                (e) =>
                    e.region_scope === 'africa' ||
                    (e.country && AFRICA_COUNTRY_LABELS.has(e.country)),
            );
        } else if (regionQuick === 'diaspora') {
            list = list.filter((e) => e.region_scope === 'diaspora');
        }

        if (filters.language !== 'all') {
            list = list.filter((expert) =>
                (expert.languages ?? []).includes(filters.language),
            );
        }

        if (q) {
            const withScore = list
                .map((expert, index) => {
                    const nameEn = (expert.name?.en ?? '').toLowerCase();
                    const nameFr = (expert.name?.fr ?? '').toLowerCase();
                    const nameAr = (expert.name?.ar ?? '').toLowerCase();
                    const title = (expert.title?.en ?? '').toLowerCase();
                    const tags = (expert.tags ?? [])
                        .map((tag) => tag.en)
                        .join(' ')
                        .toLowerCase();
                    const location = getCityLabel(expert).toLowerCase();
                    const haystack = [
                        nameEn,
                        nameFr,
                        nameAr,
                        title,
                        tags,
                        location,
                    ].join(' ');

                    if (!haystack.includes(q)) {
                        return null;
                    }

                    let score = 0;
                    if (nameEn.startsWith(q)) score += 100;
                    if (nameEn.includes(q)) score += 50;
                    if (title.includes(q)) score += 25;
                    if (tags.includes(q)) score += 15;
                    if (location.includes(q)) score += 10;
                    score -= index / 1000;

                    return { expert, score };
                })
                .filter(Boolean);

            list = withScore.map((item) => item.expert);

            if (sort === 'relevance') {
                list = [...withScore]
                    .sort((a, b) => b.score - a.score)
                    .map((item) => item.expert);
            }
        }

        if (sort === 'name_asc') {
            list = [...list].sort((a, b) => {
                const aName =
                    locale === 'ar'
                        ? a.name?.ar
                        : locale === 'fr'
                          ? a.name?.fr
                          : a.name?.en;
                const bName =
                    locale === 'ar'
                        ? b.name?.ar
                        : locale === 'fr'
                          ? b.name?.fr
                          : b.name?.en;
                return (aName ?? '').localeCompare(bName ?? '');
            });
        } else if (sort === 'name_desc') {
            list = [...list].sort((a, b) => {
                const aName =
                    locale === 'ar'
                        ? a.name?.ar
                        : locale === 'fr'
                          ? a.name?.fr
                          : a.name?.en;
                const bName =
                    locale === 'ar'
                        ? b.name?.ar
                        : locale === 'fr'
                          ? b.name?.fr
                          : b.name?.en;
                return (bName ?? '').localeCompare(aName ?? '');
            });
        }

        return list;
    }, [
        filters.country,
        filters.language,
        filters.location,
        locale,
        query,
        regionQuick,
        sort,
        expertsProp,
    ]);

    const itemsPerPage = 8;
    const totalPages = Math.max(1, Math.ceil(experts.length / itemsPerPage));

    useEffect(() => {
        setCurrentPage(1);
    }, [query, sort, filters]);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    const paginatedExperts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return experts.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, experts]);

    const paginationButtons = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        const buttons = [1];
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) {
            buttons.push('ellipsis-start');
        }

        for (let page = start; page <= end; page += 1) {
            buttons.push(page);
        }

        if (end < totalPages - 1) {
            buttons.push('ellipsis-end');
        }

        buttons.push(totalPages);

        return buttons;
    }, [currentPage, totalPages]);

    return (
        <>
            <Head title={t('experts.headTitle')} />

            <div>
                <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(0,151,170,0.12)_0%,rgba(246,247,248,1)_55%)] py-14 sm:py-20">
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <header className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
                            <div>
                                <TransText
                                    tag="h1"
                                    className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl"
                                    en="Find an Expert"
                                    fr="Trouver une experte"
                                    ar="اعثر على خبيرة"
                                />
                                <TransText
                                    tag="p"
                                    className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base"
                                    en="Discover and connect with leading women experts across Morocco and Africa."
                                    fr="Decouvrez et contactez des expertes de premier plan au Maroc et en Afrique."
                                    ar="اكتشف وتواصل مع خبيرات رائدات في المغرب وإفريقيا."
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href="/experts/become"
                                    className="inline-flex items-center rounded-full bg-beta-blue px-6 py-3 text-sm font-semibold text-twhite transition hover:bg-beta-blue/90"
                                >
                                    <TransText
                                        en="Become an Expert"
                                        fr="Devenir experte"
                                        ar="أصبحي خبيرة"
                                    />
                                </Link>
                                <a
                                    href="#experts-directory"
                                    className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                                >
                                    <TransText
                                        en="Explore the directory"
                                        fr="Explorer l'annuaire"
                                        ar="استكشاف الدليل"
                                    />
                                </a>
                            </div>
                        </header>
                    </div>
                </div>

                <ExpertOfMonthSection entry={expertOfMonth} />
                <FeaturedExperts experts={featuredExperts} />

                <div
                    id="experts-directory"
                    className="scroll-mt-16 bg-twhite py-12"
                >
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <FiltersBar
                            advancedOnly
                            locationOptions={locationOptions}
                            countryOptions={countryOptions}
                            languageOptions={languageOptions}
                            query={query}
                            setQuery={setQuery}
                            filters={filters}
                            setFilters={setFilters}
                            sort={sort}
                            setSort={setSort}
                            view={view}
                            setView={setView}
                        />

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    <TransText
                                        en={`${experts.length} results`}
                                        fr={`${experts.length} resultats`}
                                        ar={`${experts.length} نتيجة`}
                                    />
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {activeFilters.length > 0 ? (
                                    activeFilters.map((item) => (
                                        <span
                                            key={item.key}
                                            className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground"
                                        >
                                            {item.label}
                                        </span>
                                    ))
                                ) : (
                                    <span>
                                        <TransText
                                            en="None"
                                            fr="Aucun"
                                            ar="لا شيء"
                                        />
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 flex items-center justify-between text-sm">
                            <div className="text-muted-foreground">
                                <TransText
                                    en={`Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, experts.length)} of ${experts.length} experts`}
                                    fr={`Affichage de ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, experts.length)} sur ${experts.length} expertes`}
                                    ar={`عرض ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, experts.length)} من ${experts.length} خبيرات`}
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            {experts.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-border/80 bg-card p-10 text-center">
                                    <p className="text-base font-semibold text-tblack">
                                        No experts match your filters.
                                    </p>
                                    <p className="mt-2 text-sm text-tgray">
                                        Try removing a filter or changing your
                                        search query.
                                    </p>
                                </div>
                            ) : (
                                <div
                                    className={
                                        view === 'grid'
                                            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
                                            : 'grid grid-cols-1 gap-4'
                                    }
                                >
                                    {paginatedExperts.map((expert) => (
                                        <ExpertCard
                                            key={expert.id}
                                            expert={expert}
                                            view={view}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {totalPages > 1 ? (
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.max(1, page - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="rounded-md border border-border bg-card px-3 py-2 font-semibold text-muted-foreground shadow-sm hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <TransText
                                        en="Previous"
                                        fr="Précédent"
                                        ar="السابق"
                                    />
                                </button>

                                {paginationButtons.map((item) =>
                                    typeof item === 'number' ? (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setCurrentPage(item)}
                                            className={[
                                                'rounded-md border px-3 py-2 font-semibold shadow-sm',
                                                item === currentPage
                                                    ? 'border-beta-blue bg-beta-blue text-twhite'
                                                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                                            ].join(' ')}
                                        >
                                            {item}
                                        </button>
                                    ) : (
                                        <span
                                            key={item}
                                            className="px-2 text-muted-foreground"
                                        >
                                            …
                                        </span>
                                    ),
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(totalPages, page + 1),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="rounded-md border border-border bg-card px-3 py-2 font-semibold text-muted-foreground shadow-sm hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <TransText
                                        en="Next"
                                        fr="Suivant"
                                        ar="التالي"
                                    />
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}

ExpertsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
