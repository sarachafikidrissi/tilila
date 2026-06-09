import { Head } from '@inertiajs/react';
import { ArrowRight, Clock3, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import AppLayout from '@/layouts/app-layout';

function ContactPage() {
    const { t } = useTranslation();

    const contactDetails = [
        {
            icon: MapPin,
            title: t('contact.page.details.headquarters.title'),
            body: [
                t('contact.page.details.headquarters.line1'),
                t('contact.page.details.headquarters.line2'),
            ],
        },
        {
            icon: Mail,
            title: t('contact.page.details.email.title'),
            body: [t('contact.page.details.email.value')],
            href: 'mailto:contact@tilila.ma',
        },
        {
            icon: Phone,
            title: t('contact.page.details.phone.title'),
            body: [t('contact.page.details.phone.value')],
            href: 'tel:+212522000000',
        },
    ];

    const responseCards = [
        {
            label: t('contact.page.responseCards.general.label'),
            value: t('contact.page.responseCards.general.value'),
        },
        {
            label: t('contact.page.responseCards.partnerships.label'),
            value: t('contact.page.responseCards.partnerships.value'),
        },
        {
            label: t('contact.page.responseCards.location.label'),
            value: t('contact.page.responseCards.location.value'),
        },
    ];

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Head title={t('contact.page.headTitle')} />

            <div className="bg-background">
                <section className="relative overflow-hidden bg-beta-white">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 -right-24 h-72 w-72 rounded-full bg-alpha-blue/70 blur-3xl" />
                        <div className="absolute -bottom-28 left-0 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />
                        <div className="bg-brand-subtle absolute inset-0" />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="max-w-3xl">
                            <span className="inline-flex items-center rounded-full bg-alpha-blue px-4 py-2 text-xs font-semibold tracking-[0.3em] text-beta-blue">
                                {t('contact.page.hero.eyebrow')}
                            </span>
                            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-tblack sm:text-5xl lg:text-6xl">
                                {t('contact.page.hero.title')}
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-tgray sm:text-lg">
                                {t('contact.page.hero.description')}
                            </p>
                        </div>

                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            {responseCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="rounded-2xl border border-border bg-background/90 p-5 shadow-sm backdrop-blur"
                                >
                                    <div className="text-xs font-semibold tracking-[0.25em] text-tgray uppercase">
                                        {card.label}
                                    </div>
                                    <div className="mt-3 text-lg font-semibold text-tblack">
                                        {card.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-twhite">
                    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                        <div className="grid gap-10 lg:grid-cols-12">
                            <div className="lg:col-span-5">
                                <div className="text-xs font-semibold tracking-[0.35em] text-tgray">
                                    {t('contact.page.sectionContact.eyebrow')}
                                </div>
                                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-tblack sm:text-3xl">
                                    {t('contact.page.sectionContact.title')}
                                </h2>
                                <p className="mt-4 max-w-xl text-sm leading-6 text-tgray sm:text-base">
                                    {t(
                                        'contact.page.sectionContact.description',
                                    )}
                                </p>

                                <div className="mt-8 space-y-4">
                                    {contactDetails.map((item) => {
                                        const Icon = item.icon;
                                        const content = (
                                            <div className="flex items-start gap-4 rounded-2xl border border-border bg-background p-4 transition-shadow hover:shadow-sm">
                                                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-alpha-blue text-beta-blue">
                                                    <Icon className="size-5" />
                                                </span>
                                                <div>
                                                    <div className="text-sm font-semibold text-tblack">
                                                        {item.title}
                                                    </div>
                                                    <div className="mt-1 text-sm leading-6 text-tgray">
                                                        {item.body.map(
                                                            (line) => (
                                                                <div key={line}>
                                                                    {line}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );

                                        if (!item.href) {
                                            return (
                                                <div key={item.title}>
                                                    {content}
                                                </div>
                                            );
                                        }

                                        return (
                                            <a
                                                key={item.title}
                                                href={item.href}
                                                className="block"
                                            >
                                                {content}
                                            </a>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 rounded-3xl border border-border bg-alpha-blue p-6">
                                    <div className="flex items-center gap-3 text-beta-blue">
                                        <Clock3 className="size-5" />
                                        <span className="text-xs font-semibold tracking-[0.25em] uppercase">
                                            {t(
                                                'contact.page.officeHours.title',
                                            )}
                                        </span>
                                    </div>
                                    <p className="mt-4 max-w-md text-sm leading-6 text-tgray">
                                        {t(
                                            'contact.page.officeHours.description',
                                        )}
                                    </p>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <a
                                        href="https://www.linkedin.com"
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-tblack transition-colors hover:bg-alpha-blue hover:text-beta-blue"
                                    >
                                        {t('contact.page.actions.linkedin')}
                                        <ArrowRight className="size-4" />
                                    </a>
                                    <a
                                        href="mailto:contact@tilila.ma"
                                        className="inline-flex items-center gap-2 rounded-full bg-beta-blue px-4 py-2 text-sm font-semibold text-twhite transition-opacity hover:opacity-90"
                                    >
                                        {t('contact.page.actions.emailUs')}
                                        <ArrowRight className="size-4" />
                                    </a>
                                </div>
                            </div>

                            <div className="lg:col-span-7">
                                <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8 lg:p-10">
                                    <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <h2 className="text-2xl font-semibold tracking-tight text-tblack">
                                                {t('contact.page.form.title')}
                                            </h2>
                                            <p className="mt-2 text-sm leading-6 text-tgray">
                                                {t(
                                                    'contact.page.form.description',
                                                )}
                                            </p>
                                        </div>
                                        <div className="rounded-full bg-alpha-blue px-4 py-2 text-xs font-semibold tracking-[0.25em] text-beta-blue uppercase">
                                            {t('contact.page.form.badge')}
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-8 space-y-6"
                                    >
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <label className="grid gap-2 text-sm">
                                                <span className="font-semibold text-tblack">
                                                    {t(
                                                        'contact.page.form.fields.firstNameLabel',
                                                    )}
                                                </span>
                                                <input
                                                    className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-tblack placeholder:text-tgray focus:border-beta-blue focus:ring-2 focus:ring-beta-blue/15 focus:outline-none"
                                                    name="firstName"
                                                    placeholder={t(
                                                        'contact.page.form.fields.firstNamePlaceholder',
                                                    )}
                                                    autoComplete="given-name"
                                                />
                                            </label>

                                            <label className="grid gap-2 text-sm">
                                                <span className="font-semibold text-tblack">
                                                    {t(
                                                        'contact.page.form.fields.lastNameLabel',
                                                    )}
                                                </span>
                                                <input
                                                    className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-tblack placeholder:text-tgray focus:border-beta-blue focus:ring-2 focus:ring-beta-blue/15 focus:outline-none"
                                                    name="lastName"
                                                    placeholder={t(
                                                        'contact.page.form.fields.lastNamePlaceholder',
                                                    )}
                                                    autoComplete="family-name"
                                                />
                                            </label>
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <label className="grid gap-2 text-sm">
                                                <span className="font-semibold text-tblack">
                                                    {t(
                                                        'contact.page.form.fields.emailLabel',
                                                    )}
                                                </span>
                                                <input
                                                    className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-tblack placeholder:text-tgray focus:border-beta-blue focus:ring-2 focus:ring-beta-blue/15 focus:outline-none"
                                                    name="email"
                                                    type="email"
                                                    placeholder={t(
                                                        'contact.page.form.fields.emailPlaceholder',
                                                    )}
                                                    autoComplete="email"
                                                />
                                            </label>

                                            <label className="grid gap-2 text-sm">
                                                <span className="font-semibold text-tblack">
                                                    {t(
                                                        'contact.page.form.fields.organizationLabel',
                                                    )}
                                                </span>
                                                <input
                                                    className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-tblack placeholder:text-tgray focus:border-beta-blue focus:ring-2 focus:ring-beta-blue/15 focus:outline-none"
                                                    name="organization"
                                                    placeholder={t(
                                                        'contact.page.form.fields.organizationPlaceholder',
                                                    )}
                                                />
                                            </label>
                                        </div>

                                        <label className="grid gap-2 text-sm">
                                            <span className="font-semibold text-tblack">
                                                {t(
                                                    'contact.page.form.fields.subjectLabel',
                                                )}
                                            </span>
                                            <input
                                                className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-tblack placeholder:text-tgray focus:border-beta-blue focus:ring-2 focus:ring-beta-blue/15 focus:outline-none"
                                                name="subject"
                                                placeholder={t(
                                                    'contact.page.form.fields.subjectPlaceholder',
                                                )}
                                            />
                                        </label>

                                        <label className="grid gap-2 text-sm">
                                            <span className="font-semibold text-tblack">
                                                {t(
                                                    'contact.page.form.fields.messageLabel',
                                                )}
                                            </span>
                                            <textarea
                                                className="min-h-40 rounded-xl border border-border bg-background px-4 py-3 text-sm text-tblack placeholder:text-tgray focus:border-beta-blue focus:ring-2 focus:ring-beta-blue/15 focus:outline-none"
                                                name="message"
                                                placeholder={t(
                                                    'contact.page.form.fields.messagePlaceholder',
                                                )}
                                            />
                                        </label>

                                        <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-sm leading-6 text-tgray">
                                                {t('contact.page.form.legal')}
                                            </p>
                                            <button
                                                type="submit"
                                                className="inline-flex items-center justify-center gap-2 rounded-full bg-beta-blue px-6 py-3 text-sm font-semibold text-twhite transition-opacity hover:opacity-90"
                                            >
                                                <Send className="size-4" />
                                                {t('contact.page.form.submit')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-beta-white">
                    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                        <div className="grid gap-8 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <div className="text-xs font-semibold tracking-[0.35em] text-tgray">
                                    {t('contact.page.location.eyebrow')}
                                </div>
                                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-tblack sm:text-3xl">
                                    {t('contact.page.location.title')}
                                </h2>
                                <p className="mt-4 text-sm leading-6 text-tgray sm:text-base">
                                    {t('contact.page.location.description')}
                                </p>
                            </div>

                            <div className="lg:col-span-8">
                                <div className="relative overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
                                    <div className="bg-brand-subtle absolute inset-0" />
                                    <div className="relative grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                                        <div className="rounded-2xl border border-border bg-beta-white p-6">
                                            <div className="flex items-center gap-3 text-tblack">
                                                <MapPin className="size-5 text-beta-blue" />
                                                <span className="text-sm font-semibold tracking-[0.25em] text-tgray uppercase">
                                                    {t(
                                                        'contact.page.location.mapTitle',
                                                    )}
                                                </span>
                                            </div>
                                            <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-6">
                                                <div className="text-sm font-semibold text-tblack">
                                                    {t(
                                                        'contact.page.details.headquarters.line1',
                                                    )}
                                                </div>
                                                <div className="mt-2 text-sm leading-6 text-tgray">
                                                    {t(
                                                        'contact.page.details.headquarters.line2',
                                                    )}
                                                </div>
                                                <div className="mt-4 inline-flex items-center rounded-full bg-alpha-blue px-4 py-2 text-xs font-semibold text-beta-blue">
                                                    {t(
                                                        'contact.page.location.mapBadge',
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid content-start gap-4">
                                            <div className="rounded-2xl border border-border bg-beta-white p-5">
                                                <div className="text-xs font-semibold tracking-[0.25em] text-tgray uppercase">
                                                    {t(
                                                        'contact.page.location.channelsTitle',
                                                    )}
                                                </div>
                                                <div className="mt-3 space-y-3 text-sm text-tblack">
                                                    <div>
                                                        {t(
                                                            'contact.page.details.email.value',
                                                        )}
                                                    </div>
                                                    <div>
                                                        {t(
                                                            'contact.page.details.phone.value',
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border border-border bg-alpha-blue p-5">
                                                <div className="text-xs font-semibold tracking-[0.25em] text-beta-blue uppercase">
                                                    {t(
                                                        'contact.page.location.nextStepTitle',
                                                    )}
                                                </div>
                                                <p className="mt-3 text-sm leading-6 text-tgray">
                                                    {t(
                                                        'contact.page.location.nextStepDescription',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

ContactPage.layout = (page) => <AppLayout>{page}</AppLayout>;

export default ContactPage;
