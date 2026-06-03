import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';
import { PartnerLogoTile, PartnerTier } from '@/components/PartnerSection';
import { TILILAB_FAQ_ITEMS } from '@/data/tililab-faq';
import { TILILAB_JURY_EDITION_NOTES } from '@/data/tililab-jury';
import { TILILAB_LOGO } from '@/data/tilila-brand-logos';
import {
    TILILAB_MEDIA_PARTNERS,
    TILILAB_ORGANISER,
    TILILAB_PROGRAM_PARTNERS,
} from '@/data/tililab-partners';

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

export function TililabConceptSection() {
    return (
        <SectionShell
            id="concept"
            title={<TransText en="Concept" fr="Concept" ar="المفهوم" />}
            subtitle={
                <TransText
                    en="A creative bootcamp by 2M for young talents, alongside Trophée Tilila."
                    fr="Un bootcamp créatif par 2M pour les jeunes talents, en marge du Trophée Tilila."
                    ar="معسكر إبداعي من 2M للشباب، إلى جانب تروفي تيليلا."
                />
            }
        >
            <div className="space-y-6 rounded-2xl border border-border bg-background p-6 text-sm leading-relaxed text-tgray">
                <p>
                    <TransText
                        en="Tililab is more than a competition: it is a movement toward better representation in advertising. Young creatives are challenged to design narratives and visual strategies that respect parity, diversity, and inclusion."
                        fr="Tililab est plus qu’un concours : c’est un mouvement vers une meilleure représentation dans la publicité. Les jeunes créatifs sont mis au défi de concevoir des récits et stratégies visuelles respectueux de la parité, de la diversité et de l’inclusion."
                        ar="تيليلاب أكثر من مسابقة: حركة نحو تمثيل أفضل في الإعلان. يُتحدى المبدعون الشباب لصياغة سرديات واستراتيجيات بصرية تحترم المساواة والتنوع والإدماج."
                    />
                </p>
                <div>
                    <div className="font-semibold text-tblack">
                        <TransText
                            en="Who can apply?"
                            fr="Qui peut postuler ?"
                            ar="من يمكنه التقديم؟"
                        />
                    </div>
                    <ul className="mt-3 list-inside list-disc space-y-2">
                        <li>
                            <TransText
                                en="Young creatives under 30 years old"
                                fr="Jeunes créatifs de moins de 30 ans"
                                ar="مبدعون شباب دون 30 سنة"
                            />
                        </li>
                        <li>
                            <TransText
                                en="Creative and communication backgrounds"
                                fr="Profils création et communication"
                                ar="خلفيات إبداعية واتصال"
                            />
                        </li>
                        <li>
                            <TransText
                                en="Teams of 1–3 people (design, illustration, copywriting, messaging)"
                                fr="Équipes de 1 à 3 (design, illustration, rédaction, messaging)"
                                ar="فرق من 1 إلى 3 (تصميم، رسم، كتابة، رسائل)"
                            />
                        </li>
                    </ul>
                </div>
                <div>
                    <div className="font-semibold text-tblack">
                        <TransText
                            en="Program journey"
                            fr="Parcours du programme"
                            ar="مسار البرنامج"
                        />
                    </div>
                    <ul className="mt-3 list-inside list-disc space-y-2">
                        <li>
                            <TransText
                                en="National call for applications"
                                fr="Appel national à candidatures"
                                ar="نداء وطني للترشح"
                            />
                        </li>
                        <li>
                            <TransText
                                en="Pre-bootcamp selection"
                                fr="Présélection pré-bootcamp"
                                ar="فرز قبل المعسكر"
                            />
                        </li>
                        <li>
                            <TransText
                                en="Intensive bootcamp in Marrakech with professionals"
                                fr="Bootcamp intensif à Marrakech avec des professionnels"
                                ar="معسكر مكثف بمراكش مع محترفين"
                            />
                        </li>
                        <li>
                            <TransText
                                en="Final spot production & winner chosen by the Tilila jury"
                                fr="Production du spot final & lauréat choisi par le jury Tilila"
                                ar="إنتاج الإعلان النهائي واختيار الفائز من لجنة تيليلا"
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </SectionShell>
    );
}

export function TililabPrizesSection() {
    return (
        <SectionShell
            id="prizes"
            title={<TransText en="Rewards" fr="Récompenses" ar="المكافآت" />}
            subtitle={
                <TransText
                    en="What Tililab winners receive from 2M and partners."
                    fr="Ce que reçoivent les lauréats Tililab de 2M et ses partenaires."
                    ar="ما يحصل عليه فائزو تيليلاب من 2M والشركاء."
                />
            }
        >
            <div className="grid gap-4 sm:grid-cols-2">
                {[
                    {
                        en: 'Tililab trophy',
                        fr: 'Trophée Tililab',
                        ar: 'كأس تيليلاب',
                        descEn: 'Official recognition of the winning creative spot.',
                        descFr: 'Reconnaissance officielle du spot créatif gagnant.',
                        descAr: 'تقدير رسمي للإعلان الإبداعي الفائز.',
                    },
                    {
                        en: 'Professional equipment',
                        fr: 'Matériel professionnel',
                        ar: 'معدات مهنية',
                        descEn: 'Equipment offered by 2M to support production.',
                        descFr: 'Matériel offert par 2M pour soutenir la production.',
                        descAr: 'معدات تقدمها 2M لدعم الإنتاج.',
                    },
                    {
                        en: 'Jooj incubator',
                        fr: 'Incubation Jooj',
                        ar: 'حاضنة Jooj',
                        descEn: 'Incubation in Jooj, 2M’s creative incubator.',
                        descFr: 'Incubation dans Jooj, l’incubateur créatif de 2M.',
                        descAr: 'احتضان في Jooj، حاضنة 2M الإبداعية.',
                    },
                    {
                        en: 'Broadcast & visibility',
                        fr: 'Diffusion & visibilité',
                        ar: 'بث وظهور',
                        descEn: 'Winning spot aired on 2M channels and social media.',
                        descFr: 'Diffusion du spot sur les antennes et réseaux 2M.',
                        descAr: 'بث الإعلان على قنوات 2M ووسائل التواصل.',
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
                                en={p.descEn}
                                fr={p.descFr}
                                ar={p.descAr}
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
                    en="How projects are reviewed during the bootcamp and final jury."
                    fr="Comment les projets sont évalués pendant le bootcamp et devant le jury final."
                    ar="كيف تُقيَّم المشاريع خلال المعسكر ولدى لجنة التحكيم."
                />
            }
        >
            <ul className="grid gap-3 text-sm text-tgray sm:grid-cols-2">
                {[
                    {
                        en: 'Creative idea & insight',
                        fr: 'Idée créative & insight',
                        ar: 'فكرة إبداعية ورؤية',
                    },
                    {
                        en: 'Parity, diversity & inclusion',
                        fr: 'Parité, diversité & inclusion',
                        ar: 'مساواة وتنوع وإدماج',
                    },
                    {
                        en: 'Craft & production quality',
                        fr: 'Exécution & qualité de production',
                        ar: 'إتقان وجودة الإنتاج',
                    },
                    {
                        en: 'Emotional impact & social message',
                        fr: 'Impact émotionnel & message social',
                        ar: 'أثر عاطفي ورسالة اجتماعية',
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

export function TililabJurySection({ editions = [] }) {
    const sorted = [...(Array.isArray(editions) ? editions : [])].sort(
        (a, b) => Number(b.year) - Number(a.year),
    );

    return (
        <SectionShell
            id="jury"
            title={<TransText en="Jury" fr="Jury" ar="لجنة التحكيم" />}
            subtitle={
                <TransText
                    en="Main jury members by Tililab edition. The final winner is chosen by the Trophée Tilila jury during the awards ceremony."
                    fr="Principaux membres du jury par édition Tililab. Le lauréat final est choisi par le jury du Trophée Tilila lors de la cérémonie."
                    ar="أعضاء لجنة التحكيم الرئيسيون حسب دورة تيليلاب. يُختار الفائز النهائي من لجنة تروفي تيليلا خلال الحفل."
                />
            }
        >
            <div className="max-w-3xl rounded-2xl border border-gold/25 bg-linear-to-br from-gold/5 to-beta-blue/5 p-6 text-sm leading-relaxed text-tgray">
                <TransText
                    en="Tililab editions often share the Trophée Tilila jury for the final decision. Below are the main names mentioned in official communications, edition by edition."
                    fr="Les éditions Tililab partagent souvent le jury du Trophée Tilila pour la décision finale. Ci-dessous, les principaux noms cités dans les communications officielles, édition par édition."
                    ar="غالباً ما تشترك دورات تيليلاب في لجنة تروفي تيليلا للقرار النهائي. فيما يلي الأسماء الرئيسية الواردة في التواصل الرسمي، دورة بدورة."
                />
            </div>

            <div className="mt-8 space-y-6">
                {sorted.length === 0 ? (
                    <p className="text-sm text-tgray">
                        <TransText
                            en="Jury information will appear here once editions are published."
                            fr="Les informations jury apparaîtront ici une fois les éditions publiées."
                            ar="ستظهر معلومات اللجنة هنا عند نشر الدورات."
                        />
                    </p>
                ) : (
                    sorted.map((edition) => {
                        const year = Number(edition.year);
                        const jury = Array.isArray(edition.jury)
                            ? edition.jury
                            : [];
                        const note = TILILAB_JURY_EDITION_NOTES[year];
                        const label = edition.edition_label ?? {
                            en: `${year}`,
                            fr: `${year}`,
                            ar: `${year}`,
                        };
                        const editionId = edition.id;
                        const hasEditionPage =
                            editionId && !String(editionId).startsWith('hist-');

                        return (
                            <div
                                key={editionId ?? year}
                                className="rounded-2xl border border-border bg-background p-6 shadow-sm ring-1 ring-border/50"
                            >
                                <p className="text-xs font-bold tracking-[0.18em] text-beta-blue uppercase">
                                    <TransText
                                        en={label.en ?? ''}
                                        fr={label.fr ?? ''}
                                        ar={label.ar ?? ''}
                                    />
                                </p>
                                {note ? (
                                    <p className="mt-2 text-sm text-tgray">
                                        <TransText
                                            en={note.en}
                                            fr={note.fr}
                                            ar={note.ar}
                                        />
                                    </p>
                                ) : null}

                                {jury.length === 0 ? (
                                    <p className="mt-4 text-sm text-tgray italic">
                                        <TransText
                                            en="Not fully detailed in public communications."
                                            fr="Non détaillé publiquement de façon exhaustive."
                                            ar="غير مفصّل علناً بشكل كامل."
                                        />
                                    </p>
                                ) : (
                                    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {jury.map((person, idx) => (
                                            <li
                                                key={`${person?.full_name ?? 'juror'}-${idx}`}
                                                className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm"
                                            >
                                                <div className="text-sm font-semibold text-tblack">
                                                    {person?.full_name ?? ''}
                                                </div>
                                                {(person?.bio?.en ||
                                                    person?.bio?.fr) && (
                                                    <div className="mt-1 text-xs text-tgray">
                                                        <TransText
                                                            en={
                                                                person.bio
                                                                    ?.en ?? ''
                                                            }
                                                            fr={
                                                                person.bio
                                                                    ?.fr ?? ''
                                                            }
                                                            ar={
                                                                person.bio
                                                                    ?.ar ?? ''
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {hasEditionPage ? (
                                    <Link
                                        href={`/tililab/editions/${editionId}#jury`}
                                        className="mt-4 inline-block text-sm font-semibold text-beta-blue hover:underline"
                                    >
                                        <TransText
                                            en="Open edition page"
                                            fr="Voir la fiche édition"
                                            ar="صفحة الدورة"
                                        />
                                    </Link>
                                ) : null}
                            </div>
                        );
                    })
                )}
            </div>
        </SectionShell>
    );
}

function TililabFaqAnswer({ item }) {
    const bodyClass = [
        'mt-3 text-sm leading-relaxed text-tgray',
        item.preline ? 'whitespace-pre-line' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={bodyClass}>
            <TransText en={item.a.en} fr={item.a.fr} ar={item.a.ar} />
            {item.link ? (
                <>
                    {' '}
                    <a
                        href={item.link}
                        className="font-semibold text-beta-blue hover:underline"
                    >
                        <TransText
                            en={item.linkLabel?.en ?? 'Form'}
                            fr={item.linkLabel?.fr ?? 'Formulaire'}
                            ar={item.linkLabel?.ar ?? 'الاستمارة'}
                        />
                    </a>
                </>
            ) : null}
            {item.externalLink ? (
                <div className="mt-2">
                    <a
                        href={item.externalLink}
                        className="font-semibold text-beta-blue hover:underline"
                    >
                        <TransText
                            en={item.externalLabel?.en ?? 'Link'}
                            fr={item.externalLabel?.fr ?? 'Lien'}
                            ar={item.externalLabel?.ar ?? 'رابط'}
                        />
                    </a>
                </div>
            ) : null}
        </div>
    );
}

export function TililabFaqSection() {
    return (
        <SectionShell
            id="faq"
            title={<TransText en="FAQ" fr="FAQ" ar="الأسئلة الشائعة" />}
            subtitle={
                <TransText
                    en="Everything candidates need to know about Tililab."
                    fr="L’essentiel pour les candidats Tililab."
                    ar="ما يحتاج المرشحون معرفته عن تيليلاب."
                />
            }
        >
            <div className="space-y-3">
                {TILILAB_FAQ_ITEMS.map((item, index) => (
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
                        <TililabFaqAnswer item={item} />
                    </details>
                ))}
            </div>
        </SectionShell>
    );
}

function TililabPartnerSubtitle({ partner }) {
    return (
        <>
            <TransText
                en={partner.role.en}
                fr={partner.role.fr}
                ar={partner.role.ar}
            />
            <span className="mt-1 block font-medium text-beta-blue">
                <TransText
                    en={partner.edition.en}
                    fr={partner.edition.fr}
                    ar={partner.edition.ar}
                />
            </span>
        </>
    );
}

export function TililabSponsorsSection() {
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
                    en="Concours Tililab by 2M — bootcamp hosts, incubation, and media partners across editions."
                    fr="Concours Tililab par 2M — hôtes du bootcamp, incubation et partenaires médias selon les éditions."
                    ar="مسابقة تيليلاب من 2M — مضيفو المعسكر، الاحتضان وشركاء الإعلام حسب الدورات."
                />
            }
        >
            <div className="max-w-3xl rounded-2xl border border-gold/25 bg-linear-to-br from-gold/5 to-beta-blue/5 p-6 text-sm leading-relaxed text-tgray">
                <TransText
                    en="Tililab is a 2M initiative for young creatives under 30. It relies on program partners (pre-bootcamp host, winner incubation) and recurring media partners — not traditional commercial sponsors."
                    fr="Tililab est une initiative 2M pour les jeunes créatifs de moins de 30 ans. Le concours s’appuie sur des partenaires de programme (hôte du pré-bootcamp, incubation du lauréat) et des partenaires médias récurrents — sans sponsors commerciaux classiques."
                    ar="تيليلاب مبادرة من 2M للمبدعين دون 30 سنة. تعتمد على شركاء البرنامج (مضيف ما قبل المعسكر، احتضان الفائز) وشركاء إعلام متكررين — وليس رعاة تجاريين تقليديين."
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
                            en="2M — Concours Tililab"
                            fr="2M — Concours Tililab"
                            ar="2M — مسابقة تيليلاب"
                        />
                    }
                    description={
                        <TransText
                            en={TILILAB_ORGANISER.role.en}
                            fr={TILILAB_ORGANISER.role.fr}
                            ar={TILILAB_ORGANISER.role.ar}
                        />
                    }
                >
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <div className="flex justify-center rounded-2xl border border-border bg-white px-6 py-6 shadow-sm">
                            <img
                                src={TILILAB_LOGO}
                                alt="Tililab logo"
                                className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <div className="flex flex-1 justify-center rounded-2xl border border-border bg-white px-8 py-8 shadow-sm">
                            <img
                                src={TILILAB_ORGANISER.logoUrl}
                                alt="2M logo"
                                className="h-24 w-full max-w-xs object-contain sm:h-28"
                                loading="eager"
                                decoding="async"
                            />
                        </div>
                    </div>
                </PartnerTier>

                <PartnerTier
                    badge={
                        <TransText
                            en="Program partners"
                            fr="Partenaires du programme"
                            ar="شركاء البرنامج"
                        />
                    }
                    title={
                        <TransText
                            en="Bootcamp & incubation"
                            fr="Bootcamp & incubation"
                            ar="المعسكر والاحتضان"
                        />
                    }
                    description={
                        <TransText
                            en="Key partners who host pre-selection or support the laureate after the competition."
                            fr="Partenaires clés qui accueillent la présélection ou accompagnent le lauréat après le concours."
                            ar="شركاء أساسيون يستضيفون التصفية أو يدعمون الفائز بعد المسابقة."
                        />
                    }
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {TILILAB_PROGRAM_PARTNERS.map((partner) => (
                            <PartnerLogoTile
                                key={partner.id}
                                name={partner.name}
                                logoUrl={partner.logoUrl}
                                tall
                                subtitle={
                                    <TililabPartnerSubtitle partner={partner} />
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
                            en="Media & communication partners"
                            fr="Partenaires médias & communication"
                            ar="شركاء إعلام واتصال"
                        />
                    }
                    title={
                        <TransText
                            en="5th edition (2025) and recent editions"
                            fr="5e édition (2025) et éditions récentes"
                            ar="الدورة الخامسة (2025) والدورات الأخيرة"
                        />
                    }
                    description={
                        <TransText
                            en="Supporting media partners — involvement may vary slightly per edition; roles and highlights reflect official Tililab partnerships."
                            fr="Partenaires médias de soutien — l’implication peut varier légèrement selon l’édition ; rôles et éditions selon les partenariats officiels Tililab."
                            ar="شركاء إعلام داعمون — قد تختلف المشاركة قليلاً حسب الدورة؛ الأدوار والدورات وفق شراكات تيليلاب الرسمية."
                        />
                    }
                >
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {TILILAB_MEDIA_PARTNERS.map((partner) => (
                            <PartnerLogoTile
                                key={partner.id}
                                name={partner.name}
                                logoUrl={partner.logoUrl}
                                subtitle={
                                    <TililabPartnerSubtitle partner={partner} />
                                }
                            />
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-tgray">
                        <TransText
                            en="Lionsgeek hosted the pre-bootcamp for the 5th edition (2025)."
                            fr="Lionsgeek a accueilli le pré-bootcamp pour la 5e édition (2025)."
                            ar="استضاف Lionsgeek ما قبل المعسكر للدورة الخامسة (2025)."
                        />
                    </p>
                </PartnerTier>
            </div>
        </SectionShell>
    );
}
