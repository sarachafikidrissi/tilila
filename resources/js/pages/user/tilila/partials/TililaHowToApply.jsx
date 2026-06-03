import { ClipboardList, FileText, Send } from 'lucide-react';
import TransText from '@/components/TransText';

export default function TililaHowToApply({ onOpenForm }) {
    const steps = [
        {
            icon: ClipboardList,
            title: {
                en: 'Check eligibility',
                fr: 'Vérifier l’éligibilité',
                ar: 'تحقق من الأهلية',
            },
            body: {
                en: 'Review the criteria and rules: TV spots on 2M during the eligibility period, digital campaigns, and pre-selection process.',
                fr: 'Consultez critères et règlement : spots TV sur 2M pendant la période, campagnes digitales, et processus de présélection.',
                ar: 'راجع المعايير والنظام: إعلانات تلفزية على 2M خلال الفترة، وحملات رقمية، وآلية الفرز.',
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
                en: 'Prepare your file',
                fr: 'Préparer le dossier',
                ar: 'جهّز الملف',
            },
            body: {
                en: 'Gather contact details, campaign title and description, and your spot (video upload). You will need to accept the contest rules.',
                fr: 'Réunissez coordonnées, titre et description, et votre spot (vidéo). Vous devrez accepter le règlement du concours.',
                ar: 'اجمع بيانات الاتصال والعنوان والوصف والإعلان (فيديو). يجب قبول نظام المسابقة.',
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
                en: 'Open the participation form, complete all fields, and submit. You will receive an acknowledgment by email.',
                fr: 'Ouvrez le formulaire de participation, complétez les champs, et envoyez. Un accusé de réception vous parviendra par e-mail.',
                ar: 'افتح استمارة المشاركة، املأ الحقول، وأرسل. ستصلك رسالة تأكيد بالبريد.',
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
                        en="Three simple steps—then open the secure participation form in a modal."
                        fr="Trois étapes simples—puis ouvrez le formulaire de participation sécurisé dans une fenêtre modale."
                        ar="ثلاث خطوات بسيطة—ثم افتح استمارة المشاركة الآمنة في نافذة منبثقة."
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
                <button
                    type="button"
                    onClick={() => onOpenForm?.()}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-beta-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-tblack/15 transition hover:bg-beta-blue/90 sm:w-auto"
                >
                    <TransText en="participate" fr="Participer" ar="شارك" />
                </button>
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
