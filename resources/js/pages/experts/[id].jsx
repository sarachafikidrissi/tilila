import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ProfileSidebar from '@/pages/experts/Partials/Details/ProfileSidebar';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';
import { Languages, Lightbulb, MapPin, UserRound } from 'lucide-react';
import {
    buildCountryOptions,
    buildLanguageOptions,
} from '@/components/helpers/expert-form-options';

export default function ExpertDetails({
    expert,
    details: detailsProp,
    contactPurposes = [],
}) {
    const { locale, t } = useTranslation();
    const flash = usePage().props?.flash ?? {};
    const details = detailsProp ?? {};

    const resolvedName =
        locale === 'ar'
            ? expert?.name?.ar
            : locale === 'fr'
              ? expert?.name?.fr
              : expert?.name?.en;

    const resolveTri = (value) => {
        if (!value || typeof value !== 'object') {
            return '';
        }
        return (
            (locale === 'ar'
                ? value.ar
                : locale === 'fr'
                  ? value.fr
                  : value.en) ||
            value.en ||
            value.fr ||
            value.ar ||
            ''
        );
    };

    const cityLabel = resolveTri(expert?.city_i18n);
    const countryLabel =
        buildCountryOptions(locale).find(
            (option) => option.value === expert?.country,
        )?.label ||
        expert?.country ||
        '';

    const languageLabels = (expert?.languages ?? [])
        .map(
            (languageCode) =>
                buildLanguageOptions(locale).find(
                    (option) => option.value === languageCode,
                )?.label,
        )
        .filter(Boolean);

    const bioBlocks = Array.isArray(details?.bio) ? details.bio : [];
    const expertiseItems = Array.isArray(details?.expertise)
        ? details.expertise
        : [];

    return (
        <>
            <Head
                title={resolvedName ?? t('experts.detail.fallbackHeadTitle')}
            />

            <div className="bg-[linear-gradient(180deg,#f8fcff_0%,#ffffff_22%,#ffffff_100%)]">
                <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Link
                            href="/"
                            className="hover:text-foreground hover:underline"
                        >
                            {t('nav.home')}
                        </Link>
                        <span aria-hidden="true">›</span>
                        <Link
                            href="/experts"
                            className="hover:text-foreground hover:underline"
                        >
                            {t('nav.experts')}
                        </Link>
                        <span aria-hidden="true">›</span>
                        <span className="font-semibold text-foreground">
                            {resolvedName}
                        </span>
                    </nav>

                    {flash.success ? (
                        <p
                            role="status"
                            className="mt-4 rounded-lg border border-beta-blue/30 bg-beta-blue/5 px-4 py-3 text-sm font-medium text-foreground"
                        >
                            {flash.success}
                        </p>
                    ) : null}

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-4">
                            <ProfileSidebar
                                expert={expert}
                                details={details}
                                contactPurposes={contactPurposes}
                            />
                        </div>

                        <div className="space-y-6 lg:col-span-8">
                            <section className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-beta-blue/10 text-beta-blue">
                                            <MapPin className="size-4" />
                                        </span>
                                        <TransText
                                            en="Location"
                                            fr="Localisation"
                                            ar="الموقع"
                                        />
                                    </div>
                                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                                        <div className="font-semibold text-foreground">
                                            {cityLabel || '—'}
                                        </div>
                                        <div>{countryLabel || '—'}</div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-beta-green/20 text-alpha-green">
                                            <Languages className="size-4" />
                                        </span>
                                        <TransText
                                            en="Languages"
                                            fr="Langues"
                                            ar="اللغات"
                                        />
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                        {languageLabels.length ? (
                                            languageLabels.map((label) => (
                                                <span
                                                    key={label}
                                                    className="rounded-full border border-border bg-background px-2.5 py-1 text-muted-foreground"
                                                >
                                                    {label}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-alpha-blue/10 text-beta-blue">
                                        <UserRound className="size-4" />
                                    </span>
                                    <h2 className="text-base font-extrabold text-foreground">
                                        <TransText
                                            en="Biography"
                                            fr="Biographie"
                                            ar="السيرة الذاتية"
                                        />
                                    </h2>
                                </div>
                                <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                                    {bioBlocks.length ? (
                                        bioBlocks.map((block, index) => (
                                            <p key={index}>
                                                <TransText
                                                    en={block?.en ?? ''}
                                                    fr={block?.fr ?? ''}
                                                    ar={block?.ar ?? ''}
                                                />
                                            </p>
                                        ))
                                    ) : (
                                        <p>
                                            <TransText
                                                en="No biography has been added yet."
                                                fr="Aucune biographie n’a encore été ajoutée."
                                                ar="لم تتم إضافة سيرة ذاتية بعد."
                                            />
                                        </p>
                                    )}
                                </div>
                            </section>

                            <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-beta-blue/10 text-beta-blue">
                                        <Lightbulb className="size-4" />
                                    </span>
                                    <h2 className="text-base font-extrabold text-foreground">
                                        <TransText
                                            en="Areas of Expertise"
                                            fr="Domaines d’expertise"
                                            ar="مجالات الخبرة"
                                        />
                                    </h2>
                                </div>
                                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {expertiseItems.length === 0 ? (
                                        <p className="text-sm text-muted-foreground md:col-span-2">
                                            <TransText
                                                en="No areas of expertise have been listed yet."
                                                fr="Aucun domaine d’expertise n’a encore été renseigné."
                                                ar="لم يتم إدراج مجالات الخبرة بعد."
                                            />
                                        </p>
                                    ) : null}
                                    {expertiseItems.map((item, index) => (
                                        <div
                                            key={`${index}-${item?.title?.en ?? ''}`}
                                            className="rounded-xl bg-background p-4 ring-1 ring-border"
                                        >
                                            <TransText
                                                className="text-sm font-extrabold text-foreground"
                                                en={item?.title?.en ?? ''}
                                                fr={item?.title?.fr ?? ''}
                                                ar={item?.title?.ar ?? ''}
                                                as="p"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ExpertDetails.layout = (page) => <AppLayout>{page}</AppLayout>;
