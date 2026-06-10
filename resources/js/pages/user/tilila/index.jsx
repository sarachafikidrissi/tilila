import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import {
    ProgramContactSection,
    ProgramNewsSection,
    ProgramTestimonialsSection,
} from '@/components/program/ProgramSharedSections';
import ParticipateModal from '@/pages/user/tilila/partials/ParticipateModal';
import TililaHowToApply from '@/pages/user/tilila/partials/TililaHowToApply';
import CurrentEditionSection from '@/pages/user/tilila/partials/CurrentEditionSection';
import TililaPartnersSection from '@/pages/user/tilila/partials/TililaPartnersSection';
import TililaPastEditionsCarousel from '@/pages/user/tilila/partials/TililaPastEditionsCarousel';
import {
    TililaAdmissionSection,
    TililaApplySection,
    TililaConceptSection,
    TililaCriteriaSection,
    TililaFaqSection,
    TililaJurySection,
    TililaPrizesSection,
    TililaWhyParticipateSection,
} from '@/pages/user/tilila/partials/ProgramSections';
import { useTranslation } from '@/contexts/TranslationContext';
import TililaTeaserHero from './partials/TililaTeaserHero';

export default function TililaIndex() {
    const { currentEdition, editions, flash, testimonials, news } =
        usePage().props;
    const [formOpen, setFormOpen] = useState(false);

    return (
        <>
            <TililaHead />
            <div>
                {flash?.success ? (
                    <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-900 sm:px-6">
                        {flash.success}
                    </div>
                ) : null}
                <TililaTeaserHero videoUrl={usePage().props.teaserVideoUrl} />


                <CurrentEditionSection
                    edition={currentEdition}
                    onOpenParticipate={() => setFormOpen(true)}
                />



                <div className="bg-beta-white">
                    <TililaConceptSection />
                    <TililaWhyParticipateSection />
                    <TililaPrizesSection />
                    <TililaAdmissionSection />
                    <TililaJurySection jury={currentEdition?.jury} />
                    {/* <TililaCriteriaSection /> */}
                </div>

                <div className="bg-background">
                    <TililaHowToApply onOpenForm={() => setFormOpen(true)} />
                    <TililaApplySection onOpenForm={() => setFormOpen(true)} />
                </div>

                {/* <ProgramTestimonialsSection testimonials={testimonials ?? []} program="tilila" /> */}
                {/* <ProgramNewsSection news={news ?? []} program="tilila" /> */}
                <TililaPastEditionsCarousel
                    editions={editions ?? []}
                    excludeEditionId={currentEdition?.id ?? null}
                    excludeYear={currentEdition?.year ?? null}
                />
                <TililaPartnersSection />

                <div className="border-t border-border bg-background">
                    <TililaFaqSection />
                </div>

                <ProgramContactSection program="tilila" />

                <ParticipateModal open={formOpen} onOpenChange={setFormOpen} />
            </div>
        </>
    );
}

TililaIndex.layout = (page) => <AppLayout>{page}</AppLayout>;

function TililaHead() {
    const { t } = useTranslation();
    return <Head title={t('tilila.headTitle')} />;
}
