import React from 'react';
import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';

function TypeLabel({ type }) {
    const { t } = useTranslation();
    if (type === 'media_call') return t('opportunities.filters.mediaCall');
    if (type === 'panel_discussion')
        return t('opportunities.filters.panelDiscussion');
    if (type === 'grant') return t('opportunities.filters.grant');
    if (type === 'residency') return t('opportunities.filters.residency');
    return t('opportunities.card.fallbackType');
}

function StatusPill({ status }) {
    const { t } = useTranslation();
    const label =
        status === 'closing_soon'
            ? t('opportunities.status.closingSoon')
            : status === 'open'
              ? t('opportunities.status.open')
              : t('opportunities.status.closed');

    const className =
        status === 'closing_soon'
            ? 'bg-beta-yellow text-alpha-yellow'
            : status === 'open'
              ? 'bg-beta-green text-alpha-green'
              : 'bg-secondary text-muted-foreground';

    return (
        <span
            className={[
                'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-border',
                className,
            ].join(' ')}
        >
            <span className="h-2 w-2 rounded-full bg-current opacity-70" />
            {label}
        </span>
    );
}

export default function OpportunityCard({ item, basePath = '/opportunities' }) {
    const { locale, t } = useTranslation();

    const resolvedOrg =
        locale === 'ar'
            ? item.org?.ar
            : locale === 'fr'
              ? item.org?.fr
              : item.org?.en;
    const resolvedLocation =
        locale === 'ar'
            ? item.location?.ar
            : locale === 'fr'
              ? item.location?.fr
              : item.location?.en;

    return (
        <article className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-alpha-blue text-beta-blue ring-1 ring-border">
                    <span className="text-lg font-extrabold">◎</span>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                            <TypeLabel type={item.type} />
                        </span>
                        <StatusPill status={item.status} />
                        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                            <span aria-hidden="true">🗓</span>
                            <span>
                                <TransText
                                    en="Deadline:"
                                    fr="Date limite :"
                                    ar="آخر أجل:"
                                />{' '}
                                {item.deadlineLabel}
                            </span>
                        </div>
                    </div>

                    <h3 className="mt-2 text-base font-extrabold text-foreground">
                        <TransText
                            en={item.title?.en}
                            fr={item.title?.fr}
                            ar={item.title?.ar}
                        />
                    </h3>

                    <div className="mt-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground/80">
                            {resolvedOrg}
                        </span>{' '}
                        • {resolvedLocation}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        <TransText
                            en={item.excerpt?.en}
                            fr={item.excerpt?.fr}
                            ar={item.excerpt?.ar}
                        />
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <span>
                                <TransText en="Posted" fr="Publié" ar="نُشر" />{' '}
                                {locale === 'ar'
                                    ? item.posted?.ar
                                    : locale === 'fr'
                                      ? item.posted?.fr
                                      : item.posted?.en}
                            </span>
                            <span>
                                👁 {item.views}{' '}
                                <TransText en="views" fr="vues" ar="مشاهدة" />
                            </span>
                        </div>
                        <Link
                            href={`${basePath.replace(/\/$/, '')}/${item.id}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-beta-blue hover:underline"
                        >
                            <TransText
                                en="Apply Now"
                                fr="Postuler"
                                ar="قدّم الآن"
                            />{' '}
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
