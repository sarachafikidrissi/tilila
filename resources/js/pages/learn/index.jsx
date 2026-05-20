import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LearnComingSoon from '@/pages/learn/Partials/LearnComingSoon';

export default function LearnIndex() {
    return (
        <>
            <Head title="Learn · Tilila" />
            <LearnComingSoon />
        </>
    );
}

LearnIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
