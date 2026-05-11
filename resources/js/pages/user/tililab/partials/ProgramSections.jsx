import TransText from '@/components/TransText';

function SectionShell({ id, title, subtitle, children }) {
    return (
        <section id={id} className="mx-auto max-w-7xl px-4 py-10">
            <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-tblack sm:text-3xl">
                    {title}
                </h2>
                {subtitle ? (
                    <p className="mt-3 text-sm leading-6 text-tgray">
                        {subtitle}
                    </p>
                ) : null}
            </div>
            <div className="mt-7">{children}</div>
        </section>
    );
}

export function TililabPrizesSection() {
    return (
        <SectionShell
            id="prizes"
            title={<TransText en="Prizes" fr="Prix" ar="الجوائز" />}
            subtitle={
                <TransText
                    en="Tililab rewards creative teams and projects with mentorship and visibility."
                    fr="Tililab récompense les équipes et projets créatifs par du mentorat et de la visibilité."
                    ar="يكافئ تيليلاب الفرق والمشاريع الإبداعية عبر الإرشاد وإبراز الأعمال."
                />
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                    {
                        en: 'Mentorship track',
                        fr: 'Parcours de mentorat',
                        ar: 'مسار الإرشاد',
                    },
                    {
                        en: 'Industry showcase',
                        fr: 'عرض أمام الصناعة',
                        ar: 'عرض أمام خبراء المجال',
                    },
                    {
                        en: 'Partner opportunities',
                        fr: 'Opportunités partenaires',
                        ar: 'فرص مع الشركاء',
                    },
                ].map((p) => (
                    <div
                        key={p.en}
                        className="rounded-2xl border border-border bg-secondary p-5"
                    >
                        <div className="text-sm font-semibold text-tblack">
                            <TransText en={p.en} fr={p.fr} ar={p.ar} />
                        </div>
                        <div className="mt-2 text-sm text-tgray">
                            <TransText
                                en="Details can be refined per edition."
                                fr="Les détails peuvent évoluer selon l’édition."
                                ar="يمكن تحديث التفاصيل حسب الدورة."
                            />
                        </div>
                    </div>
                ))}
            </div>
        </SectionShell>
    );
}

export function TililabCriteriaSection() {
    return (
        <SectionShell
            id="criteria"
            title={
                <TransText
                    en="Evaluation criteria"
                    fr="Critères d’évaluation"
                    ar="معايير التقييم"
                />
            }
            subtitle={
                <TransText
                    en="How projects are reviewed throughout the program."
                    fr="Comment les projets sont évalués tout au long du programme."
                    ar="كيف يتم تقييم المشاريع طوال البرنامج."
                />
            }
        >
            <ul className="grid gap-3 text-sm text-tgray sm:grid-cols-2">
                {[
                    {
                        en: 'Idea and insight',
                        fr: 'Idée et insight',
                        ar: 'الفكرة والرؤية',
                    },
                    {
                        en: 'Strategic relevance',
                        fr: 'Pertinence stratégique',
                        ar: 'الملاءمة الاستراتيجية',
                    },
                    {
                        en: 'Creative execution',
                        fr: 'Exécution créative',
                        ar: 'التنفيذ الإبداعي',
                    },
                    {
                        en: 'Impact potential',
                        fr: 'Potentiel d’impact',
                        ar: 'إمكانات الأثر',
                    },
                ].map((c) => (
                    <li
                        key={c.en}
                        className="rounded-2xl border border-border bg-background p-4"
                    >
                        <TransText en={c.en} fr={c.fr} ar={c.ar} />
                    </li>
                ))}
            </ul>
        </SectionShell>
    );
}

export function TililabFaqSection() {
    return (
        <SectionShell
            id="faq"
            title={<TransText en="FAQ" fr="FAQ" ar="الأسئلة الشائعة" />}
            subtitle={
                <TransText
                    en="Frequently asked questions for candidates."
                    fr="Questions fréquentes pour les candidats."
                    ar="أسئلة شائعة للمرشحين."
                />
            }
        >
            <div className="space-y-3">
                {[
                    {
                        qEn: 'How do I apply?',
                        qFr: 'Comment postuler ?',
                        qAr: 'كيف أقدّم؟',
                        aEn: 'Use the application form and follow the guidelines and key dates.',
                        aFr: 'Utilisez le formulaire de candidature et suivez les directives et dates clés.',
                        aAr: 'استخدم استمارة التقديم واتبع الإرشادات والتواريخ الرئيسية.',
                    },
                    {
                        qEn: 'Can I apply as a team?',
                        qFr: 'Puis-je postuler en équipe ?',
                        qAr: 'هل يمكنني التقديم كفريق؟',
                        aEn: 'Yes, team formats depend on the current edition rules.',
                        aFr: 'Oui, حسب قواعد الدورة الحالية.',
                        aAr: 'نعم، حسب قواعد الدورة الحالية.',
                    },
                ].map((item) => (
                    <details
                        key={item.qEn}
                        className="rounded-2xl border border-border bg-background p-5"
                    >
                        <summary className="cursor-pointer text-sm font-semibold text-tblack">
                            <TransText
                                en={item.qEn}
                                fr={item.qFr}
                                ar={item.qAr}
                            />
                        </summary>
                        <div className="mt-3 text-sm text-tgray">
                            <TransText
                                en={item.aEn}
                                fr={item.aFr}
                                ar={item.aAr}
                            />
                        </div>
                    </details>
                ))}
            </div>
        </SectionShell>
    );
}

export function TililabSponsorsSection() {
    return (
        <SectionShell
            id="sponsors"
            title={
                <TransText
                    en="Sponsors & partners"
                    fr="Sponsors & partenaires"
                    ar="الرعاة والشركاء"
                />
            }
            subtitle={
                <TransText
                    en="Partners supporting Tililab and its editions."
                    fr="Partenaires soutenant Tililab et ses éditions."
                    ar="الشركاء الداعمون لتيليلاب ودوراته."
                />
            }
        >
            <div className="rounded-2xl border border-border bg-muted/30 p-6 text-sm text-tgray">
                <TransText
                    en="Partner information can be presented here (logos, links, and sponsorship packages)."
                    fr="Les informations partenaires peuvent être affichées ici (logos, liens et offres de sponsoring)."
                    ar="يمكن عرض معلومات الشركاء هنا (الشعارات والروابط وباقات الرعاية)."
                />
            </div>
        </SectionShell>
    );
}

