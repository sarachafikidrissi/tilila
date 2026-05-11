import React from 'react';
import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';

function Section({ id, title, subtitle, children }) {
    return (
        <section id={id} className="rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-border">
            <h2 className="text-lg font-extrabold text-foreground">
                {title}
            </h2>
            {subtitle ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {subtitle}
                </p>
            ) : null}
            <div className="mt-5">{children}</div>
        </section>
    );
}

export default function TiliTalksLanding() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    <Section
                        id="concept"
                        title={<TransText en="TiliTalks — Concept" fr="TiliTalks — Concept" ar="تيلي توكس — المفهوم" />}
                        subtitle={
                            <TransText
                                en="Public conversations: talks, workshops, and webinars — designed to share stories, insights, and practical learning."
                                fr="Conversations publiques : talks, ateliers et webinaires — pour partager des récits, des idées et des apprentissages."
                                ar="حوارات عامة: لقاءات وورش وندوات — لمشاركة القصص والأفكار والتعلّم العملي."
                            />
                        }
                    >
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/events?view=calendar"
                                className="inline-flex items-center rounded-full bg-beta-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-beta-blue/90"
                            >
                                <TransText en="Open agenda" fr="Ouvrir l’agenda" ar="افتح الأجندة" />
                            </Link>
                            <a
                                href="#register"
                                className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                            >
                                <TransText en="Register" fr="S’inscrire" ar="التسجيل" />
                            </a>
                        </div>
                    </Section>

                    <Section
                        id="agenda"
                        title={<TransText en="Agenda" fr="Agenda" ar="الأجندة" />}
                        subtitle={
                            <TransText
                                en="Explore upcoming sessions and filter by status and category."
                                fr="Explorez les prochaines sessions et filtrez par statut et catégorie."
                                ar="استكشف الجلسات القادمة وقم بالتصفية حسب الحالة والفئة."
                            />
                        }
                    >
                        <Link
                            href="/events?view=calendar"
                            className="text-sm font-semibold text-beta-blue hover:underline"
                        >
                            <TransText en="Go to the annual calendar →" fr="Aller au calendrier annuel →" ar="اذهب إلى التقويم السنوي →" />
                        </Link>
                    </Section>

                    <Section
                        id="speakers"
                        title={<TransText en="Speakers" fr="Speakers" ar="المتحدثون" />}
                        subtitle={
                            <TransText
                                en="Speaker profiles can be displayed per session."
                                fr="Les profils des intervenants peuvent être affichés par session."
                                ar="يمكن عرض ملفات المتحدثين لكل جلسة."
                            />
                        }
                    >
                        <div className="rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
                            <TransText
                                en="This section will pull from event details when speaker data is available."
                                fr="Cette section pourra se nourrir des fiches événements lorsque les données speakers seront disponibles."
                                ar="سيتم تغذية هذا القسم من تفاصيل الفعالية عندما تتوفر بيانات المتحدثين."
                            />
                        </div>
                    </Section>
                </div>

                <div className="space-y-6 lg:col-span-4">
                    <Section
                        id="replays"
                        title={<TransText en="Replays" fr="Replays" ar="الإعادات" />}
                        subtitle={
                            <TransText
                                en="Watch past sessions and highlights."
                                fr="Regardez les sessions passées et les meilleurs moments."
                                ar="شاهد الجلسات الماضية وأبرز اللقطات."
                            />
                        }
                    >
                        <Link
                            href="/events?view=calendar"
                            className="text-sm font-semibold text-beta-blue hover:underline"
                        >
                            <TransText en="Browse past events →" fr="Voir les événements passés →" ar="تصفح الفعاليات الماضية →" />
                        </Link>
                    </Section>

                    <Section
                        id="photos"
                        title={<TransText en="Photos" fr="Photos" ar="الصور" />}
                        subtitle={
                            <TransText
                                en="Photo galleries can be attached to each event."
                                fr="Des galeries photos peuvent être associées à chaque événement."
                                ar="يمكن ربط معارض صور بكل فعالية."
                            />
                        }
                    >
                        <div className="rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
                            <TransText
                                en="If an event has gallery images, they will appear on the event detail page."
                                fr="Si un événement a des images, elles apparaîtront sur la page de détail."
                                ar="إذا كانت الفعالية تحتوي على صور، ستظهر في صفحة التفاصيل."
                            />
                        </div>
                    </Section>

                    <Section
                        id="register"
                        title={<TransText en="Registration" fr="Inscription" ar="التسجيل" />}
                        subtitle={
                            <TransText
                                en="Reserve your spot for upcoming sessions."
                                fr="Réservez votre place pour les prochaines sessions."
                                ar="احجز مقعدك للجلسات القادمة."
                            />
                        }
                    >
                        <Link
                            href="/events?view=calendar"
                            className="inline-flex w-full items-center justify-center rounded-full bg-beta-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-beta-blue/90"
                        >
                            <TransText en="See sessions & register" fr="Voir les sessions & s’inscrire" ar="عرض الجلسات والتسجيل" />
                        </Link>
                    </Section>
                </div>
            </div>
        </div>
    );
}

