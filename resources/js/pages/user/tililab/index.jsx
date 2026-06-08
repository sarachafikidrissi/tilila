import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    ProgramContactSection,
    ProgramHeroSection,
    ProgramNewsSection,
    ProgramPartnersSection,
    ProgramStatsSection,
    ProgramTestimonialsSection,
} from '@/components/program/ProgramSharedSections';
import TililabCurrentEditionSection from '@/pages/user/tililab/partials/CurrentEditionSection';
import TililabHowToApply from '@/pages/user/tililab/partials/TililabHowToApply';
import TililabPastEditionsCarousel from '@/pages/user/tililab/partials/TililabPastEditionsCarousel';
import GuidelinesSection from '@/pages/user/tililab/partials/GuidelinesSection';
import KeyDatesSection from '@/pages/user/tililab/partials/KeyDatesSection';
import {
    TililabAdmissionSection,
    TililabConceptSection,
    TililabCriteriaSection,
    TililabFaqSection,
    TililabJourneySection,
    TililabPrizesSection,
    TililabWhyParticipateSection,
} from '@/pages/user/tililab/partials/ProgramSections';
import { useTranslation } from '@/contexts/TranslationContext';

export default function TililabIndex() {
    const { currentEdition, editions, testimonials, news } = usePage().props;

    return (
        <>
            <TililabHead />
            <div>
                <ProgramHeroSection program="tililab" />
                <ProgramStatsSection program="tililab" />

                <TililabCurrentEditionSection edition={currentEdition} />

                <TililabPastEditionsCarousel
                    editions={editions ?? []}
                    excludeEditionId={currentEdition?.id ?? null}
                    excludeYear={currentEdition?.year ?? null}
                />

                <div className="bg-beta-white">
                    <TililabConceptSection />
                    <TililabWhyParticipateSection />
                    <TililabJourneySection />
                    <TililabPrizesSection />
                    <TililabAdmissionSection />
                    <TililabCriteriaSection />
                </div>

                <div className="bg-background">
                    <KeyDatesSection edition={currentEdition} />
                    <div className="mx-auto max-w-7xl px-4 pb-10">
                        <GuidelinesSection />
                    </div>
                    <TililabHowToApply />
                </div>

                {/* <ProgramTestimonialsSection testimonials={testimonials ?? []} program="tililab" /> */}
                {/* <ProgramNewsSection news={news ?? []} program="tililab" /> */}

                <ProgramPartnersSection />

                <div className="border-t border-border bg-background">
                    <TililabFaqSection />
                </div>

                <ProgramContactSection program="tililab" />
            </div>
        </>
    );
}

TililabIndex.layout = (page) => <AppLayout>{page}</AppLayout>;

function TililabHead() {
    const { t } = useTranslation();
    return <Head title={t('tililab.headTitle')} />;
}
