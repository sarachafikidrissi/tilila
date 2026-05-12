import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';
import { show } from '@/routes/experts';

export default function ExpertCard({ expert, view = 'grid' }) {
    const { locale, t } = useTranslation();
    const imageSrc = expert.image ?? expert.image_url ?? null;
    const cityLabel =
        locale === 'ar'
            ? expert.city_i18n?.ar
            : locale === 'fr'
              ? expert.city_i18n?.fr
              : expert.city_i18n?.en;
    const displayCity =
        cityLabel ||
        expert.city_i18n?.en ||
        expert.city_i18n?.fr ||
        expert.city_i18n?.ar ||
        '';

    return (
        <div className="rounded-2xl bg-card- shadow-sm ring-1 ring-border">
            <div className="relative">
                <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-muted-">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={expert.name?.en ?? ''}
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                                e.target.src = null;
                            }}

                        />
                    ) : null}
                </div>

            </div>

            <div className="p-5">
                <div className="text-base font-extrabold text-foreground">

                    <TransText
                        {...expert.name}
                    />
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                    <TransText
                        en={expert.title?.en ?? ''}
                        fr={expert.title?.fr ?? ''}
                        ar={expert.title?.ar ?? ''}
                    />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {(expert.tags ?? []).slice(0, 2).map((tag) => (
                        <span
                            key={tag.en}
                            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground"
                        >
                            <TransText en={tag.en} fr={tag.fr} ar={tag.ar} />
                        </span>
                    ))}
                    {(expert.tags ?? []).length > 2 ? (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                            +{(expert.tags ?? []).length - 2}
                        </span>
                    ) : null}
                </div>

                <div
                    className={[
                        'mt-4 flex items-center justify-between gap-3',
                        view === 'list' ? 'flex-row' : 'flex-row',
                    ].join(' ')}
                >
                    <div className="text-xs text-muted-foreground">
                        {displayCity}
                    </div>
                    <Link
                        href={show.url(expert.id)}
                        className="text-sm font-semibold text-beta-blue hover:underline"
                    >
                        {t('experts.actions.viewProfile')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
