import { Link } from '@inertiajs/react';
import { ClipboardList, FileText, Send } from 'lucide-react';
import TransText from '@/components/TransText';

export default function TililabHowToApply() {
    const steps = [
        {
            icon: ClipboardList,
            title: {
                en: 'Check eligibility',
                fr: 'Vérifier l’éligibilité',
                ar: 'تحقق من الأهلية',
            },
            body: {
                en: 'Open to young creatives under 30 — creative and communication profiles. Teams of 1–3 people depending on the edition rules.',
                fr: 'Ouvert aux jeunes créatifs de moins de 30 ans — profils création et communication. Équipes de 1 à 3 selon le règlement.',
                ar: 'مفتوح للمبدعين دون 30 سنة — إبداع واتصال. فرق من 1 إلى 3 حسب الدورة.',
            },
            href: '#criteria',
            linkLabel: {
                en: 'See criteria',
                fr: 'Voir les critères',
                ar: 'المعايير',
            },
        },
        {
            icon: FileText,
            title: {
                en: 'Prepare your application',
                fr: 'Préparer la candidature',
                ar: 'جهّز ملفك',
            },
            body: {
                en: 'Read the concept, prizes, and key dates. Gather your team details and creative materials for the national call.',
                fr: 'Lisez le concept, les prix et les dates clés. Réunissez les infos d’équipe et vos supports pour l’appel national.',
                ar: 'اقرأ المفهوم والجوائز والمواعيد. جهّز بيانات الفريق وموادك للنداء الوطني.',
            },
            href: '#concept',
            linkLabel: {
                en: 'Read concept',
                fr: 'Lire le concept',
                ar: 'المفهوم',
            },
        },
        {
            icon: Send,
            title: {
                en: 'Submit online',
                fr: 'Envoyer en ligne',
                ar: 'أرسل عبر الإنترنت',
            },
            body: {
                en: 'Use the official Tililab application form before the deadline announced for the current edition.',
                fr: 'Utilisez le formulaire officiel Tililab avant la date limite annoncée pour l’édition en cours.',
                ar: 'استخدم استمارة تيليلاب الرسمية قبل الموعد النهائي للدورة الحالية.',
            },
            href: null,
            linkLabel: null,
        },
    ];

    return (
        <section
            id="how-to-apply"
            className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    <TransText
                        en="How to apply"
                        fr="Comment candidater"
                        ar="كيفية الترشح"
                    />
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <TransText
                        en="Three steps — then complete the official application form."
                        fr="Trois étapes — puis le formulaire officiel de candidature."
                        ar="ثلاث خطوات — ثم الاستمارة الرسمية."
                    />
                </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={step.title.en}
                            className="relative rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-border/50"
                        >
                            <div className="absolute start-6 -top-3 flex size-8 items-center justify-center rounded-full bg-beta-blue text-xs font-bold text-white">
                                {idx + 1}
                            </div>
                            <div className="mt-4 flex size-11 items-center justify-center rounded-xl bg-alpha-blue text-beta-blue">
                                <Icon className="size-5" aria-hidden />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-foreground">
                                <TransText
                                    en={step.title.en}
                                    fr={step.title.fr}
                                    ar={step.title.ar}
                                />
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                <TransText
                                    en={step.body.en}
                                    fr={step.body.fr}
                                    ar={step.body.ar}
                                />
                            </p>
                            {step.href ? (
                                <a
                                    href={step.href}
                                    className="mt-4 inline-block text-sm font-semibold text-beta-blue hover:underline"
                                >
                                    <TransText
                                        en={step.linkLabel.en}
                                        fr={step.linkLabel.fr}
                                        ar={step.linkLabel.ar}
                                    />
                                </a>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                    href="/tililab/form"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-beta-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-tblack/15 transition hover:bg-beta-blue/90 sm:w-auto"
                >
                    <TransText
                        en="Open application form"
                        fr="Ouvrir le formulaire"
                        ar="افتح الاستمارة"
                    />
                </Link>
                <a
                    href="#faq"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-8 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted sm:w-auto"
                >
                    <TransText
                        en="Read FAQ"
                        fr="Lire la FAQ"
                        ar="الأسئلة الشائعة"
                    />
                </a>
            </div>
        </section>
    );
}
