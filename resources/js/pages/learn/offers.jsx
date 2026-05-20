import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LearnComingSoon from '@/pages/learn/Partials/LearnComingSoon';

export default function LearnOffers() {
    return (
        <>
            <Head title="Learn · Offers" />
            <LearnComingSoon
                backHref="/learn"
                showPlannedModules={false}
                sectionTitle={{
                    en: 'Institutional offers',
                    fr: 'Offres institutionnelles',
                    ar: 'عروض مؤسسية',
                }}
            />
        </>
    );
}

LearnOffers.layout = (page) => <AppLayout>{page}</AppLayout>;
