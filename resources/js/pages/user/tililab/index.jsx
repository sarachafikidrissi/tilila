import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import GuidelinesSection from '@/pages/user/tililab/partials/GuidelinesSection';
import HeroSection from '@/pages/user/tililab/partials/HeroSection';
import KeyDatesSection from '@/pages/user/tililab/partials/KeyDatesSection';
import MissionSection from '@/pages/user/tililab/partials/MissionSection';
import PastWinnersSection from '@/pages/user/tililab/partials/PastWinnersSection';
import {
    TililabCriteriaSection,
    TililabFaqSection,
    TililabPrizesSection,
    TililabSponsorsSection,
} from '@/pages/user/tililab/partials/ProgramSections';
import { useTranslation } from '@/contexts/TranslationContext';

export default function TililabIndex() {
    const { editions } = usePage().props;
    return (
        <>
            <TililabHead />
            <div>
                <div className="bg-beta-white py-8">
                    <HeroSection />
                </div>

                <nav className="bg-background/70 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-4 text-sm font-semibold text-beta-blue">
                        <a href="#mission" className="hover:underline">
                            Concept
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#prizes" className="hover:underline">
                            Prix
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#criteria" className="hover:underline">
                            Critères
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#guidelines" className="hover:underline">
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
                        <a href="#past-editions" className="hover:underline">
                            Lauréats
                        </a>
                    </div>
                </nav>

                <div className="bg-twhite py-8">
                    <section className="mx-auto max-w-7xl px-4 pb-12">
                        <div className="grid gap-6 lg:grid-cols-12">
                            <div className="lg:col-span-7">
                                <div id="mission">
                                    <MissionSection />
                                </div>
                                <TililabPrizesSection />
                                <TililabCriteriaSection />
                                <GuidelinesSection />
                                <TililabFaqSection />
                                <TililabSponsorsSection />
                            </div>
                            <div className="lg:col-span-5">
                                <KeyDatesSection />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="bg-beta-white py-8">
                    <div id="past-editions">
                        <PastWinnersSection editions={editions ?? []} />
                    </div>
                </div>
            </div>
        </>
    );
}

TililabIndex.layout = (page) => <AppLayout>{page}</AppLayout>;

function TililabHead() {
    const { t } = useTranslation();
    return <Head title={t('tililab.headTitle')} />;
}
