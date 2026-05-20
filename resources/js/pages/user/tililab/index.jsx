import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TililabHowToApply from '@/pages/user/tililab/partials/TililabHowToApply';
import TililabPastEditionsCarousel from '@/pages/user/tililab/partials/TililabPastEditionsCarousel';
import {
    TililabConceptSection,
    TililabCriteriaSection,
    TililabJurySection,
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
                <TililabPastEditionsCarousel editions={editions ?? []} />

                <nav className="bg-background/70 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-4 text-sm font-semibold text-beta-blue">
                        <a href="#past-editions" className="hover:underline">
                            Éditions
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#how-to-apply" className="hover:underline">
                            Candidature
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#concept" className="hover:underline">
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
                        <a href="#jury" className="hover:underline">
                            Jury
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#sponsors" className="hover:underline">
                            Partenaires
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#faq" className="hover:underline">
                            FAQ
                        </a>
                    </div>
                </nav>

                <div className="bg-beta-white">
                    <TililabConceptSection />
                    <TililabPrizesSection />
                    <TililabCriteriaSection />
                    <TililabJurySection editions={editions ?? []} />
                </div>

                <div className="bg-background">
                    <TililabHowToApply />
                </div>

                <div className="bg-twhite">
                    <TililabSponsorsSection />
                </div>

                <div className="border-t border-border bg-background">
                    <TililabFaqSection />
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
