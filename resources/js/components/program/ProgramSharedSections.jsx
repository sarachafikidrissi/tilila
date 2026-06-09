import { Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import TransText from '@/components/TransText';
import { PartnerLogoTile } from '@/components/PartnerSection';
import RegulationCta from '@/components/program/RegulationCta';
import { PROGRAM_PARTNERS } from '@/data/program-partners';
import { useTranslation } from '@/contexts/TranslationContext';

function SectionShell({ id, title, subtitle, children, className = '' }) {
    return (
        <section
            id={id}
            className={`mx-auto max-w-7xl px-4 py-10 ${className}`}
        >
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

export function ProgramHeroSection({ program }) {
    const isTilila = program === 'tilila';

    return (
        <section className="bg-[radial-gradient(circle_at_top_left,#dff2ff_0%,#ffffff_45%,#f5fbff_100%)] py-14 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
                <p className="text-xs font-semibold tracking-[0.3em] text-tgray uppercase">
                    <TransText en="TILILA" fr="TILILA" ar="تيليلا" />
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-tblack sm:text-4xl">
                    {isTilila ? (
                        <TransText
                            en="Tilila Awards"
                            fr="Tilila Awards"
                            ar="تيليلا أووردز"
                        />
                    ) : (
                        <TransText en="Tililab" fr="Tililab" ar="تيليلاب" />
                    )}
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-tgray sm:text-base">
                    <TransText
                        en="Every creation tells a story. Every story shapes a perspective. Every new perspective can help society evolve."
                        fr="Chaque création raconte une histoire. Chaque histoire façonne un regard. Chaque nouveau regard peut faire évoluer une société."
                        ar="كل إبداع يحكي قصة. كل قصة تشكّل نظرة. وكل نظرة جديدة يمكن أن تساهم في تطور المجتمع."
                    />
                </p>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-tgray">
                    <TransText
                        en="Through Tilila Awards and Tililab, SOREAD 2M celebrates those who put creativity at the service of change."
                        fr="À travers les Tilila Awards et Tililab, SOREAD 2M célèbre celles et ceux qui choisissent de mettre la créativité au service du changement."
                        ar="عبر تيليلا أووردز وتيليلاب، تحتفي SOREAD 2M بمن يضعون الإبداع في خدمة التغيير."
                    />
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        href={isTilila ? '/tililab' : '/tilila'}
                        className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-tblack hover:bg-muted"
                    >
                        {isTilila ? (
                            <TransText
                                en="Discover Tililab"
                                fr="Découvrir Tililab"
                                ar="اكتشف تيليلاب"
                            />
                        ) : (
                            <TransText
                                en="Discover Tilila Awards"
                                fr="Découvrir Tilila Awards"
                                ar="اكتشف تيليلا أووردز"
                            />
                        )}
                    </Link>
                    <RegulationCta
                        href={
                            isTilila
                                ? '/tilila/reglement'
                                : '/tililab/reglement'
                        }
                    />
                </div>
            </div>
        </section>
    );
}

function TililaStatsCard() {
    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-tblack">Tilila Awards</h3>
            <ul className="mt-4 space-y-2 text-sm text-tgray">
                <li>
                    7 <TransText en="editions" fr="éditions" ar="دورات" />
                </li>
                <li>
                    <TransText
                        en="250+ candidate campaigns"
                        fr="Plus de 250 campagnes candidates"
                        ar="أكثر من 250 حملة مرشحة"
                    />
                </li>
                <li>
                    <TransText
                        en="50+ shortlisted campaigns"
                        fr="Plus de 50 campagnes shortlistées"
                        ar="أكثر من 50 حملة في القائمة القصيرة"
                    />
                </li>
                <li>
                    <TransText
                        en="13 awarded campaigns"
                        fr="13 campagnes primées"
                        ar="13 حملة فائزة"
                    />
                </li>
                <li>
                    <TransText
                        en="26 jury members mobilized"
                        fr="26 membres de jury mobilisés"
                        ar="26 عضوًا في لجنة التحكيم"
                    />
                </li>
                <li>
                    <TransText
                        en="7 Hommage Tilila awards"
                        fr="7 Hommages Tilila décernés"
                        ar="7 تكريمات تيليلا"
                    />
                </li>
            </ul>
        </div>
    );
}

function TililabStatsCard() {
    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-tblack">Tililab</h3>
            <ul className="mt-4 space-y-2 text-sm text-tgray">
                <li>
                    5 <TransText en="editions" fr="éditions" ar="دورات" />
                </li>
                <li>
                    <TransText
                        en="Dozens of young creators supported"
                        fr="Plusieurs dizaines de jeunes créateurs accompagnés"
                        ar="عشرات المبدعين الشباب المرافقين"
                    />
                </li>
                <li>
                    <TransText
                        en="30+ projects produced"
                        fr="Plus de 30 projets produits"
                        ar="أكثر من 30 مشروعًا منتجًا"
                    />
                </li>
                <li>
                    <TransText
                        en="Hundreds of hours of training and mentoring"
                        fr="Des centaines d'heures de formation et de mentorat"
                        ar="مئات الساعات من التدريب والإرشاد"
                    />
                </li>
            </ul>
        </div>
    );
}

export function ProgramStatsSection({ program }) {
    const isTilila = program === 'tilila';

    return (
        <SectionShell
            id="stats"
            title={
                <TransText
                    en="Key figures"
                    fr="Nos chiffres clés"
                    ar="أرقام أساسية"
                />
            }
            className="bg-background"
        >
            <div>{isTilila ? <TililaStatsCard /> : <TililabStatsCard />}</div>
        </SectionShell>
    );
}

export function ProgramTestimonialsSection({ testimonials = [], program }) {
    if (!testimonials.length) {
        return null;
    }

    const { locale } = useTranslation();

    const textFor = (obj) =>
        obj?.[locale] || obj?.fr || obj?.en || obj?.ar || '';

    return (
        <SectionShell
            id="testimonials"
            title={<TransText en="Testimonials" fr="Témoignages" ar="شهادات" />}
            className="bg-twhite"
        >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((item) => (
                    <blockquote
                        key={item.id}
                        className="rounded-2xl border border-border bg-background p-5"
                    >
                        {item.photo_url ? (
                            <img
                                src={item.photo_url}
                                alt=""
                                className="mb-4 h-16 w-16 rounded-full object-cover"
                            />
                        ) : null}
                        <p className="text-sm leading-relaxed text-tgray">
                            “{textFor(item.quote)}”
                        </p>
                        <footer className="mt-4 text-sm font-semibold text-tblack">
                            {item.name}
                            {textFor(item.role) ? (
                                <span className="mt-1 block text-xs font-normal text-tgray">
                                    {textFor(item.role)}
                                </span>
                            ) : null}
                        </footer>
                    </blockquote>
                ))}
            </div>
        </SectionShell>
    );
}

export function ProgramNewsSection({ news = [], program }) {
    const { locale } = useTranslation();
    const textFor = (obj) =>
        obj?.[locale] || obj?.fr || obj?.en || obj?.ar || '';

    return (
        <SectionShell
            id="news"
            title={<TransText en="News" fr="Actualités" ar="أخبار" />}
            subtitle={
                <TransText
                    en="Latest updates about applications, jury, bootcamp and ceremonies."
                    fr="Dernières actualités sur les candidatures, le jury, le bootcamp et les cérémonies."
                    ar="آخر المستجدات حول الترشحات ولجنة التحكيم والمعسكر وحفلات التتويج."
                />
            }
            className="bg-background"
        >
            {news.length ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {news.map((item) => (
                        <Link
                            key={item.id}
                            href={`/actualites/${item.slug}`}
                            className="rounded-2xl border border-border bg-card p-5 transition hover:border-beta-blue/40"
                        >
                            {item.cover_image_url ? (
                                <img
                                    src={item.cover_image_url}
                                    alt=""
                                    className="mb-4 aspect-video w-full rounded-xl object-cover"
                                />
                            ) : null}
                            <h3 className="font-semibold text-tblack">
                                {textFor(item.title)}
                            </h3>
                            {item.excerpt ? (
                                <p className="mt-2 line-clamp-3 text-sm text-tgray">
                                    {textFor(item.excerpt)}
                                </p>
                            ) : null}
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-tgray">
                    <TransText
                        en="No news published yet."
                        fr="Aucune actualité publiée pour le moment."
                        ar="لا توجد أخبار منشورة حاليًا."
                    />
                </p>
            )}
            <div className="mt-6">
                <Link
                    href={
                        program
                            ? `/actualites?program=${program}`
                            : '/actualites'
                    }
                    className="text-sm font-semibold text-beta-blue hover:underline"
                >
                    <TransText
                        en="View all news"
                        fr="Voir toutes les actualités"
                        ar="عرض كل الأخبار"
                    />
                </Link>
            </div>
        </SectionShell>
    );
}

export function ProgramContactSection({ program }) {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            program: program ?? '',
            name: '',
            email: '',
            subject: '',
            message: '',
        });

    const submit = (e) => {
        e.preventDefault();
        post('/program/contact', { preserveScroll: true });
    };

    return (
        <SectionShell
            id="contact"
            title={<TransText en="Contact" fr="Contact" ar="تواصل" />}
            subtitle={
                <TransText
                    en="Comité Parité & Diversité — SOREAD 2M, Casablanca, Morocco"
                    fr="Comité Parité & Diversité — SOREAD 2M, Casablanca, Maroc"
                    ar="لجنة المساواة والتنوع — SOREAD 2M، الدار البيضاء، المغرب"
                />
            }
            className="border-t border-border bg-twhite"
        >
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="text-sm text-tgray">
                    <p>
                        <TransText
                            en="For questions about Tilila Awards or Tililab:"
                            fr="Pour toute question sur les Tilila Awards ou Tililab :"
                            ar="لأي استفسار حول تيليلا أووردز أو تيليلاب:"
                        />
                    </p>
                    <a
                        href="mailto:comiteparitediversité@2m.ma"
                        className="mt-3 inline-block font-semibold text-beta-blue hover:underline"
                    >
                        comiteparitediversité@2m.ma
                    </a>
                </div>
                <form
                    onSubmit={submit}
                    className="space-y-4 rounded-2xl border border-border bg-background p-6"
                >
                    {recentlySuccessful ? (
                        <p className="text-sm font-medium text-emerald-700">
                            <TransText
                                en="Message sent."
                                fr="Message envoyé."
                                ar="تم إرسال الرسالة."
                            />
                        </p>
                    ) : null}
                    <input type="hidden" name="program" value={data.program} />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm">
                            <span className="font-semibold text-tblack">
                                <TransText en="Name" fr="Nom" ar="الاسم" /> *
                            </span>
                            <input
                                className="mt-1 w-full rounded-md border border-border px-3 py-2"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                            />
                            {errors.name ? (
                                <span className="text-xs text-red-600">
                                    {errors.name}
                                </span>
                            ) : null}
                        </label>
                        <label className="block text-sm">
                            <span className="font-semibold text-tblack">
                                <TransText en="Email" fr="E-mail" ar="البريد" />{' '}
                                *
                            </span>
                            <input
                                type="email"
                                className="mt-1 w-full rounded-md border border-border px-3 py-2"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                            />
                            {errors.email ? (
                                <span className="text-xs text-red-600">
                                    {errors.email}
                                </span>
                            ) : null}
                        </label>
                    </div>
                    <label className="block text-sm">
                        <span className="font-semibold text-tblack">
                            <TransText en="Subject" fr="Objet" ar="الموضوع" />
                        </span>
                        <input
                            className="mt-1 w-full rounded-md border border-border px-3 py-2"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                        />
                    </label>
                    <label className="block text-sm">
                        <span className="font-semibold text-tblack">
                            <TransText en="Message" fr="Message" ar="الرسالة" />{' '}
                            *
                        </span>
                        <textarea
                            rows={4}
                            className="mt-1 w-full rounded-md border border-border px-3 py-2"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            required
                        />
                        {errors.message ? (
                            <span className="text-xs text-red-600">
                                {errors.message}
                            </span>
                        ) : null}
                    </label>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-full bg-beta-blue px-5 py-2.5 text-sm font-semibold text-twhite hover:opacity-90 disabled:opacity-60"
                    >
                        <TransText en="Send" fr="Envoyer" ar="إرسال" />
                    </button>
                </form>
            </div>
        </SectionShell>
    );
}

export function ProgramPartnersSection() {
    return (
        <SectionShell
            id="partners"
            title={<TransText en="Partners" fr="Partenaires" ar="الشركاء" />}
            subtitle={
                <TransText
                    en="A dedicated space for institutional, media and technical partners associated with Tilila Awards and Tililab."
                    fr="Espace dédié aux partenaires institutionnels, médias et techniques associés aux Tilila Awards et à Tililab."
                    ar="فضاء مخصص للشركاء المؤسساتيين والإعلاميين والتقنيين المرتبطين بتيليلا أووردز وتيليلاب."
                />
            }
            className="bg-twhite"
        >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {PROGRAM_PARTNERS.map((partner) => (
                    <PartnerLogoTile
                        key={partner.id}
                        name={partner.name}
                        logoUrl={partner.logoUrl}
                        tall
                        subtitle={
                            partner.subtitle ? (
                                <TransText
                                    en={partner.subtitle.en}
                                    fr={partner.subtitle.fr}
                                    ar={partner.subtitle.ar}
                                />
                            ) : null
                        }
                    />
                ))}
            </div>
        </SectionShell>
    );
}
