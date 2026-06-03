import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import ParticipateModal from '@/pages/user/tilila/partials/ParticipateModal';
import TililaHowToApply from '@/pages/user/tilila/partials/TililaHowToApply';
import CurrentEditionSection from '@/pages/user/tilila/partials/CurrentEditionSection';
import TililaPastEditionsCarousel from '@/pages/user/tilila/partials/TililaPastEditionsCarousel';
import {
    TililaApplySection,
    TililaConceptSection,
    TililaCriteriaSection,
    TililaFaqSection,
    TililaPrizesSection,
    TililaSponsorsSection,
} from '@/pages/user/tilila/partials/ProgramSections';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';

export default function TililaIndex() {
    const { currentEdition, editions, flash } = usePage().props;
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

                <CurrentEditionSection
                    edition={currentEdition}
                    onOpenParticipate={() => setFormOpen(true)}
                />

                <TililaPastEditionsCarousel
                    editions={editions ?? []}
                    excludeEditionId={currentEdition?.id ?? null}
                    excludeYear={currentEdition?.year ?? null}
                />

                <nav className="bg-background/70 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-4 text-sm font-semibold text-beta-blue">
                        {currentEdition ? (
                            <>
                                <a
                                    href="#current-edition"
                                    className="hover:underline"
                                >
                                    <TransText
                                        en="Current edition"
                                        fr="Édition en cours"
                                        ar="الدورة الحالية"
                                    />
                                </a>
                                <span className="text-tgray">·</span>
                            </>
                        ) : null}
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
                            <span>Prix</span>
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#criteria" className="hover:underline">
                            Critères
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#apply" className="hover:underline">
                            Formulaire
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#sponsors" className="hover:underline">
                            Sponsors
                        </a>
                        <span className="text-tgray">·</span>
                        <a href="#faq" className="hover:underline">
                            FAQ
                        </a>
                    </div>
                </nav>

                {/* <div className="bg-beta-white">
                    <TililaConceptSection />
                    <TililaPrizesSection />
                    <TililaCriteriaSection />
                </div> */}

                <div className="bg-background">
                    <TililaHowToApply onOpenForm={() => setFormOpen(true)} />
                </div>

                <div className="bg-twhite">
                    {/* <TililaApplySection onOpenForm={() => setFormOpen(true)} /> */}
                    <TililaSponsorsSection />
                </div>

                <div className="border-t border-border bg-background">
                    <TililaFaqSection />
                </div>

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
