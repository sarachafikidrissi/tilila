import { Head, usePage } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';

import NewsletterComposeForm from './partials/NewsletterComposeForm';
import NewsletterPageHeader from './partials/NewsletterPageHeader';
import NewsletterStatsCards from './partials/NewsletterStatsCards';
import NewsletterSubscribersTable from './partials/NewsletterSubscribersTable';

export default function AdminNewsletterIndex({
    subscribers,
    filters,
    stats,
    localeOptions = [],
}) {
    const { flash } = usePage().props;

    const exportCsv = () => {
        const params = new URLSearchParams();
        if (filters?.search?.trim()) {
            params.set('search', filters.search.trim());
        }
        if (filters?.locale) {
            params.set('locale', filters.locale);
        }
        const qs = params.toString();
        window.location.href = `/admin/newsletter/export.csv${qs ? `?${qs}` : ''}`;
    };

    return (
        <>
            <Head title="Newsletter" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <NewsletterPageHeader
                    filters={filters}
                    onExport={exportCsv}
                />

                {(flash?.success || flash?.warning) && (
                    <div
                        className={
                            flash?.warning
                                ? 'rounded-lg border border-alpha-yellow/50 bg-beta-yellow px-4 py-3 text-sm text-alpha-yellow'
                                : 'rounded-lg border border-alpha-green/40 bg-beta-green px-4 py-3 text-sm text-alpha-green'
                        }
                        role="status"
                    >
                        {flash.success ?? flash.warning}
                    </div>
                )}

                <NewsletterStatsCards stats={stats} />

                <div className="grid gap-8 xl:grid-cols-[minmax(0,22rem)_1fr] xl:items-start">
                    <NewsletterComposeForm
                        localeOptions={localeOptions}
                        stats={stats}
                    />
                    <NewsletterSubscribersTable
                        subscribers={subscribers}
                        filters={filters}
                    />
                </div>
            </div>
        </>
    );
}

AdminNewsletterIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
