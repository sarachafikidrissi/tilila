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

export function TililaConceptSection() {
    return (
        <SectionShell
            id="concept"
            title={<TransText en="Concept" fr="Concept" ar="المفهوم" />}
            subtitle={
                <TransText
                    en="Tilila Awards celebrates advertising campaigns that challenge stereotypes and advance gender equality."
                    fr="Tilila Awards célèbre les campagnes publicitaires qui combattent les stéréotypes et font progresser l’égalité."
                    ar="تحتفي جوائز تيليلا بالحملات الإعلانية التي تتحدى الصور النمطية وتعزز المساواة."
                />
            }
        >
            <div className="rounded-2xl border border-border bg-background p-6 text-sm text-tgray">
                <TransText
                    en="This page is structured according to the reference arborescence: concept, prizes, evaluation criteria, jury, application, FAQ, sponsors, and laureates by year."
                    fr="Cette page est structurée selon l’arborescence de référence : concept, prix, critères d’évaluation, jury, candidature, FAQ, sponsors et lauréats par année."
                    ar="تم تنظيم هذه الصفحة وفقًا للهيكلة المرجعية: المفهوم، الجوائز، معايير التقييم، لجنة التحكيم، الترشح، الأسئلة الشائعة، الرعاة، والفائزات حسب السنة."
                />
            </div>
        </SectionShell>
    );
}

export function TililaPrizesSection() {
    return (
        <SectionShell
            id="prizes"
            title={<TransText en="Prizes" fr="Prix" ar="الجوائز" />}
            subtitle={
                <TransText
                    en="Recognizing campaigns that set a new standard for inclusive representation."
                    fr="Récompenser les campagnes qui établissent une nouvelle norme de représentation inclusive."
                    ar="تكريم الحملات التي تضع معيارًا جديدًا للتمثيل الشامل."
                />
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                    {
                        en: 'Grand Prize',
                        fr: 'Grand Prix',
                        ar: 'الجائزة الكبرى',
                    },
                    {
                        en: 'Jury Prize',
                        fr: 'Prix du jury',
                        ar: 'جائزة لجنة التحكيم',
                    },
                    {
                        en: 'Special Mention',
                        fr: 'Mention spéciale',
                        ar: 'تنويه خاص',
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
                                en="Details can be updated per edition."
                                fr="Les détails peuvent être mis à jour par édition."
                                ar="يمكن تحديث التفاصيل حسب الدورة."
                            />
                        </div>
                    </div>
                ))}
            </div>
        </SectionShell>
    );
}

export function TililaCriteriaSection() {
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
                    en="A transparent framework to assess impact and creative execution."
                    fr="Un cadre transparent pour évaluer l’impact et l’exécution créative."
                    ar="إطار واضح لتقييم الأثر وجودة التنفيذ الإبداعي."
                />
            }
        >
            <ul className="grid gap-3 text-sm text-tgray sm:grid-cols-2">
                {[
                    {
                        en: 'Representation and parity',
                        fr: 'Représentation et parité',
                        ar: 'التمثيل والتكافؤ',
                    },
                    {
                        en: 'Narrative and messaging',
                        fr: 'السرد والرسالة',
                        ar: 'السرد والرسائل',
                    },
                    {
                        en: 'Creativity and craft',
                        fr: 'الإبداع والجودة',
                        ar: 'الإبداع والإتقان',
                    },
                    {
                        en: 'Potential social impact',
                        fr: 'الأثر الاجتماعي المحتمل',
                        ar: 'الأثر الاجتماعي المحتمل',
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

export function TililaApplySection() {
    return (
        <SectionShell
            id="apply"
            title={
                <TransText
                    en="Apply / Submit a campaign"
                    fr="Déposer candidature"
                    ar="قدّم ترشحًا"
                />
            }
            subtitle={
                <TransText
                    en="Submit your campaign for the current edition."
                    fr="Soumettez votre campagne pour l’édition en cours."
                    ar="قدّم حملتك للدورة الحالية."
                />
            }
        >
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-tgray">
                    <TransText
                        en="Applications are managed per edition."
                        fr="Les candidatures sont gérées par édition."
                        ar="يتم إدارة الترشحات حسب الدورة."
                    />
                </div>
                <a
                    href="#archive"
                    className="inline-flex items-center justify-center rounded-full bg-beta-blue px-5 py-2 text-sm font-semibold text-twhite hover:opacity-90"
                >
                    <TransText
                        en="Browse editions"
                        fr="Parcourir les éditions"
                        ar="تصفح الدورات"
                    />
                </a>
            </div>
        </SectionShell>
    );
}

export function TililaFaqSection() {
    return (
        <SectionShell
            id="faq"
            title={<TransText en="FAQ" fr="FAQ" ar="الأسئلة الشائعة" />}
            subtitle={
                <TransText
                    en="Key answers for candidates and partners."
                    fr="Réponses essentielles pour les candidats et partenaires."
                    ar="أهم الإجابات للمرشحين والشركاء."
                />
            }
        >
            <div className="space-y-3">
                {[
                    {
                        qEn: 'Who can apply?',
                        qFr: 'Qui peut candidater ?',
                        qAr: 'من يمكنه الترشح؟',
                        aEn: 'Eligibility depends on the current edition rules.',
                        aFr: 'Les conditions dépendent des règles de l’édition en cours.',
                        aAr: 'تعتمد الشروط على قواعد الدورة الحالية.',
                    },
                    {
                        qEn: 'How are campaigns evaluated?',
                        qFr: 'Comment les campagnes sont-elles évaluées ?',
                        qAr: 'كيف يتم تقييم الحملات؟',
                        aEn: 'Using the published criteria: representation, narrative, craft, and impact.',
                        aFr: 'Selon les critères publiés : représentation, récit, exécution et impact.',
                        aAr: 'وفقًا للمعايير المنشورة: التمثيل، السرد، الإتقان، والأثر.',
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

export function TililaSponsorsSection() {
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
                    en="Organizations supporting the program and each edition."
                    fr="Organisations soutenant le programme et chaque édition."
                    ar="الجهات الداعمة للبرنامج ولكل دورة."
                />
            }
        >
            <div className="rounded-2xl border border-border bg-muted/30 p-6 text-sm text-tgray">
                <TransText
                    en="Sponsor logos and partner lists can be added here per edition."
                    fr="Les logos sponsors et listes de partenaires peuvent être ajoutés ici par édition."
                    ar="يمكن إضافة شعارات الرعاة وقوائم الشركاء هنا حسب الدورة."
                />
            </div>
        </SectionShell>
    );
}

