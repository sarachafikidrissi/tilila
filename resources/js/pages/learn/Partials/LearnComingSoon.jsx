import { Link } from '@inertiajs/react';
import { BookOpen, Calendar, GraduationCap, Sparkles } from 'lucide-react';
import TransText from '@/components/TransText';
import { cn } from '@/lib/utils';

const PLANNED_MODULES = [
    {
        icon: GraduationCap,
        en: 'Tilila Academy',
        fr: 'Tilila Academy',
        ar: 'أكاديمية تيليلا',
        sub: {
            en: 'Training · Leadership · Certificates',
            fr: 'Formation · Leadership · Certificats',
            ar: 'تدريب · قيادة · شهادات',
        },
    },
    {
        icon: BookOpen,
        en: 'Resources',
        fr: 'Ressources',
        ar: 'موارد',
        sub: {
            en: 'Guides · Toolkits · Templates',
            fr: 'Guides · Boîte à outils · Modèles',
            ar: 'أدلة · أدوات · قوالب',
        },
    },
    {
        icon: Sparkles,
        en: 'Institutional offers',
        fr: 'Offres institutionnelles',
        ar: 'عروض مؤسسية',
        sub: {
            en: 'Companies · Institutions · NGOs',
            fr: 'Entreprises · Institutions · ONG',
            ar: 'شركات · مؤسسات · منظمات',
        },
    },
    {
        icon: Calendar,
        en: 'Programme agenda',
        fr: 'Agenda du programme',
        ar: 'أجندة البرنامج',
        sub: {
            en: 'Webinars · Workshops · Calendar',
            fr: 'Webinaires · Ateliers · Calendrier',
            ar: 'ندوات · ورش · تقويم',
        },
    },
];

export default function LearnComingSoon({
    sectionTitle = null,
    showPlannedModules = true,
    showBackLink = true,
    backHref = '/',
}) {
    return (
        <div className="relative overflow-hidden">
            <div
                className="bg-brand-subtle pointer-events-none absolute inset-0"
                aria-hidden
            />
            <div className="pointer-events-none absolute end-0 -top-24 h-72 w-72 rounded-full bg-beta-blue/10 blur-3xl" />
            <div className="pointer-events-none absolute start-0 -bottom-20 h-64 w-64 rounded-full bg-alpha-blue/80 blur-3xl" />

            <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                {showBackLink ? (
                    <Link
                        href={backHref}
                        className="inline-flex text-sm font-semibold text-beta-blue transition hover:underline"
                    >
                        {backHref === '/learn' ? (
                            <TransText
                                en="← Tilila Learn"
                                fr="← Tilila Learn"
                                ar="← تيليلا ليرن"
                            />
                        ) : (
                            <TransText
                                en="← Home"
                                fr="← Accueil"
                                ar="← الرئيسية"
                            />
                        )}
                    </Link>
                ) : null}

                <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_60px_-16px_rgba(15,23,42,0.12)] ring-1 ring-border">
                    <div className="border-b border-border bg-linear-to-br from-alpha-blue/90 via-card to-card px-6 py-10 text-center sm:px-10 sm:py-12">
                        <span className="inline-flex items-center gap-2 rounded-full border border-beta-blue/25 bg-beta-blue/10 px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.22em] text-beta-blue uppercase">
                            <span className="relative flex size-2" aria-hidden>
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-beta-blue opacity-60" />
                                <span className="relative inline-flex size-2 rounded-full bg-beta-blue" />
                            </span>
                            <TransText
                                en="Coming soon"
                                fr="Bientôt disponible"
                                ar="قريبًا"
                            />
                        </span>

                        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                            {sectionTitle ? (
                                <TransText
                                    en={sectionTitle.en}
                                    fr={sectionTitle.fr}
                                    ar={sectionTitle.ar}
                                />
                            ) : (
                                <TransText
                                    en="Tilila Learn"
                                    fr="Tilila Learn"
                                    ar="تيليلا ليرن"
                                />
                            )}
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                            <TransText
                                en="We are building a dedicated learning hub — academy tracks, toolkits, institutional programmes, and a shared agenda. Stay tuned."
                                fr="Nous préparons un espace dédié à l’apprentissage — parcours academy, boîtes à outils, programmes institutionnels et agenda partagé. Restez connectés."
                                ar="نُعدّ مساحة تعلّم مخصّصة — مسارات الأكاديمية وأدوات عملية وبرامج مؤسسية وأجندة مشتركة. ترقّبوا الإطلاق."
                            />
                        </p>
                    </div>

                    <div className="px-6 py-8 sm:px-10 sm:py-10">
                        {showPlannedModules ? (
                            <>
                                <p className="text-center text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                    <TransText
                                        en="What’s on the way"
                                        fr="À venir"
                                        ar="قيد الإعداد"
                                    />
                                </p>
                                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {PLANNED_MODULES.map((module) => {
                                        const Icon = module.icon;
                                        return (
                                            <li
                                                key={module.en}
                                                className={cn(
                                                    'flex gap-4 rounded-2xl border border-dashed border-border bg-muted/40 p-4',
                                                    'opacity-90',
                                                )}
                                            >
                                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-alpha-blue text-beta-blue">
                                                    <Icon
                                                        className="size-5"
                                                        aria-hidden
                                                    />
                                                </div>
                                                <div className="min-w-0 text-start">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-semibold text-foreground">
                                                            <TransText
                                                                en={module.en}
                                                                fr={module.fr}
                                                                ar={module.ar}
                                                            />
                                                        </span>
                                                        <span className="rounded-full bg-muted px-2 py-0.5 text-[0.6rem] font-bold tracking-wide text-muted-foreground uppercase">
                                                            <TransText
                                                                en="Soon"
                                                                fr="Bientôt"
                                                                ar="قريبًا"
                                                            />
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                        <TransText
                                                            en={module.sub.en}
                                                            fr={module.sub.fr}
                                                            ar={module.sub.ar}
                                                        />
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>
                        ) : null}

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href="/contact"
                                className="inline-flex w-full items-center justify-center rounded-xl bg-beta-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-beta-blue/90 sm:w-auto"
                            >
                                <TransText
                                    en="Get notified"
                                    fr="Me tenir informé"
                                    ar="أبلغوني عند الإطلاق"
                                />
                            </Link>
                            <Link
                                href="/opportunities"
                                className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted sm:w-auto"
                            >
                                <TransText
                                    en="Browse opportunities"
                                    fr="Voir les opportunités"
                                    ar="تصفح الفرص"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
