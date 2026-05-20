import React from 'react';
import { Head } from '@inertiajs/react';
import ImpactStats from '@/pages/home/Partials/ImpactStats';
import PillarTiles from '@/pages/home/Partials/PillarTiles';
import FeaturedExperts from '@/pages/home/Partials/FeaturedExperts';
import LatestMedia from '@/pages/home/Partials/LatestMedia';
import QuickAgenda from '@/pages/home/Partials/QuickAgenda';
import { useTranslation } from '@/contexts/TranslationContext';

export default function HomeIndex({
    canRegister = true,
    stats = null,
    featuredExperts = [],
    latestMedia = [],
    quickAgenda = [],
}) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('home.headTitle')}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800"
                    rel="stylesheet"
                />
            </Head>

            <QuickAgenda items={quickAgenda} />
            <ImpactStats stats={stats} />
            <PillarTiles />
            <FeaturedExperts items={featuredExperts} />
            <LatestMedia items={latestMedia} />

            <div
                className="sr-only"
                data-can-register={canRegister ? '1' : '0'}
            />
        </>
    );
}
