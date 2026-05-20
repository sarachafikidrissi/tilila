import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LearnComingSoon from '@/pages/learn/Partials/LearnComingSoon';

export default function LearnAgenda() {
    return (
        <>
            <Head title="Learn · Agenda" />
            <div className="relative">
                <LearnComingSoon
                    backHref="/learn"
                    showPlannedModules={false}
                    sectionTitle={{
                        en: 'Programme agenda',
                        fr: 'Agenda du programme',
                        ar: 'أجندة البرنامج',
                    }}
                />
                <p className="relative mx-auto -mt-6 max-w-md px-4 pb-12 text-center text-sm text-muted-foreground">
                    <Link
                        href="/events"
                        className="font-semibold text-beta-blue hover:underline"
                    >
                        Events calendar →
                    </Link>
                </p>
            </div>
        </>
    );
}

LearnAgenda.layout = (page) => <AppLayout>{page}</AppLayout>;
