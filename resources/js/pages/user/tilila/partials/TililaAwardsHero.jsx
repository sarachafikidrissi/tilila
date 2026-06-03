import { Award, Sparkles, Tv } from 'lucide-react';
import TransText from '@/components/TransText';

export default function TililaAwardsHero() {
    return (
        <section className="relative overflow-hidden border-b border-gold/20 bg-tblack text-twhite">
            <div
                className="pointer-events-none absolute top-0 -right-24 h-96 w-96 rounded-full bg-gold/15 blur-3xl"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-beta-blue/20 blur-3xl"
                aria-hidden
            />

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                <div className="max-w-3xl">
                    <p className="text-xs font-bold tracking-[0.28em] text-gold uppercase">
                        <TransText
                            en="2M · Parity & Diversity"
                            fr="2M · Parité & diversité"
                            ar="2M · المساواة والتنوع"
                        />
                    </p>
                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                        <span className="text-gold">Trophée</span>{' '}
                        <span className="text-twhite">Tilila</span>
                    </h1>
                    <p className="mt-5 text-base leading-relaxed text-twhite/75 sm:text-lg">
                        <TransText
                            en="Morocco’s benchmark award for inclusive advertising—organized by 2M through its Comité Parité et Diversité. Each year we honour campaigns that respect women, diversity, and dignity in Moroccan advertising and media."
                            fr="La référence marocaine pour une publicité inclusive—portée par 2M et son Comité Parité et Diversité. Chaque année, nous récompensons les campagnes qui respectent les femmes, la diversité et la dignité dans la publicité et les médias."
                            ar="المرجع المغربي للإعلان الشامل—تنظمه 2M عبر لجنة المساواة والتنوع. نكرّم سنوياً الحملات التي تحترم المرأة والتنوع والكرامة في الإعلان والإعلام المغربي."
                        />
                    </p>
                </div>

                <div className="mt-12 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-twhite/10 bg-twhite/5 p-5 backdrop-blur-sm">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gold/20 text-gold">
                            <Award className="size-5" aria-hidden />
                        </div>
                        <h2 className="mt-4 text-sm font-bold tracking-wide text-gold uppercase">
                            <TransText
                                en="What we reward"
                                fr="Ce que nous valorisons"
                                ar="ما نكافئ عليه"
                            />
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-twhite/70">
                            <TransText
                                en="TV and digital campaigns broadcast (or scheduled) on 2M during the eligibility window—pre-selected for jury review."
                                fr="Spots TV et campagnes digitales diffusés (ou programmés) sur 2M pendant la période d’éligibilité—présélectionnés pour le jury."
                                ar="حملات تلفزية ورقمية مُبثّة (أو مُبرمجة) على 2M خلال فترة الأهلية—مع فرز مسبق لعرضها على لجنة التحكيم."
                            />
                        </p>
                    </div>
                    <div className="rounded-2xl border border-twhite/10 bg-twhite/5 p-5 backdrop-blur-sm">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-beta-blue/25 text-beta-blue">
                            <Tv className="size-5" aria-hidden />
                        </div>
                        <h2 className="mt-4 text-sm font-bold tracking-wide text-gold uppercase">
                            <TransText
                                en="Who can enter"
                                fr="Qui peut candidater"
                                ar="من يمكنه الترشح"
                            />
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-twhite/70">
                            <TransText
                                en="Advertisers and agencies with eligible spots. A selection committee shortlists ten campaigns for the jury each edition."
                                fr="Annonceurs et agences disposant de spots éligibles. Un comité de sélection retient dix campagnes pour le jury à chaque édition."
                                ar="المعلنون والوكالات ذات الإعلانات المؤهلة. لجنة فرز تختار عشر حملات لعرضها على لجنة التحكيم في كل دورة."
                            />
                        </p>
                    </div>
                    <div className="rounded-2xl border border-twhite/10 bg-twhite/5 p-5 backdrop-blur-sm">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gold/20 text-gold">
                            <Sparkles className="size-5" aria-hidden />
                        </div>
                        <h2 className="mt-4 text-sm font-bold tracking-wide text-gold uppercase">
                            <TransText
                                en="Why it matters"
                                fr="Pourquoi c’est important"
                                ar="لماذا يهم"
                            />
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-twhite/70">
                            <TransText
                                en="The ceremony is a flagship moment for responsible communication—raising standards for parity, inclusion, and authentic representation."
                                fr="La cérémonie est un moment phare pour une communication responsable—qui élève les standards de parité, d’inclusion et de représentation authentique."
                                ar="الحفل محطة بارزة للتواصل المسؤول—لرفع معايير المساواة والإدماج والتمثيل الحقيقي."
                            />
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
