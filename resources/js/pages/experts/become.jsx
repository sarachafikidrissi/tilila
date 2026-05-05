import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/contexts/TranslationContext';
import { useState } from 'react';
import TransText from '@/components/TransText';

export default function BecomeExpert() {
    const { t } = useTranslation();
    const maxCvSizeBytes = 5 * 1024 * 1024;

    const {
        data,
        setData,
        transform,
        post,
        processing,
        errors,
        recentlySuccessful,
        reset,
    } = useForm({
        name_i18n: { en: '', fr: '', ar: '' },
        email: '',
        phone: '',
        country: '',
        city: '',
        industries_text: '',
        languages_text: '',
        title_i18n: { en: '', fr: '', ar: '' },
        expertise_i18n: { en: '', fr: '', ar: '' },
        bio_i18n: { en: '', fr: '', ar: '' },
        linkedin_url: '',
        twitter_url: '',
        instagram_url: '',
        portfolio_url: '',
        cv: null,
        locale: 'en',
    });
    const [cvSizeError, setCvSizeError] = useState('');

    const splitCsv = (value) =>
        String(value ?? '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

    const cvHasError = Boolean(errors.cv || cvSizeError);
    const hasErrors = Object.keys(errors).length > 0 || cvSizeError !== '';
    const requiredMark = <span className="text-alpha-danger">*</span>;
    const getFirstArrayError = (prefix) =>
        Object.entries(errors).find(([key]) => key.startsWith(prefix))?.[1];

    const submit = (e) => {
        e.preventDefault();

        if (data.cv instanceof File && data.cv.size > maxCvSizeBytes) {
            setCvSizeError('The CV must be 5 MB or smaller.');
            return;
        }

        setCvSizeError('');

        transform((current) => {
            const { industries_text, languages_text, ...rest } = current;

            return {
                ...rest,
                industries: splitCsv(industries_text),
                languages: splitCsv(languages_text),
            };
        });

        post('/experts/become', {
            forceFormData: true,
            onSuccess: () => {
                reset(
                    'name_i18n',
                    'email',
                    'phone',
                    'country',
                    'city',
                    'industries_text',
                    'languages_text',
                    'title_i18n',
                    'expertise_i18n',
                    'bio_i18n',
                    'linkedin_url',
                    'twitter_url',
                    'instagram_url',
                    'portfolio_url',
                    'cv',
                );
                setCvSizeError('');
            },
        });
    };

    const setTri = (key, lang, value) => {
        setData(key, {
            ...(data[key] ?? { en: '', fr: '', ar: '' }),
            [lang]: value,
        });
    };

    const inputClass =
        'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
    const helperClass = 'mt-1 text-xs text-muted-foreground';

    return (
        <>
            <Head title={t('experts.become.headTitle')} />

            <section className="bg-[radial-gradient(circle_at_top_left,#dff2ff_0%,#ffffff_45%,#f5fbff_100%)] py-10 sm:py-14">
                <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 rounded-2xl border border-beta-blue/20 bg-card/80 p-6 shadow-sm backdrop-blur sm:p-8">
                        <p className="text-xs font-semibold tracking-[0.3em] text-tgray uppercase">
                            <TransText
                                en="Experts Network"
                                fr="Réseau des expertes"
                                ar="شبكة الخبيرات"
                            />
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-tblack sm:text-4xl">
                            <TransText
                                en="Become an Expert"
                                fr="Devenir experte"
                                ar="أصبحي خبيرة"
                            />
                        </h1>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-tgray sm:text-base">
                            <TransText
                                en="Submit your multilingual profile once. On approval, your expert account and public profile are created from this application."
                                fr="Soumettez votre profil multilingue une seule fois. Après validation, votre compte et profil public seront créés à partir de cette candidature."
                                ar="أرسلي ملفك متعدد اللغات مرة واحدة. بعد القبول، سيتم إنشاء حسابك وملفك العام من هذا الطلب."
                            />
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-border/70 bg-background p-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                    <TransText
                                        en="Step 1"
                                        fr="Etape 1"
                                        ar="الخطوة 1"
                                    />
                                </p>
                                <p className="mt-1 text-sm font-semibold text-tblack">
                                    <TransText
                                        en="Submit profile"
                                        fr="Soumettre le profil"
                                        ar="إرسال الملف"
                                    />
                                </p>
                            </div>
                            <div className="rounded-xl border border-border/70 bg-background p-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                    <TransText
                                        en="Step 2"
                                        fr="Etape 2"
                                        ar="الخطوة 2"
                                    />
                                </p>
                                <p className="mt-1 text-sm font-semibold text-tblack">
                                    <TransText
                                        en="Admin review"
                                        fr="Revue admin"
                                        ar="مراجعة الإدارة"
                                    />
                                </p>
                            </div>
                            <div className="rounded-xl border border-border/70 bg-background p-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                    <TransText
                                        en="Step 3"
                                        fr="Etape 3"
                                        ar="الخطوة 3"
                                    />
                                </p>
                                <p className="mt-1 text-sm font-semibold text-tblack">
                                    <TransText
                                        en="Account + publication"
                                        fr="Compte + publication"
                                        ar="الحساب + النشر"
                                    />
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
                        {recentlySuccessful ? (
                            <div className="mb-6 rounded-lg border border-alpha-green/30 bg-beta-green px-4 py-3 text-sm text-alpha-green">
                                <TransText
                                    en="Your request has been submitted. We will contact you after review."
                                    fr="Votre demande a été soumise. Nous vous contacterons après la revue."
                                    ar="تم إرسال طلبك بنجاح. سنتواصل معك بعد المراجعة."
                                />
                            </div>
                        ) : null}
                        {hasErrors ? (
                            <div className="mb-6 rounded-lg border border-alpha-danger/30 bg-beta-danger/10 px-4 py-3 text-sm text-alpha-danger">
                                Please fix the highlighted fields and submit
                                again.
                            </div>
                        ) : null}

                        <form onSubmit={submit} className="space-y-8">
                            <h3 className="mb-3 text-base font-semibold text-tblack">
                                <TransText
                                    en="Identity"
                                    fr="Identité"
                                    ar="الهوية"
                                />
                            </h3>
                            <div className="rounded-xl border border-border/70 p-4 sm:p-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-tblack">
                                            <TransText
                                                en="Email"
                                                fr="Email"
                                                ar="البريد الإلكتروني"
                                            />{' '}
                                            {requiredMark}
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className={inputClass}
                                            placeholder="name@example.com"
                                        />
                                        {errors.email ? (
                                            <p className="mt-1 text-xs text-alpha-danger">
                                                {errors.email}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-tblack">
                                            <TransText
                                                en="Phone"
                                                fr="Téléphone"
                                                ar="الهاتف"
                                            />
                                        </label>
                                        <input
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className={inputClass}
                                            placeholder="+212 ..."
                                        />
                                        {errors.phone ? (
                                            <p className="mt-1 text-xs text-alpha-danger">
                                                {errors.phone}
                                            </p>
                                        ) : null}
                                    </div>

                                    {['en', 'fr', 'ar'].map((lang) => (
                                        <div key={`name-${lang}`}>
                                            <label className="mb-2 block text-sm font-semibold text-tblack">
                                                <TransText
                                                    en="Full name"
                                                    fr="Nom complet"
                                                    ar="الاسم الكامل"
                                                />{' '}
                                                ({lang.toUpperCase()}){' '}
                                                {requiredMark}
                                            </label>
                                            <input
                                                value={
                                                    data.name_i18n?.[lang] ?? ''
                                                }
                                                onChange={(e) =>
                                                    setTri(
                                                        'name_i18n',
                                                        lang,
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                placeholder="Your full name"
                                            />
                                            {errors[`name_i18n.${lang}`] ? (
                                                <p className="mt-1 text-xs text-alpha-danger">
                                                    {
                                                        errors[
                                                            `name_i18n.${lang}`
                                                        ]
                                                    }
                                                </p>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <h3 className="mb-3 text-base font-semibold text-tblack">
                                <TransText
                                    en="Professional Position"
                                    fr="Position professionnelle"
                                    ar="الوضع المهني"
                                />
                            </h3>
                            <div className="rounded-xl border border-border/70 p-4 sm:p-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {['en', 'fr', 'ar'].map((lang) => (
                                        <div key={`title-${lang}`}>
                                            <label className="mb-2 block text-sm font-semibold text-tblack">
                                                <TransText
                                                    en="Current title"
                                                    fr="Poste actuel"
                                                    ar="الصفة الحالية"
                                                />{' '}
                                                ({lang.toUpperCase()}){' '}
                                                {requiredMark}
                                            </label>
                                            <input
                                                value={
                                                    data.title_i18n?.[lang] ??
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setTri(
                                                        'title_i18n',
                                                        lang,
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                placeholder="Journalist, Researcher, ..."
                                            />
                                            {errors[`title_i18n.${lang}`] ? (
                                                <p className="mt-1 text-xs text-alpha-danger">
                                                    {
                                                        errors[
                                                            `title_i18n.${lang}`
                                                        ]
                                                    }
                                                </p>
                                            ) : null}
                                        </div>
                                    ))}

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-tblack">
                                            <TransText
                                                en="Country"
                                                fr="Pays"
                                                ar="البلد"
                                            />
                                        </label>
                                        <input
                                            value={data.country}
                                            onChange={(e) =>
                                                setData(
                                                    'country',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="Morocco"
                                        />
                                        {errors.country ? (
                                            <p className="mt-1 text-xs text-alpha-danger">
                                                {errors.country}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-tblack">
                                            <TransText
                                                en="City"
                                                fr="Ville"
                                                ar="المدينة"
                                            />
                                        </label>
                                        <input
                                            value={data.city}
                                            onChange={(e) =>
                                                setData('city', e.target.value)
                                            }
                                            className={inputClass}
                                            placeholder="Casablanca"
                                        />
                                        {errors.city ? (
                                            <p className="mt-1 text-xs text-alpha-danger">
                                                {errors.city}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-tblack">
                                            <TransText
                                                en="Industries (comma separated)"
                                                fr="Secteurs (séparés par des virgules)"
                                                ar="القطاعات (مفصولة بفواصل)"
                                            />
                                        </label>
                                        <input
                                            value={data.industries_text}
                                            onChange={(e) =>
                                                setData(
                                                    'industries_text',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="economics, media, policy"
                                        />
                                        {errors.industries ? (
                                            <p className="mt-1 text-xs text-alpha-danger">
                                                {errors.industries}
                                            </p>
                                        ) : getFirstArrayError(
                                              'industries.',
                                          ) ? (
                                            <p className="mt-1 text-xs text-alpha-danger">
                                                {getFirstArrayError(
                                                    'industries.',
                                                )}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-tblack">
                                            <TransText
                                                en="Languages (comma separated)"
                                                fr="Langues (séparées par des virgules)"
                                                ar="اللغات (مفصولة بفواصل)"
                                            />
                                        </label>
                                        <input
                                            value={data.languages_text}
                                            onChange={(e) =>
                                                setData(
                                                    'languages_text',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="en, fr, ar"
                                        />
                                        {errors.languages ? (
                                            <p className="mt-1 text-xs text-alpha-danger">
                                                {errors.languages}
                                            </p>
                                        ) : getFirstArrayError('languages.') ? (
                                            <p className="mt-1 text-xs text-alpha-danger">
                                                {getFirstArrayError(
                                                    'languages.',
                                                )}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-base font-semibold text-tblack">
                                    <TransText
                                        en="Expertise and Bio"
                                        fr="Expertise et biographie"
                                        ar="الخبرة والسيرة"
                                    />
                                </h3>
                                <div className="rounded-xl border border-border/70 p-4 sm:p-5">
                                    {['en', 'fr', 'ar'].map((lang) => (
                                        <div key={`expertise-${lang}`}>
                                            <label className="mb-2 block text-sm font-semibold text-tblack">
                                                <TransText
                                                    en="Expertise areas"
                                                    fr="Domaines d’expertise"
                                                    ar="مجالات الخبرة"
                                                />{' '}
                                                ({lang.toUpperCase()}){' '}
                                                {requiredMark}
                                            </label>
                                            <textarea
                                                value={
                                                    data.expertise_i18n?.[
                                                        lang
                                                    ] ?? ''
                                                }
                                                onChange={(e) =>
                                                    setTri(
                                                        'expertise_i18n',
                                                        lang,
                                                        e.target.value,
                                                    )
                                                }
                                                className={`${inputClass} min-h-24 resize-y`}
                                                placeholder="Ex: Media ethics, digital journalism, climate policy"
                                            />
                                            {errors[
                                                `expertise_i18n.${lang}`
                                            ] ? (
                                                <p className="mt-1 text-xs text-alpha-danger">
                                                    {
                                                        errors[
                                                            `expertise_i18n.${lang}`
                                                        ]
                                                    }
                                                </p>
                                            ) : null}
                                        </div>
                                    ))}

                                    {['en', 'fr', 'ar'].map((lang) => (
                                        <div key={`bio-${lang}`}>
                                            <label className="mb-2 block text-sm font-semibold text-tblack">
                                                <TransText
                                                    en="Short bio"
                                                    fr="Courte biographie"
                                                    ar="نبذة قصيرة"
                                                />{' '}
                                                ({lang.toUpperCase()}){' '}
                                                {requiredMark}
                                            </label>
                                            <textarea
                                                value={
                                                    data.bio_i18n?.[lang] ?? ''
                                                }
                                                onChange={(e) =>
                                                    setTri(
                                                        'bio_i18n',
                                                        lang,
                                                        e.target.value,
                                                    )
                                                }
                                                className={`${inputClass} min-h-28 resize-y`}
                                                placeholder="Tell us about your work and achievements"
                                            />
                                            {errors[`bio_i18n.${lang}`] ? (
                                                <p className="mt-1 text-xs text-alpha-danger">
                                                    {errors[`bio_i18n.${lang}`]}
                                                </p>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-base font-semibold text-tblack">
                                    <TransText
                                        en="Social Links"
                                        fr="Liens sociaux"
                                        ar="روابط التواصل"
                                    />
                                </h3>
                                <div className="rounded-xl border border-border/70 p-4 sm:p-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-tblack">
                                                <TransText
                                                    en="LinkedIn URL"
                                                    fr="URL LinkedIn"
                                                    ar="رابط لينكدإن"
                                                />
                                            </label>
                                            <input
                                                value={data.linkedin_url}
                                                onChange={(e) =>
                                                    setData(
                                                        'linkedin_url',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                            {errors.linkedin_url ? (
                                                <p className="mt-1 text-xs text-alpha-danger">
                                                    {errors.linkedin_url}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-tblack">
                                                <TransText
                                                    en="Twitter / X URL"
                                                    fr="URL Twitter / X"
                                                    ar="رابط تويتر / X"
                                                />
                                            </label>
                                            <input
                                                value={data.twitter_url}
                                                onChange={(e) =>
                                                    setData(
                                                        'twitter_url',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                placeholder="https://x.com/..."
                                            />
                                            {errors.twitter_url ? (
                                                <p className="mt-1 text-xs text-alpha-danger">
                                                    {errors.twitter_url}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-tblack">
                                                <TransText
                                                    en="Instagram URL"
                                                    fr="URL Instagram"
                                                    ar="رابط إنستغرام"
                                                />
                                            </label>
                                            <input
                                                value={data.instagram_url}
                                                onChange={(e) =>
                                                    setData(
                                                        'instagram_url',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                placeholder="https://instagram.com/..."
                                            />
                                            {errors.instagram_url ? (
                                                <p className="mt-1 text-xs text-alpha-danger">
                                                    {errors.instagram_url}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-tblack">
                                                <TransText
                                                    en="Portfolio URL"
                                                    fr="URL Portfolio"
                                                    ar="رابط الأعمال"
                                                />
                                            </label>
                                            <input
                                                value={data.portfolio_url}
                                                onChange={(e) =>
                                                    setData(
                                                        'portfolio_url',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                placeholder="https://..."
                                            />
                                            {errors.portfolio_url ? (
                                                <p className="mt-1 text-xs text-alpha-danger">
                                                    {errors.portfolio_url}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-tblack">
                                    <TransText
                                        en="CV (PDF/DOC, max 5MB)"
                                        fr="CV (PDF/DOC, max 5MB)"
                                        ar="السيرة الذاتية (PDF/DOC بحد أقصى 5MB)"
                                    />
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => {
                                        const file =
                                            e.target.files?.[0] ?? null;

                                        if (
                                            file &&
                                            file.size > maxCvSizeBytes
                                        ) {
                                            setCvSizeError(
                                                'The CV must be 5 MB or smaller.',
                                            );
                                            setData('cv', null);
                                            e.target.value = '';
                                            return;
                                        }

                                        setCvSizeError('');
                                        setData('cv', file);
                                    }}
                                    aria-invalid={cvHasError}
                                    className={[
                                        inputClass,
                                        cvHasError
                                            ? 'border-alpha-danger bg-beta-danger/10 focus-visible:border-alpha-danger focus-visible:ring-alpha-danger'
                                            : '',
                                    ].join(' ')}
                                />
                                {cvSizeError ? (
                                    <p className="mt-1 text-xs text-alpha-danger">
                                        {cvSizeError}
                                    </p>
                                ) : errors.cv ? (
                                    <p className="mt-1 text-xs text-alpha-danger">
                                        {errors.cv}
                                    </p>
                                ) : null}
                                <p className={helperClass}>
                                    Optional. Accepted formats: PDF, DOC, DOCX.
                                    Max size: 5 MB.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/70 pt-4">
                                <Link
                                    href="/experts"
                                    className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-tgray hover:text-tblack"
                                >
                                    <TransText
                                        en="Cancel"
                                        fr="Annuler"
                                        ar="إلغاء"
                                    />
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center rounded-full bg-beta-blue px-5 py-2 text-sm font-semibold text-twhite transition hover:bg-beta-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <TransText
                                            en="Submitting..."
                                            fr="Envoi..."
                                            ar="جارٍ الإرسال..."
                                        />
                                    ) : (
                                        <TransText
                                            en="Submit Request"
                                            fr="Envoyer la demande"
                                            ar="إرسال الطلب"
                                        />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

BecomeExpert.layout = (page) => <AppLayout>{page}</AppLayout>;
