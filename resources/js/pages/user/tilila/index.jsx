import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ArchiveSection from '@/pages/user/tilila/partials/ArchiveSection';
import CtaSection from '@/pages/user/tilila/partials/CtaSection';
import FeaturedLaureatesSection from '@/pages/user/tilila/partials/FeaturedLaureatesSection';
import HeroSection from '@/pages/user/tilila/partials/HeroSection';
import ParticipateSection from '@/pages/user/tilila/partials/ParticipateModal';
import {
    TililaApplySection,
    TililaConceptSection,
    TililaCriteriaSection,
    TililaFaqSection,
    TililaPrizesSection,
    TililaSponsorsSection,
} from '@/pages/user/tilila/partials/ProgramSections';
import { useTranslation } from '@/contexts/TranslationContext';

export default function TililaIndex() {
    const { editions } = usePage().props;
    // `editions` is provided by the /tilila route (Inertia props)
    return (
        <>
            <TililaHead />
            <div>
                <div className="pb-8">
                    <HeroSection
                        onParticipate={() => {
                            requestAnimationFrame(() => {
                                const el = document.getElementById(
                                    'tilila-participate-section',
                                );
                                if (el) {
                                    el.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start',
                                    });
                                }
                            });
                        }}
                    />
                </div>
                <div className="bg-twhite px-8 py-10">
                    <FeaturedLaureatesSection />
                </div>

                <nav className="bg-background/70 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-4 text-sm font-semibold text-beta-blue">
                        <a href="#concept" className="hover:underline">
                            Concept
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#prizes" className="hover:underline">
                            <span>Prix</span>
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#criteria" className="hover:underline">
                            Critères
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#apply" className="hover:underline">
                            Candidature
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#faq" className="hover:underline">
                            FAQ
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#sponsors" className="hover:underline">
                            Sponsors
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#archive" className="hover:underline">
                            Archives
                        </a>
                    </div>
                </nav>

                <div className="bg-beta-white">
                    <TililaConceptSection />
                    <TililaPrizesSection />
                    <TililaCriteriaSection />
                </div>

                <ParticipateSection />

                <div className="bg-twhite">
                    <TililaApplySection />
                    <TililaFaqSection />
                    <TililaSponsorsSection />
                </div>

                <div className="bg-beta-white py-10">
                    <ArchiveSection editions={editions ?? []} />
                </div>
                {/* <div className="bg-twhite py-10">
                    <CtaSection />
                </div> */}
            </div>
        </>
    );
}

TililaIndex.layout = (page) => <AppLayout>{page}</AppLayout>;

function TililaHead() {
    const { t } = useTranslation();
    return <Head title={t('tilila.headTitle')} />;
}
