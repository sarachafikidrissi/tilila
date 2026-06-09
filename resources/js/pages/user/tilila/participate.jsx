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

export default function TililaParticipate() {
    const [resultModal, setResultModal] = useState(null);
    const [errorSummary, setErrorSummary] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            first_name: '',
            last_name: '',
            representative_role: '',
            email: '',
            phone: '',
            company: '',
            brand: '',
            agency: '',
            city: '',
            country: 'ma',
            campaign_title: '',
            first_broadcast_date: '',
            submission_link: '',
            creative_concept: '',
            edi_contribution: '',
            submission_video: null,
            submission_audio: null,
            submission_visual: null,
            extra_documents: [],
            declared_accuracy: false,
            declared_rights: false,
            accepted_rules: false,
        });

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        setResultModal(null);
        setErrorSummary('');

        post('/tilila/participate', {
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
            <Head title="Tilila Awards — Candidature" />

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
                                        en="Thank you. We received your Tilila Awards application and sent a confirmation email when possible."
                                        fr="Merci. Nous avons bien reçu votre candidature Tilila Awards et un e-mail de confirmation vous a été envoyé lorsque possible."
                                        ar="شكراً. استلمنا ترشحكم لتيليلا أووردز وأرسلنا بريداً تأكيدياً عند الإمكان."
                                    />
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-center">
                                <Button
                                    asChild
                                    className="rounded-full bg-beta-blue text-twhite hover:bg-beta-blue/90"
                                >
                                    <Link href="/tilila">
                                        <TransText
                                            en="Back to Tilila Awards"
                                            fr="Retour aux Tilila Awards"
                                            ar="العودة إلى تيليلا أووردز"
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
                    href="/tilila"
                    className="text-sm font-semibold text-beta-blue hover:underline"
                >
                    <TransText
                        en="← Back to Tilila Awards"
                        fr="← Retour aux Tilila Awards"
                        ar="← العودة إلى تيليلا أووردز"
                    />
                </Link>
                <h1 className="mt-4 text-2xl font-bold text-tblack">
                    <TransText
                        en="Submit your campaign"
                        fr="Déposer une candidature"
                        ar="تقديم حملة"
                    />
                </h1>
                <div className="mt-4">
                    <RegulationCta href="/tilila/reglement" />
                </div>
                <form
                    onSubmit={submit}
                    className="mt-8 space-y-8"
                    aria-busy={processing}
                >
                    <fieldset className="space-y-4 rounded-2xl border border-border p-6">
                        <legend className="px-2 text-lg font-semibold text-tblack">
                            <TransText
                                en="General information"
                                fr="Informations générales"
                                ar="معلومات عامة"
                            />
                        </legend>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Prénom / First name"
                                error={errors.first_name}
                                required
                            >
                                <input
                                    className={inputClass}
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData('first_name', e.target.value)
                                    }
                                    required
                                />
                            </Field>
                            <Field
                                label="Nom / Last name"
                                error={errors.last_name}
                                required
                            >
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
                            label="Fonction / Role"
                            error={errors.representative_role}
                            required
                        >
                            <input
                                className={inputClass}
                                value={data.representative_role}
                                onChange={(e) =>
                                    setData(
                                        'representative_role',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="E-mail" error={errors.email} required>
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
                            <Field
                                label="Téléphone"
                                error={errors.phone}
                                required
                            >
                                <input
                                    className={inputClass}
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    required
                                />
                            </Field>
                        </div>
                        <Field
                            label="Entreprise / Annonceur"
                            error={errors.company}
                            required
                        >
                            <input
                                className={inputClass}
                                value={data.company}
                                onChange={(e) =>
                                    setData('company', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field label="Marque" error={errors.brand} required>
                            <input
                                className={inputClass}
                                value={data.brand}
                                onChange={(e) =>
                                    setData('brand', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field
                            label="Agence de communication "
                            error={errors.agency}
                            required
                        >
                            <input
                                className={inputClass}
                                value={data.agency}
                                onChange={(e) =>
                                    setData('agency', e.target.value)
                                }
                                required
                            />
                        </Field>
                    </fieldset>

                    <fieldset className="space-y-4 rounded-2xl border border-border p-6">
                        <legend className="px-2 text-lg font-semibold text-tblack">
                            <TransText
                                en="Campaign"
                                fr="Campagne soumise"
                                ar="الحملة"
                            />
                        </legend>
                        <Field
                            label="Titre de la campagne"
                            error={errors.campaign_title}
                            required
                        >
                            <input
                                className={inputClass}
                                value={data.campaign_title}
                                onChange={(e) =>
                                    setData('campaign_title', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field
                            label="Date de première diffusion"
                            error={errors.first_broadcast_date}
                            required
                        >
                            <input
                                type="date"
                                className={inputClass}
                                value={data.first_broadcast_date}
                                onChange={(e) =>
                                    setData(
                                        'first_broadcast_date',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </Field>
                        <Field
                            label="Lien de consultation"
                            error={errors.submission_link}
                        >
                            <input
                                type="url"
                                className={inputClass}
                                value={data.submission_link}
                                onChange={(e) =>
                                    setData('submission_link', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Vidéo" error={errors.submission_video}>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                    setData(
                                        'submission_video',
                                        e.target.files[0],
                                    )
                                }
                            />
                        </Field>
                        <Field label="Audio" error={errors.submission_audio}>
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) =>
                                    setData(
                                        'submission_audio',
                                        e.target.files[0],
                                    )
                                }
                            />
                        </Field>
                        <Field label="Visuel" error={errors.submission_visual}>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                    setData(
                                        'submission_visual',
                                        e.target.files[0],
                                    )
                                }
                            />
                        </Field>
                        <Field
                            label="Documents complémentaires"
                            error={errors.extra_documents}
                        >
                            <input
                                type="file"
                                multiple
                                onChange={(e) =>
                                    setData(
                                        'extra_documents',
                                        Array.from(e.target.files),
                                    )
                                }
                            />
                        </Field>
                    </fieldset>

                    <fieldset className="space-y-4 rounded-2xl border border-border p-6">
                        <legend className="px-2 text-lg font-semibold text-tblack">
                            <TransText
                                en="Presentation"
                                fr="Présentation"
                                ar="عرض"
                            />
                        </legend>
                        <Field
                            label="Concept créatif et message principal"
                            error={errors.creative_concept}
                            required
                        >
                            <textarea
                                rows={4}
                                className={inputClass}
                                value={data.creative_concept}
                                onChange={(e) =>
                                    setData('creative_concept', e.target.value)
                                }
                                required
                            />
                        </Field>
                        <Field
                            label="Contribution EDI"
                            error={errors.edi_contribution}
                            required
                        >
                            <textarea
                                rows={4}
                                className={inputClass}
                                value={data.edi_contribution}
                                onChange={(e) =>
                                    setData('edi_contribution', e.target.value)
                                }
                                required
                            />
                        </Field>
                    </fieldset>

                    <fieldset className="space-y-3 rounded-2xl border border-border p-6">
                        <CheckRow
                            id="acc"
                            checked={data.declared_accuracy}
                            onChange={(v) => setData('declared_accuracy', v)}
                            label="Je certifie l'exactitude des informations"
                            error={errors.declared_accuracy}
                            required
                        />
                        <CheckRow
                            id="rights"
                            checked={data.declared_rights}
                            onChange={(v) => setData('declared_rights', v)}
                            label="Je dispose des droits nécessaires"
                            error={errors.declared_rights}
                            required
                        />
                        <CheckRow
                            id="rules"
                            checked={data.accepted_rules}
                            onChange={(v) => setData('accepted_rules', v)}
                            label="J'accepte le règlement Tilila Awards"
                            error={errors.accepted_rules}
                            required
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

TililaParticipate.layout = (page) => <AppLayout>{page}</AppLayout>;

function Field({ label, error, required = false, children }) {
    return (
        <label className="block text-sm">
            <span className="font-semibold text-tblack">
                {label}
                {required ? <span className="text-red-600"> *</span> : null}
            </span>
            <div className="mt-1">{children}</div>
            {error ? (
                <p className="mt-1 text-xs text-red-600">{error}</p>
            ) : null}
        </label>
    );
}

function CheckRow({ id, checked, onChange, label, error, required = false }) {
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
                    {required ? <span className="text-red-600"> *</span> : null}
                </Label>
            </div>
            {error ? (
                <p className="mt-1 text-xs text-red-600">{error}</p>
            ) : null}
        </div>
    );
}
