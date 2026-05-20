import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LearnComingSoon from '@/pages/learn/Partials/LearnComingSoon';

export default function LearnAcademy() {
    return (
        <>
            <Head title="Tilila Academy" />
            <LearnComingSoon
                backHref="/learn"
                showPlannedModules={false}
                sectionTitle={{
                    en: 'Tilila Academy',
                    fr: 'Tilila Academy',
                    ar: 'أكاديمية تيليلا',
                }}
            />
        </>
    );
}

LearnAcademy.layout = (page) => <AppLayout>{page}</AppLayout>;
