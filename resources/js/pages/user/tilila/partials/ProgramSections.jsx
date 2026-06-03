import TransText from '@/components/TransText';
import { PartnerLogoTile, PartnerTier } from '@/components/PartnerSection';
import { TILILA_FAQ_ITEMS } from '@/data/tilila-faq';
import {
    TILILA_INSTITUTIONAL_PARTNERS,
    TILILA_MEDIA_PARTNERS,
    TILILA_ORGANISER_LOGO,
} from '@/data/tilila-partners-logos';

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

export function TililaApplySection({ onOpenForm }) {
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
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-tgray">
                    <TransText
                        en="Applications are managed per edition. Use the secure form to send your file."
                        fr="Les candidatures sont gérées par édition. Utilisez le formulaire sécurisé pour envoyer votre dossier."
                        ar="يتم إدارة الترشحات حسب الدورة. استخدم الاستمارة الآمنة لإرسال ملفك."
                    />
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                    {typeof onOpenForm === 'function' ? (
                        <button
                            type="button"
                            onClick={() => onOpenForm()}
                            className="inline-flex items-center justify-center rounded-full bg-beta-blue px-5 py-2 text-sm font-semibold text-twhite hover:opacity-90"
                        >
                            <TransText
                                en="Open form"
                                fr="Ouvrir le formulaire"
                                ar="افتح الاستمارة"
                            />
                        </button>
                    ) : null}
                    <a
                        href="#past-editions"
                        className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-semibold text-tblack hover:bg-muted"
                    >
                        <TransText
                            en="Past editions"
                            fr="Éditions passées"
                            ar="الدورات السابقة"
                        />
                    </a>
                </div>
            </div>
        </SectionShell>
    );
}

function TililaFaqAnswer({ item }) {
    const bodyClass = [
        'mt-3 text-sm leading-relaxed text-tgray',
        item.preline ? 'whitespace-pre-line' : '',
    ]
        .filter(Boolean)
        .join(' ');

    if (item.email) {
        return (
            <div className={bodyClass}>
                <TransText en={item.a.en} fr={item.a.fr} ar={item.a.ar} />{' '}
                <a
                    href={`mailto:${item.email}`}
                    className="font-semibold text-beta-blue hover:underline"
                >
                    {item.email}
                </a>
            </div>
        );
    }

    if (item.link) {
        return (
            <div className={bodyClass}>
                <TransText en={item.a.en} fr={item.a.fr} ar={item.a.ar} />{' '}
                <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-beta-blue hover:underline"
                >
                    www.tropheetilila.ma
                </a>
            </div>
        );
    }

    return (
        <div className={bodyClass}>
            <TransText en={item.a.en} fr={item.a.fr} ar={item.a.ar} />
        </div>
    );
}

export function TililaFaqSection() {
    return (
        <SectionShell
            id="faq"
            title={<TransText en="FAQ" fr="FAQ" ar="الأسئلة الشائعة" />}
            subtitle={
                <TransText
                    en="Official answers about Trophée Tilila, eligibility, submission, and awards."
                    fr="Réponses officielles sur le Trophée Tilila, l’éligibilité, les candidatures et les prix."
                    ar="إجابات رسمية حول تروفي تيليلا، الأهلية، الترشح والجوائز."
                />
            }
        >
            <div className="space-y-3">
                {TILILA_FAQ_ITEMS.map((item, index) => (
                    <details
                        key={item.id}
                        className="rounded-2xl border border-border bg-background p-5"
                        open={index === 0}
                    >
                        <summary className="cursor-pointer text-sm font-semibold text-tblack">
                            <TransText
                                en={item.q.en}
                                fr={item.q.fr}
                                ar={item.q.ar}
                            />
                        </summary>
                        <TililaFaqAnswer item={item} />
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
                    en="Complete list of sponsors & partners"
                    fr="Liste complète des sponsors & partenaires"
                    ar="القائمة الكاملة للرعاة والشركاء"
                />
            }
            subtitle={
                <TransText
                    en="Trophée Tilila by 2M — institutional and media partners, not traditional commercial sponsors."
                    fr="Trophée Tilila par 2M — partenaires institutionnels et médias, sans sponsors commerciaux classiques."
                    ar="تrophي تيليلا من 2M — شركاء مؤسسات وإعلام، وليس رعاة تجاريين تقليديين."
                />
            }
        >
            <div className="max-w-3xl rounded-2xl border border-gold/25 bg-linear-to-br from-gold/5 to-beta-blue/5 p-6 text-sm leading-relaxed text-tgray">
                <TransText
                    en="Tilila is mainly an initiative of 2M through its Comité Parité et Diversité. It does not rely on traditional commercial sponsors like many events, but on strong institutional and media partners regularly mentioned in official posts and ceremonies."
                    fr="Tilila est avant tout une initiative de 2M via son Comité Parité et Diversité. Le Trophée ne s’appuie pas sur des sponsors commerciaux classiques comme beaucoup d’événements, mais sur des partenaires institutionnels et médias solides, régulièrement cités dans les communications et cérémonies officielles."
                    ar="تيليلا مبادرة أساساً من 2M عبر لجنة المساواة والتنوع. لا يعتمد التروفي على رعاة تجاريين تقليديين كما في كثير من الفعاليات، بل على شركاء مؤسساتيين وإعلاميين قويين يُذكرون بانتظام في المنشورات والحفلات الرسمية."
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <PartnerTier
                    badge={
                        <TransText
                            en="Main organiser"
                            fr="Organisateur principal"
                            ar="المنظم الرئيسي"
                        />
                    }
                    title={
                        <TransText
                            en="2M — Comité Parité et Diversité"
                            fr="2M — Comité Parité et Diversité"
                            ar="2M — لجنة المساواة والتنوع"
                        />
                    }
                    description={
                        <TransText
                            en="The driving force behind Trophée Tilila and its commitment to parity, diversity, and responsible advertising."
                            fr="La force motrice du Trophée Tilila et de son engagement pour la parité, la diversité et une publicité responsable."
                            ar="القوة الدافعة وراء تروفي تيليلا والتزامه بالمساواة والتنوع والإعلان المسؤول."
                        />
                    }
                >
                    <div className="flex justify-center rounded-2xl border border-border bg-white px-8 py-8 shadow-sm">
                        <img
                            src={TILILA_ORGANISER_LOGO}
                            alt="2M logo"
                            className="h-24 w-full max-w-xs object-contain sm:h-28"
                            loading="eager"
                            decoding="async"
                        />
                    </div>
                </PartnerTier>

                <PartnerTier
                    badge={
                        <TransText
                            en="Strategic partners"
                            fr="Partenaires stratégiques"
                            ar="الشركاء الاستراتيجيون"
                        />
                    }
                    title={
                        <TransText
                            en="Institutional partners (core)"
                            fr="Partenaires institutionnels (cœur)"
                            ar="الشركاء المؤسساتيون (الأساس)"
                        />
                    }
                    description={
                        <TransText
                            en="Consistent across editions — main partners of the Trophée."
                            fr="Présents sur les éditions — partenaires principaux du Trophée."
                            ar="حاضرون في الدورات — الشركاء الرئيسيون للتروفي."
                        />
                    }
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {TILILA_INSTITUTIONAL_PARTNERS.map((partner) => (
                            <PartnerLogoTile
                                key={partner.id}
                                name={partner.name}
                                logoUrl={partner.logoUrl}
                                tall
                                subtitle={
                                    <TransText
                                        en={partner.subtitle.en}
                                        fr={partner.subtitle.fr}
                                        ar={partner.subtitle.ar}
                                    />
                                }
                            />
                        ))}
                    </div>
                </PartnerTier>
            </div>

            <div className="mt-6">
                <PartnerTier
                    badge={
                        <TransText
                            en="Media & other partners"
                            fr="Partenaires médias & autres"
                            ar="شركاء إعلام وآخرون"
                        />
                    }
                    title={
                        <TransText
                            en="7th edition (2025) and recent editions"
                            fr="7e édition (2025) et éditions récentes"
                            ar="الدورة السابعة (2025) والدورات الأخيرة"
                        />
                    }
                    description={
                        <TransText
                            en="Supporting media partners — the list may vary slightly per edition; these are the most recurring names in official communications."
                            fr="Partenaires médias de soutien — la liste peut varier légèrement selon l’édition ; ce sont les noms les plus récurrents dans les communications officielles."
                            ar="شركاء إعلام داعمون — قد تختلف القائمة قليلاً حسب الدورة؛ هذه أكثر الأسماء تكراراً في التواصل الرسمي."
                        />
                    }
                >
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {TILILA_MEDIA_PARTNERS.map((partner) => (
                            <PartnerLogoTile
                                key={partner.id}
                                name={partner.name}
                                logoUrl={partner.logoUrl}
                            />
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-tgray">
                        <TransText
                            en="Tswera is listed among recurring partners; add its logo under public/assets when available."
                            fr="Tswera figure parmi les partenaires récurrents ; son logo pourra être ajouté dans public/assets lorsqu’il sera disponible."
                            ar="تسويرة ضمن الشركاء المتكررين؛ يمكن إضافة شعارها في public/assets عند توفرها."
                        />
                    </p>
                </PartnerTier>
            </div>
            {/* 
            <div className="mt-8 rounded-2xl border border-border bg-tblack px-6 py-5 text-sm text-twhite">
                <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">
                    <TransText en="Summary" fr="Synthèse" ar="ملخص" />
                </div>
                <dl className="mt-4 space-y-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                        <dt className="shrink-0 font-semibold text-gold sm:w-44">
                            <TransText
                                en="Main organiser"
                                fr="Organisateur"
                                ar="المنظم"
                            />
                        </dt>
                        <dd className="text-twhite/85">
                            <TransText
                                en="2M — Comité Parité et Diversité"
                                fr="2M — Comité Parité et Diversité"
                                ar="2M — لجنة المساواة والتنوع"
                            />
                        </dd>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                        <dt className="shrink-0 font-semibold text-gold sm:w-44">
                            <TransText
                                en="Strategic partners"
                                fr="Partenaires stratégiques"
                                ar="شركاء استراتيجيون"
                            />
                        </dt>
                        <dd className="text-twhite/85">UACC + GAM</dd>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                        <dt className="shrink-0 font-semibold text-gold sm:w-44">
                            <TransText
                                en="Media partners"
                                fr="Partenaires médias"
                                ar="شركاء إعلام"
                            />
                        </dt>
                        <dd className="text-twhite/85">
                            <TransText
                                en="Les Impériales, MFM Radio / Radio 2M, Tiqqa, SNRT, Médias24, Le Site Info, Tswera, U Radio, Media Marketing Magazine — among others, depending on the edition."
                                fr="Les Impériales, MFM Radio / Radio 2M, Tiqqa, SNRT, Médias24, Le Site Info, Tswera, U Radio, Media Marketing Magazine — entre autres, selon l’édition."
                                ar="Les Impériales وMFM Radio / Radio 2M وTiqqa وSNRT وMédias24 وLe Site Info وTswera وU Radio وMedia Marketing Magazine — وغيرها حسب الدورة."
                            />
                        </dd>
                    </div>
                </dl>
            </div> */}
        </SectionShell>
    );
}
