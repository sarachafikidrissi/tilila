import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ExpertCard from '@/pages/experts/Partials/ExpertCard';

function getLocaleValue(value) {
    if (!value) {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'object') {
        return value.en || value.fr || value.ar || '';
    }

    return '';
}

export default function ExpertNetwork({ expert, experts, currentExpertId }) {
    const currentName = getLocaleValue(expert?.name) || 'Expert';
    const others = (experts ?? []).filter(
        (item) => item.id !== currentExpertId,
    );

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: '/expert/dashboard',
            },
            {
                title: 'Network',
                href: '#',
            },
        ],
        title: 'Experts Network',
        description: 'Discover and connect with experts across the platform.',
    });

    return (
        <>
            <Head title="Experts Network" />

            <div className="mx-auto flex w-full max-w-[min(100%,78rem)] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-tgray">
                                Tilila Connect
                            </p>
                            <h1 className="text-2xl font-bold tracking-tight text-tblack">
                                Welcome, {currentName}
                            </h1>
                            <p className="mt-1 text-sm text-tgray">
                                Browse experts and grow your professional
                                network.
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/expert/profile">
                                Update my profile
                            </Link>
                        </Button>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-tblack">
                            Network members
                        </h2>
                        <span className="text-sm text-tgray">
                            {others.length} experts
                        </span>
                    </div>

                    {others.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {others.map((item) => (
                                <ExpertCard key={item.id} expert={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-tgray">
                            No other published experts are available yet.
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

ExpertNetwork.layout = (page) => <AppLayout>{page}</AppLayout>;
