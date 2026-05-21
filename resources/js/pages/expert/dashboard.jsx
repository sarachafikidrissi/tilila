import { Head, Link, setLayoutProps } from '@inertiajs/react';
import {
    ExternalLink,
    FileText,
    Globe2,
    Languages,
    MapPin,
    Pencil,
    Settings,
    Shield,
    Sparkles,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';
import {
    buildCountryOptions,
    buildLanguageOptions,
} from '@/components/helpers/expert-form-options';
function resolveTri(value, locale) {
    if (!value || typeof value !== 'object') {
        return '';
    }

    return (
        (locale === 'ar' ? value.ar : locale === 'fr' ? value.fr : value.en) ||
        value.en ||
        value.fr ||
        value.ar ||
        ''
    );
}

function expertiseLabels(expertise, locale) {
    if (!Array.isArray(expertise)) {
        return [];
    }

    return expertise
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return '';
            }

            return (
                resolveTri(item, locale) ||
                item.fr ||
                item.en ||
                item.ar ||
                ''
            );
        })
        .filter(Boolean);
}

function withHttps(url) {
    const value = (url ?? '').trim();
    if (!value) {
        return null;
    }

    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function SocialButton({ href, label, children }) {
    if (!href) {
        return null;
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground shadow-sm transition hover:border-beta-blue hover:bg-beta-blue/5 hover:text-beta-blue"
        >
            {children}
        </a>
    );
}

export default function ExpertDashboard({ expert }) {
    const { locale } = useTranslation();

    const displayName = resolveTri(expert?.name, locale) || 'Expert';
    const displayTitle = resolveTri(expert?.title, locale);
    const displayBio = resolveTri(expert?.bio_i18n, locale);
    const cityLabel = resolveTri(expert?.city_i18n, locale);
    const countryLabel =
        buildCountryOptions(locale).find(
            (option) => option.value === expert?.country,
        )?.label || expert?.country || '';
    const languageLabels = (expert?.languages ?? [])
        .map(
            (code) =>
                buildLanguageOptions(locale).find((option) => option.value === code)
                    ?.label,
        )
        .filter(Boolean);
    const tags = expertiseLabels(expert?.expertise, locale);
    const socials = expert?.socials ?? {};
    const completion = expert?.profile_completion ?? 0;
    const isPublished = expert?.status === 'published';

    setLayoutProps({
        breadcrumbs: [{ title: 'Dashboard', href: '#' }],
        title: displayName,
        description:
            'Your public expert profile — manage how you appear in the Tilila directory.',
    });

    const regionLabel =
        expert?.region_scope === 'maroc'
            ? { en: 'Morocco', fr: 'Maroc', ar: 'المغرب' }
            : expert?.region_scope === 'afrique'
              ? { en: 'Africa', fr: 'Afrique', ar: 'افريقيا' }
              : expert?.region_scope === 'diaspora'
                ? { en: 'Diaspora', fr: 'Diaspora', ar: 'الشتات' }
                : null;

    return (
        <>
            <Head title="Expert Dashboard" />

            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                    <div className="relative">
                        {isPublished ? (
                            <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-beta-blue/30 bg-card/90 px-3 py-1 text-xs font-semibold text-beta-blue backdrop-blur">
                                <Sparkles className="size-3.5" />
                                <TransText
                                    en="Live profile"
                                    fr="Profil en ligne"
                                    ar="الملف منشور"
                                />
                            </span>
                        ) : null}
                    </div>

                    <div className="relative px-5 py-6 sm:px-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-4">
                                <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-md sm:size-32">
                                    {expert?.image_url ? (
                                        <img
                                            src={expert.image_url}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-beta-blue/10 text-3xl font-bold text-beta-blue">
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 pb-1">
                                    <h1 className="text-xl font-extrabold tracking-tight text-tblack sm:text-2xl">
                                        {displayName}
                                    </h1>
                                    {displayTitle ? (
                                        <p className="mt-0.5 text-sm text-muted-foreground sm:text-base">
                                            {displayTitle}
                                        </p>
                                    ) : null}
                                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                                        {(cityLabel || countryLabel) && (
                                            <span className="inline-flex items-center gap-1">
                                                <MapPin className="size-3.5 shrink-0" />
                                                {[cityLabel, countryLabel]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </span>
                                        )}
                                        {regionLabel ? (
                                            <span className="inline-flex items-center gap-1">
                                                <Globe2 className="size-3.5 shrink-0" />
                                                <TransText {...regionLabel} />
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:justify-end">
                                <Button asChild size="sm" className="gap-1.5">
                                    <Link href="/expert/profile">
                                        <Pencil className="size-4" />
                                        <TransText
                                            en="Edit profile"
                                            fr="Modifier le profil"
                                            ar="تعديل الملف"
                                        />
                                    </Link>
                                </Button>
                                {expert?.public_profile_url ? (
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                        className="gap-1.5"
                                    >
                                        <a
                                            href={expert.public_profile_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="size-4" />
                                            <TransText
                                                en="View public page"
                                                fr="Voir la page publique"
                                                ar="عرض الصفحة العامة"
                                            />
                                        </a>
                                    </Button>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground uppercase">
                                <span>
                                    <TransText
                                        en="Profile completeness"
                                        fr="Complétude du profil"
                                        ar="اكتمال الملف"
                                    />
                                </span>
                                <span className="text-beta-blue">{completion}%</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-beta-blue transition-all"
                                    style={{ width: `${completion}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                            <Shield className="size-4 text-beta-blue" />
                            <TransText en="Status" fr="Statut" ar="الحالة" />
                        </div>
                        <p className="mt-2 text-lg font-semibold capitalize text-tblack">
                            {expert?.status || '—'}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                            <Languages className="size-4 text-alpha-green" />
                            <TransText en="Languages" fr="Langues" ar="اللغات" />
                        </div>
                        <p className="mt-2 text-sm font-semibold text-tblack">
                            {languageLabels.length > 0
                                ? languageLabels.slice(0, 3).join(', ')
                                : '—'}
                            {languageLabels.length > 3
                                ? ` +${languageLabels.length - 3}`
                                : ''}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">
                            <TransText
                                en="Expertise areas"
                                fr="Domaines d’expertise"
                                ar="مجالات الخبرة"
                            />
                        </div>
                        <p className="mt-2 text-lg font-semibold text-tblack">
                            {tags.length}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                            <h2 className="text-base font-extrabold text-tblack">
                                <TransText en="About" fr="À propos" ar="نبذة" />
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {displayBio || (
                                    <TransText
                                        en="Add a short bio so visitors can learn about your work and perspective."
                                        fr="Ajoutez une courte biographie pour présenter votre parcours et votre regard."
                                        ar="أضيفي نبذة قصيرة لتعريف زوار الملف بعملك وخبرتك."
                                    />
                                )}
                            </p>
                        </section>

                        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                            <h2 className="text-base font-extrabold text-tblack">
                                <TransText
                                    en="Areas of expertise"
                                    fr="Domaines d’expertise"
                                    ar="مجالات الخبرة"
                                />
                            </h2>
                            {tags.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex rounded-full border border-beta-blue/25 bg-beta-blue/10 px-3 py-1 text-xs font-semibold text-beta-blue"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-muted-foreground">
                                    <TransText
                                        en="No expertise areas listed yet."
                                        fr="Aucun domaine d’expertise renseigné."
                                        ar="لم يتم إدراج مجالات الخبرة بعد."
                                    />
                                </p>
                            )}
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                            <h2 className="text-sm font-extrabold text-tblack">
                                <TransText
                                    en="Contact & links"
                                    fr="Contact et liens"
                                    ar="التواصل والروابط"
                                />
                            </h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div>
                                    <dt className="text-xs font-semibold text-muted-foreground uppercase">
                                        Email
                                    </dt>
                                    <dd className="mt-0.5 font-medium text-foreground wrap-break-word">
                                        {expert?.email || '—'}
                                    </dd>
                                </div>
                                {expert?.phone ? (
                                    <div>
                                        <dt className="text-xs font-semibold text-muted-foreground uppercase">
                                            <TransText
                                                en="Phone"
                                                fr="Téléphone"
                                                ar="الهاتف"
                                            />
                                        </dt>
                                        <dd className="mt-0.5 font-medium text-foreground">
                                            {expert.phone}
                                        </dd>
                                    </div>
                                ) : null}
                            </dl>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <SocialButton
                                    href={withHttps(socials.linkedin)}
                                    label="LinkedIn"
                                >
                                    <span className="text-xs font-bold">in</span>
                                </SocialButton>
                                <SocialButton
                                    href={withHttps(socials.twitter)}
                                    label="X"
                                >
                                    <span className="text-xs font-bold">X</span>
                                </SocialButton>
                                <SocialButton
                                    href={withHttps(socials.instagram)}
                                    label="Instagram"
                                >
                                    <span className="text-xs font-bold">Ig</span>
                                </SocialButton>
                                <SocialButton
                                    href={withHttps(socials.portfolio)}
                                    label="Portfolio"
                                >
                                    <ExternalLink className="size-4" />
                                </SocialButton>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                            <h2 className="text-sm font-extrabold text-tblack">
                                <TransText
                                    en="Quick actions"
                                    fr="Actions rapides"
                                    ar="إجراءات سريعة"
                                />
                            </h2>
                            <div className="mt-4 flex flex-col gap-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <Link href="/expert/articles">
                                        <FileText className="size-4" />
                                        <TransText
                                            en="My articles"
                                            fr="Mes articles"
                                            ar="مقالاتي"
                                        />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <Link href="/expert/network">
                                        <Users className="size-4" />
                                        <TransText
                                            en="Explore network"
                                            fr="Explorer le réseau"
                                            ar="استكشاف الشبكة"
                                        />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <Link href="/settings/profile">
                                        <Settings className="size-4" />
                                        <TransText
                                            en="Account settings"
                                            fr="Paramètres du compte"
                                            ar="إعدادات الحساب"
                                        />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <Link href="/settings/security">
                                        <Shield className="size-4" />
                                        <TransText
                                            en="Security"
                                            fr="Sécurité"
                                            ar="الأمان"
                                        />
                                    </Link>
                                </Button>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </>
    );
}
