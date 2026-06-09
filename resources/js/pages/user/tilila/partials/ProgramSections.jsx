import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';
import RegulationCta from '@/components/program/RegulationCta';
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
            title={
                <TransText
                    en="Tilila Awards"
                    fr="Tilila Awards"
                    ar="تيليلا أووردز"
                />
            }
            subtitle={
                <TransText
                    en="Rewarding campaigns, brands and personalities that promote equity, diversity and inclusion."
                    fr="Récompenser les campagnes, marques et personnalités qui contribuent à promouvoir l’équité, la diversité et l’inclusion."
                    ar="تكريم الحملات والعلامات والشخصيات التي تعزز الإنصاف والتنوع والإدماج."
                />
            }
        >
            <p className="max-w-3xl text-sm leading-7 text-tgray">
                <TransText
                    en="Tilila Awards identifies and celebrates advertising work that challenges stereotypes and promotes a fairer, more inclusive society — with a focus on gender parity and disability inclusion."
                    fr="Les Tilila Awards identifient et célèbrent les créations publicitaires qui bousculent les stéréotypes et promeuvent une société plus juste et inclusive — avec une attention particulière à la parité et à l’inclusion des personnes en situation de handicap."
                    ar="تُكرّم تيليلا أووردز الأعمال الإعلانية التي تتحدى الصور النمطية وتعزز مجتمعًا أكثر عدالة وشمولية، مع تركيز على المساواة بين الجنسين وإدماج ذوي الإعاقة."
                />
            </p>
        </SectionShell>
    );
}

export function TililaWhyParticipateSection() {
    const items = [
        {
            en: 'Highlight your societal commitment',
            fr: 'Valoriser son engagement sociétal',
            ar: 'إبراز الالتزام المجتمعي',
        },
        {
            en: 'Gain recognition from an independent jury',
            fr: 'Faire reconnaître ses campagnes par un jury indépendant',
            ar: 'الحصول على اعتراف من لجنة تحكيم مستقلة',
        },
        {
            en: 'Benefit from national visibility',
            fr: 'Bénéficier d’une visibilité nationale',
            ar: 'الاستفادة من ظهور وطني',
        },
        {
            en: 'Join a community of engaged actors',
            fr: 'Rejoindre une communauté d’acteurs engagés',
            ar: 'الانضمام إلى مجتمع من الفاعلين الملتزمين',
        },
    ];
    return (
        <SectionShell
            id="why-participate"
            title={
                <TransText
                    en="Why participate?"
                    fr="Pourquoi participer ?"
                    ar="لماذا المشاركة؟"
                />
            }
        >
            <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((item) => (
                    <li
                        key={item.en}
                        className="rounded-2xl border border-border bg-background p-4 text-sm text-tgray"
                    >
                        <TransText en={item.en} fr={item.fr} ar={item.ar} />
                    </li>
                ))}
            </ul>
        </SectionShell>
    );
}

const TILILA_PRIZES = [
    {
        fr: 'Hommage Tilila',
        en: 'Hommage Tilila',
        ar: 'تكريم تيليلا',
        reward: 'Distinction honorifique — trophée',
    },
    {
        fr: 'Prix du Jury',
        en: 'Jury Prize',
        ar: 'جائزة لجنة التحكيم',
        reward: 'Trophée + espace pub 2M — 1 000 000 DH brut',
    },
    {
        fr: 'Prix d’Honneur',
        en: 'Honour Prize',
        ar: 'جائزة الشرف',
        reward: 'Trophée + espace pub 2M — 500 000 DH brut',
    },
    {
        fr: 'Communication Engagée — ONLINE',
        en: 'Engaged Communication — ONLINE',
        ar: 'تواصل ملتزم — رقمي',
        reward: 'Trophée + espace pub 2M — 250 000 DH brut',
    },
    {
        fr: 'Communication Engagée — OFFLINE',
        en: 'Engaged Communication — OFFLINE',
        ar: 'تواصل ملتزم — تقليدي',
        reward: 'Trophée + espace pub 2M — 250 000 DH brut',
    },
];

export function TililaPrizesSection() {
    return (
        <SectionShell
            id="prizes"
            title={
                <TransText
                    en="Categories & rewards"
                    fr="Les catégories"
                    ar="الفئات والمكافآت"
                />
            }
        >
            <div className="grid gap-4 sm:grid-cols-2">
                {TILILA_PRIZES.map((p) => (
                    <div
                        key={p.fr}
                        className="rounded-2xl border border-border bg-secondary p-5"
                    >
                        <div className="text-sm font-semibold text-tblack">
                            <TransText en={p.en} fr={p.fr} ar={p.ar} />
                        </div>
                        <p className="mt-2 text-sm text-tgray">{p.reward}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <RegulationCta href="/tilila/reglement" />
            </div>
        </SectionShell>
    );
}

export function TililaAdmissionSection() {
    return (
        <SectionShell
            id="admission"
            title={
                <TransText
                    en="Admission conditions"
                    fr="Conditions d’admission"
                    ar="شروط القبول"
                />
            }
        >
            <div className="space-y-4 text-sm leading-7 text-tgray">
                <TransText
                    fr={`Le concours est ouvert à tous les annonceurs marocains.

Sont éligibles les campagnes publicitaires diffusées en télévision, sur les supports digitaux, en affichage, en presse écrite ou en radio, en langue arabe, amazighe ou française, quel que soit le secteur d'activité concerné.

Les campagnes soumises doivent s'inscrire dans les valeurs portées par le programme Tilila et contribuer à promouvoir l'équité, la diversité et l'inclusion, notamment la parité femmes-hommes et/ou l'inclusion des personnes en situation de handicap.
`}
                    en={`The competition is open to all Moroccan advertisers.

Eligible entries are advertising campaigns broadcast on television, digital media, out-of-home, print or radio, in Arabic, Amazigh or French, regardless of the industry sector concerned.

Submitted campaigns must reflect the values promoted by the Tilila program and contribute to equity, diversity and inclusion, particularly gender parity and/or the inclusion of people with disabilities.
`}
                    ar={`المسابقة مفتوحة لجميع المعلنين المغاربة.

تُقبل الحملات الإعلانية التي تم بثها في التلفزيون أو على المنصات الرقمية أو في الإشهار الخارجي أو الصحافة المكتوبة أو الإذاعة، باللغة العربية أو الأمازيغية أو الفرنسية، بغض النظر عن القطاع المعني.

يجب أن تندرج الحملات المقدمة في إطار القيم التي يحملها برنامج تيليلا وأن تساهم في تعزيز الإنصاف والتنوع والإدماج، ولا سيما المساواة بين الجنسين و/أو إدماج الأشخاص في وضعية إعاقة.
`}
                />
            </div>
        </SectionShell>
    );
}

export function TililaJurySection() {
    return (
        <SectionShell
            id="jury"
            title={<TransText en="The jury" fr="Le Jury" ar="لجنة التحكيم" />}
        >
            <p className="max-w-3xl text-sm leading-7 text-tgray">
                <TransText
                    en="The Tilila Awards jury brings together recognized figures from media, communication, creation, institutions, research and civil society. It evaluates applications on creative quality, relevance, impact and contribution to EDI values."
                    fr="Le Jury des Tilila Awards est composé de personnalités reconnues issues des médias, de la communication, de la création, des institutions, de la recherche et de la société civile. Il évalue les candidatures sur la qualité créative, la pertinence, l’impact et la contribution aux valeurs d’équité, de diversité et d’inclusion."
                    ar="تضم لجنة تحكيم تيليلا أووردز شخصيات معروفة من الإعلام والاتصال والإبداع والمؤسسات والبحث والمجتمع المدني. تقيّم الترشحات من حيث الجودة الإبداعية والملاءمة والأثر والمساهمة في قيم الإنصاف والتنوع والإدماج."
                />
            </p>
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
                    <Link
                        href="/tilila/reglement"
                        className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-semibold text-tblack hover:bg-muted"
                    >
                        <TransText
                            en="Regulations"
                            fr="Règlement"
                            ar="النظام"
                        />
                    </Link>
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
        const label = item.linkLabel ?? {
            en: 'Learn more',
            fr: 'En savoir plus',
            ar: 'المزيد',
        };
        return (
            <div className={bodyClass}>
                <TransText en={item.a.en} fr={item.a.fr} ar={item.a.ar} />{' '}
                <Link
                    href={item.link}
                    className="font-semibold text-beta-blue hover:underline"
                >
                    <TransText en={label.en} fr={label.fr} ar={label.ar} />
                </Link>
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
                    en="Official answers about Tilila Awards, eligibility, submission, and awards."
                    fr="Réponses officielles sur les Tilila Awards, l’éligibilité, les candidatures et les prix."
                    ar="إجابات رسمية حول تيليلا أووردز، الأهلية، الترشح والجوائز."
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
                    en="Sponsors & Partners"
                    fr=" Sponsors & Partenaires"
                    ar=" الرعاة والشركاء"
                />
            }
            subtitle={
                <TransText
                    en="Tilila Awards by 2M — institutional and media partners, not traditional commercial sponsors."
                    fr="Tilila Awards par 2M — partenaires institutionnels et médias, sans sponsors commerciaux classiques."
                    ar="تrophي تيليلا من 2M — شركاء مؤسسات وإعلام، وليس رعاة تجاريين تقليديين."
                />
            }
        >
            <div className="max-w-3xl rounded-2xl border border-gold/25 bg-linear-to-br from-gold/5 to-beta-blue/5 p-6 text-sm leading-relaxed text-tgray">
                <TransText
                    en="Tilila is mainly an initiative of 2M through its Comité Parité et Diversité. It does not rely on traditional commercial sponsors like many events, but on strong institutional and media partners regularly mentioned in official posts and ceremonies."
                    fr="Tilila est avant tout une initiative de 2M via son Comité Parité et Diversité. Les Tilila Awards ne s’appuient pas sur des sponsors commerciaux classiques comme beaucoup d’événements, mais sur des partenaires institutionnels et médias solides, régulièrement cités dans les communications et cérémonies officielles."
                    ar="تيليلا مبادرة أساساً من 2M عبر لجنة المساواة والتنوع. لا تعتمد تيليلا أووردز على رعاة تجاريين تقليديين كما في كثير من الفعاليات، بل على شركاء مؤسساتيين وإعلاميين قويين يُذكرون بانتظام في المنشورات والحفلات الرسمية."
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
                            en="The driving force behind Tilila Awards and its commitment to parity, diversity, and responsible advertising."
                            fr="La force motrice des Tilila Awards et de son engagement pour la parité, la diversité et une publicité responsable."
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
                            en="Consistent across editions — main partners of Tilila Awards."
                            fr="Présents sur les éditions — partenaires principaux des Tilila Awards."
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
