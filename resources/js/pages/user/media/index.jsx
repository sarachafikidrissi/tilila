import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/contexts/TranslationContext';

import MediaTabs from '@/pages/user/media/partials/MediaTabs';
import MediaCard from '@/pages/user/media/partials/MediaCard';
import SidebarNewsletter from '@/pages/user/media/partials/SidebarNewsletter';
import SidebarTrendingTopics from '@/pages/user/media/partials/SidebarTrendingTopics';
import SidebarExpertSpotlight from '@/pages/user/media/partials/SidebarExpertSpotlight';
import SidebarResources from '@/pages/user/media/partials/SidebarResources';

const TABS = [
    { id: 'all' },
    { id: 'interviews' },
    { id: 'tililaReplay' },
    { id: 'impactReports' },
    { id: 'diversityInsights' },
    { id: 'expertProfiles' },
];

export default function MediaIndex({ items: allItems = [], sidebar = null }) {
    const { locale, t } = useTranslation();
    const [activeTabId, setActiveTabId] = useState('all');

    const items = useMemo(() => {
        if (activeTabId === 'all') return allItems;
        return allItems.filter((x) => x.categoryId === activeTabId);
    }, [activeTabId, allItems]);

    return (
        <>
            <Head title={t('media.headTitle')} />

            <div>
                <div className="bg-twhite py-10">
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            <div className="lg:col-span-8">
                                <MediaTabs
                                    tabs={TABS}
                                    activeTabId={activeTabId}
                                    setActiveTabId={setActiveTabId}
                                />

                                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {items.map((item) => (
                                        <MediaCard
                                            key={item.id}
                                            item={item}
                                            locale={locale}
                                        />
                                    ))}
                                </div>

                                <div className="mt-10 flex justify-center">
                                    <button
                                        type="button"
                                        className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground shadow-sm hover:text-foreground"
                                    >
                                        {t('media.actions.loadMore')}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6 lg:col-span-4">
                                <SidebarNewsletter />
                                <SidebarTrendingTopics
                                    topics={sidebar?.trendingTopics}
                                />
                                <SidebarExpertSpotlight
                                    expertSpotlight={
                                        sidebar?.expertSpotlight ?? null
                                    }
                                />
                                <SidebarResources
                                    links={sidebar?.resourceLinks}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

MediaIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
