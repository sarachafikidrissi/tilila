import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import TransText from '@/components/TransText';
import RegulationCta from '@/components/program/RegulationCta';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

const inputClass =
    'w-full rounded-md border border-border bg-background px-3 py-2 text-sm';

function firstFormError(errors) {
    const values = Object.values(errors ?? {});
    const flat = values.flat().filter(Boolean);
    return flat[0] ?? null;
}

export default function TililabParticipate() {
    const [resultModal, setResultModal] = useState(null);
    const [errorSummary, setErrorSummary] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            city: '',
            country: 'ma',
            birth_date: '',
            cin: '',
            education_level: '',
            profession: '',
            social_links: '',
            project_title: '',
            prior_work_link: '',
            candidate_presentation: '',
            project_presentation: '',
            main_message: '',
            motivation: '',
            original_video: null,
            original_video_link: '',
            portfolio_file: null,
            pdf_dossier: null,
            declared_under_30: false,
            declared_accuracy: false,
            declared_rights: false,
            accepted_rules: false,
        });

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        setResultModal(null);
        setErrorSummary('');

        post('/tililab/form', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setResultModal('success');
            },
            onError: (serverErrors) => {
                setErrorSummary(firstFormError(serverErrors) ?? '');
                setResultModal('error');
            },
        });
    };

    const closeResultModal = (open) => {
        if (!open) {
            setResultModal(null);
        }
    };

    return (
        <>
            <Head title="Tililab — Candidature" />

            {processing ? (
                <div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/50 px-4 backdrop-blur-[2px]"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                >
                    <Spinner className="size-10 text-twhite" />
                    <p className="text-center text-sm font-semibold text-twhite">
                        <TransText
                            en="Submitting your application…"
                            fr="Envoi de votre candidature en cours…"
                            ar="جاري إرسال ترشحكم…"
                        />
                    </p>
                </div>
            ) : null}

            <Dialog open={resultModal !== null} onOpenChange={closeResultModal}>
                <DialogContent className="sm:max-w-md">
                    {resultModal === 'success' ? (
                        <>
                            <DialogHeader>
                                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                                    <CheckCircle2
                                        className="size-7"
                                        aria-hidden
                                    />
                                </div>
                                <DialogTitle className="text-center">
                                    <TransText
                                        en="Application submitted"
                                        fr="Candidature envoyée"
                                        ar="تم إرسال الترشح"
                                    />
                                </DialogTitle>
                                <DialogDescription className="text-center">
                                    <TransText
                                        en="Thank you. We received your Tililab application."
                                        fr="Merci. Nous avons bien reçu votre candidature Tililab."
                                        ar="شكراً. استلمنا ترشحكم لتيليلاب."
                                    />
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-center">
                                <Button
                                    asChild
                                    className="rounded-full bg-beta-blue text-twhite hover:bg-beta-blue/90"
                                >
                                    <Link href="/tililab">
                                        <TransText
                                            en="Back to Tililab"
                                            fr="Retour à Tililab"
                                            ar="العودة إلى تيليلاب"
                                        />
                                    </Link>
                                </Button>
                            </DialogFooter>
                        </>
                    ) : null}

                    {resultModal === 'error' ? (
                        <>
                            <DialogHeader>
                                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                                    <XCircle className="size-7" aria-hidden />
                                </div>
                                <DialogTitle className="text-center">
                                    <TransText
                                        en="Submission failed"
                                        fr="Échec de l’envoi"
                                        ar="تعذّر الإرسال"
                                    />
                                </DialogTitle>
                                <DialogDescription className="text-center">
                                    {errorSummary ? (
                                        errorSummary
                                    ) : (
                                        <TransText
                                            en="Please check the highlighted fields and try again."
                                            fr="Veuillez vérifier les champs signalés et réessayer."
                                            ar="يرجى التحقق من الحقول المحددة والمحاولة مرة أخرى."
                                        />
                                    )}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-center">
                                <Button
                                    type="button"
                                    className="rounded-full bg-beta-blue text-twhite hover:bg-beta-blue/90"
                                    onClick={() => setResultModal(null)}
                                >
                                    <TransText
                                        en="Close"
                                        fr="Fermer"
                                        ar="إغلاق"
                                    />
                                </Button>
                            </DialogFooter>
                        </>
                    ) : null}
                </DialogContent>
            </Dialog>

            <div className="mx-auto max-w-3xl px-4 py-10">
                <Link
                    href="/tililab"
                    className="text-sm font-semibold text-beta-blue hover:underline"
                >
                    <TransText
                        en="← Back to Tililab"
                        fr="← Retour à Tililab"
                        ar="← العودة إلى تيليلاب"
                    />
                </Link>
                <h1 className="mt-4 text-2xl font-bold text-tblack">
                    <TransText
                        en="Apply to Tililab"
                        fr="Déposer une candidature Tililab"
                        ar="الترشح لتيليلاب"
                    />
                </h1>
                <p className="mt-2 text-sm text-tgray">
                    <TransText
                        en="For Moroccan residents under 30. No diploma required."
                        fr="Pour les résident·e·s du Maroc de moins de 30 ans. Aucun diplôme requis."
                        ar="للمقيمين في المغرب دون 30 سنة. لا يلزم شهادة."
                    />
                </p>
                <div className="mt-4">
                    <RegulationCta href="/tililab/reglement" />
                </div>
                <form
                    onSubmit={submit}
                    className="mt-8 space-y-8"
                    aria-busy={processing}
                >
                    <fieldset className="space-y-4 rounded-2xl border border-border p-6">
                        <legend className="px-2 text-lg font-semibold text-tblack">
                            <TransText
                                en="Personal information"
                                fr="Informations personnelles"
                                ar="معلومات شخصية"
                            />
                        </legend>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Prénom" error={errors.first_name}>
                                <input
                                    className={inputClass}
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData('first_name', e.target.value)
                                    }
                                    required
                                />
                            </Field>
                            <Field label="Nom" error={errors.last_name}>
                                <input
                                    className={inputClass}
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData('last_name', e.target.value)
                                    }
                                    required
                                />
                            </Field>
                        </div>
                        <Field
                            label="Date de naissance"
                            error={errors.birth_date}
                        >
                            <input
                                type="date"
                                className={inputClass}
                                value={data.birth_date}
                                onChange={(e) =>
                                    setData('birth_date', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field label="CIN" error={errors.cin}>
                            <input
                                className={inputClass}
                                value={data.cin}
                                onChange={(e) => setData('cin', e.target.value)}
                                required
                            />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Ville" error={errors.city}>
                                <input
                                    className={inputClass}
                                    value={data.city}
                                    onChange={(e) =>
                                        setData('city', e.target.value)
                                    }
                                    required
                                />
                            </Field>
                            <Field label="E-mail" error={errors.email}>
                                <input
                                    type="email"
                                    className={inputClass}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                />
                            </Field>
                        </div>
                        <Field label="Téléphone" error={errors.phone}>
                            <input
                                className={inputClass}
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field
                            label="Niveau d'études"
                            error={errors.education_level}
                        >
                            <input
                                className={inputClass}
                                value={data.education_level}
                                onChange={(e) =>
                                    setData('education_level', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field label="Profession" error={errors.profession}>
                            <input
                                className={inputClass}
                                value={data.profession}
                                onChange={(e) =>
                                    setData('profession', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field
                            label="LinkedIn / Instagram / Portfolio"
                            error={errors.social_links}
                        >
                            <input
                                className={inputClass}
                                value={data.social_links}
                                onChange={(e) =>
                                    setData('social_links', e.target.value)
                                }
                            />
                        </Field>
                    </fieldset>

                    <fieldset className="space-y-4 rounded-2xl border border-border p-6">
                        <legend className="px-2 text-lg font-semibold text-tblack">
                            <TransText
                                en="Project"
                                fr="Projet soumis"
                                ar="المشروع"
                            />
                        </legend>
                        <Field
                            label="Titre du projet"
                            error={errors.project_title}
                        >
                            <input
                                className={inputClass}
                                value={data.project_title}
                                onChange={(e) =>
                                    setData('project_title', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field
                            label="Lien vers une réalisation antérieure"
                            error={errors.prior_work_link}
                        >
                            <input
                                type="url"
                                className={inputClass}
                                value={data.prior_work_link}
                                onChange={(e) =>
                                    setData('prior_work_link', e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Upload Portfolio"
                            error={errors.portfolio_file}
                        >
                            <input
                                type="file"
                                accept=".pdf,.zip"
                                onChange={(e) =>
                                    setData('portfolio_file', e.target.files[0])
                                }
                            />
                        </Field>
                        <Field
                            label="Upload Vidéo"
                            error={errors.original_video}
                        >
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                    setData('original_video', e.target.files[0])
                                }
                            />
                        </Field>
                        {/* <Field label="Lien vidéo" error={errors.original_video_link}>
                            <input type="url" className={inputClass} value={data.original_video_link} onChange={(e) => setData('original_video_link', e.target.value)} />
                        </Field> */}
                        <Field
                            label="Upload Dossier PDF"
                            error={errors.pdf_dossier}
                        >
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setData('pdf_dossier', e.target.files[0])
                                }
                            />
                        </Field>
                    </fieldset>

                    <fieldset className="space-y-4 rounded-2xl border border-border p-6">
                        <Field
                            label="Présentation du candidat"
                            error={errors.candidate_presentation}
                        >
                            <textarea
                                rows={4}
                                className={inputClass}
                                value={data.candidate_presentation}
                                onChange={(e) =>
                                    setData(
                                        'candidate_presentation',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </Field>
                        <Field
                            label="Présentation du projet"
                            error={errors.project_presentation}
                        >
                            <textarea
                                rows={4}
                                className={inputClass}
                                value={data.project_presentation}
                                onChange={(e) =>
                                    setData(
                                        'project_presentation',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </Field>
                        <Field
                            label="Message principal"
                            error={errors.main_message}
                        >
                            <textarea
                                rows={3}
                                className={inputClass}
                                value={data.main_message}
                                onChange={(e) =>
                                    setData('main_message', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field label="Motivation" error={errors.motivation}>
                            <textarea
                                rows={3}
                                className={inputClass}
                                value={data.motivation}
                                onChange={(e) =>
                                    setData('motivation', e.target.value)
                                }
                                required
                            />
                        </Field>
                    </fieldset>

                    <fieldset className="space-y-3 rounded-2xl border border-border p-6">
                        <CheckRow
                            id="u30"
                            checked={data.declared_under_30}
                            onChange={(v) => setData('declared_under_30', v)}
                            label="Je certifie être âgé(e) de moins de 30 ans"
                            error={errors.declared_under_30}
                        />
                        <CheckRow
                            id="acc"
                            checked={data.declared_accuracy}
                            onChange={(v) => setData('declared_accuracy', v)}
                            label="Je certifie l'exactitude des informations"
                            error={errors.declared_accuracy}
                        />
                        <CheckRow
                            id="rights"
                            checked={data.declared_rights}
                            onChange={(v) => setData('declared_rights', v)}
                            label="Je suis titulaire des droits relatifs aux éléments transmis"
                            error={errors.declared_rights}
                        />
                        <CheckRow
                            id="rules"
                            checked={data.accepted_rules}
                            onChange={(v) => setData('accepted_rules', v)}
                            label="J'accepte le règlement Tililab"
                            error={errors.accepted_rules}
                        />
                    </fieldset>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-beta-blue py-3 text-sm font-semibold text-twhite hover:opacity-90 disabled:opacity-60"
                    >
                        {processing ? (
                            <Spinner className="size-4 text-twhite" />
                        ) : null}
                        <TransText
                            en={
                                processing
                                    ? 'Submitting…'
                                    : 'Submit application'
                            }
                            fr={
                                processing
                                    ? 'Envoi en cours…'
                                    : 'Envoyer ma candidature'
                            }
                            ar={processing ? 'جاري الإرسال…' : 'إرسال الترشح'}
                        />
                    </button>
                </form>
            </div>
        </>
    );
}

TililabParticipate.layout = (page) => <AppLayout>{page}</AppLayout>;

function Field({ label, error, children }) {
    return (
        <label className="block text-sm">
            <span className="font-semibold text-tblack">{label} *</span>
            <div className="mt-1">{children}</div>
            {error ? (
                <p className="mt-1 text-xs text-red-600">{error}</p>
            ) : null}
        </label>
    );
}

function CheckRow({ id, checked, onChange, label, error }) {
    return (
        <div>
            <div className="flex items-center gap-2">
                <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(v) => onChange(Boolean(v))}
                />
                <Label htmlFor={id} className="text-sm text-tgray">
                    {label}
                </Label>
            </div>
            {error ? (
                <p className="mt-1 text-xs text-red-600">{error}</p>
            ) : null}
        </div>
    );
}
