import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LearnComingSoon from '@/pages/learn/Partials/LearnComingSoon';

export default function LearnResources() {
    return (
        <>
            <Head title="Learn · Resources" />
            <LearnComingSoon
                backHref="/learn"
                showPlannedModules={false}
                sectionTitle={{
                    en: 'Pedagogical resources',
                    fr: 'Ressources pédagogiques',
                    ar: 'موارد تعليمية',
                }}
            />
        </>
    );
}

LearnResources.layout = (page) => <AppLayout>{page}</AppLayout>;
