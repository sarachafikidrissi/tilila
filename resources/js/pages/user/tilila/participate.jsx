import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TransText from '@/components/TransText';
import RegulationCta from '@/components/program/RegulationCta';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const CATEGORIES = [
    { value: 'prix_jury', en: 'Jury Prize', fr: 'Prix du Jury', ar: 'جائزة لجنة التحكيم' },
    { value: 'prix_honneur', en: 'Honour Prize', fr: 'Prix d’Honneur', ar: 'جائزة الشرف' },
    { value: 'communication_online', en: 'Engaged Communication — ONLINE', fr: 'Communication Engagée — ONLINE', ar: 'التواصل الملتزم — رقمي' },
    { value: 'communication_offline', en: 'Engaged Communication — OFFLINE', fr: 'Communication Engagée — OFFLINE', ar: 'التواصل الملتزم — تقليدي' },
];

const inputClass = 'w-full rounded-md border border-border bg-background px-3 py-2 text-sm';

export default function TililaParticipate() {
    const { data, setData, post, processing, errors } = useForm({
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
        category: 'prix_jury',
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
        post('/tilila/participate', { forceFormData: true, preserveScroll: true });
    };

    return (
        <>
            <Head title="Tilila Awards — Candidature" />
            <div className="mx-auto max-w-3xl px-4 py-10">
                <Link href="/tilila" className="text-sm font-semibold text-beta-blue hover:underline">
                    <TransText en="← Back to Tilila Awards" fr="← Retour aux Tilila Awards" ar="← العودة إلى تيليلا أووردز" />
                </Link>
                <h1 className="mt-4 text-2xl font-bold text-tblack">
                    <TransText en="Submit your campaign" fr="Déposer une candidature" ar="تقديم حملة" />
                </h1>
                <div className="mt-4">
                    <RegulationCta href="/tilila/reglement" />
                </div>
                <form onSubmit={submit} className="mt-8 space-y-8">
                    <fieldset className="space-y-4 rounded-2xl border border-border p-6">
                        <legend className="px-2 text-lg font-semibold text-tblack">
                            <TransText en="General information" fr="Informations générales" ar="معلومات عامة" />
                        </legend>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Prénom / First name" error={errors.first_name} required>
                                <input className={inputClass} value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} required />
                            </Field>
                            <Field label="Nom / Last name" error={errors.last_name} required>
                                <input className={inputClass} value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} required />
                            </Field>
                        </div>
                        <Field label="Fonction / Role" error={errors.representative_role} required>
                            <input className={inputClass} value={data.representative_role} onChange={(e) => setData('representative_role', e.target.value)} required />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="E-mail" error={errors.email} required>
                                <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                            </Field>
                            <Field label="Téléphone" error={errors.phone} required>
                                <input className={inputClass} value={data.phone} onChange={(e) => setData('phone', e.target.value)} required />
                            </Field>
                        </div>
                        <Field label="Entreprise / Annonceur" error={errors.company} required>
                            <input className={inputClass} value={data.company} onChange={(e) => setData('company', e.target.value)} required />
                        </Field>
                        <Field label="Marque" error={errors.brand} required>
                            <input className={inputClass} value={data.brand} onChange={(e) => setData('brand', e.target.value)} required />
                        </Field>
                        <Field label="Agence" error={errors.agency} required>
                            <input className={inputClass} value={data.agency} onChange={(e) => setData('agency', e.target.value)} required />
                        </Field>
                    </fieldset>

                    <fieldset className="space-y-4 rounded-2xl border border-border p-6">
                        <legend className="px-2 text-lg font-semibold text-tblack">
                            <TransText en="Campaign" fr="Campagne soumise" ar="الحملة" />
                        </legend>
                        <Field label="Titre de la campagne" error={errors.campaign_title} required>
                            <input className={inputClass} value={data.campaign_title} onChange={(e) => setData('campaign_title', e.target.value)} required />
                        </Field>
                        <Field label="Date de première diffusion" error={errors.first_broadcast_date} required>
                            <input type="date" className={inputClass} value={data.first_broadcast_date} onChange={(e) => setData('first_broadcast_date', e.target.value)} required />
                        </Field>
                        <Field label="Lien de consultation" error={errors.submission_link}>
                            <input type="url" className={inputClass} value={data.submission_link} onChange={(e) => setData('submission_link', e.target.value)} />
                        </Field>
                        {/* <Field label="Catégorie" error={errors.category} required>
                            <select className={inputClass} value={data.category} onChange={(e) => setData('category', e.target.value)} required>
                                {CATEGORIES.map((c) => (
                                    <option key={c.value} value={c.value}>{c.fr}</option>
                                ))}
                            </select>
                        </Field> */}
                        <Field label="Vidéo" error={errors.submission_video}>
                            <input type="file" accept="video/*" onChange={(e) => setData('submission_video', e.target.files[0])} />
                        </Field>
                        <Field label="Audio" error={errors.submission_audio}>
                            <input type="file" accept="audio/*" onChange={(e) => setData('submission_audio', e.target.files[0])} />
                        </Field>
                        <Field label="Visuel" error={errors.submission_visual}>
                            <input type="file" accept="image/*,.pdf" onChange={(e) => setData('submission_visual', e.target.files[0])} />
                        </Field>
                        <Field label="Documents complémentaires" error={errors.extra_documents}>
                            <input type="file" multiple onChange={(e) => setData('extra_documents', Array.from(e.target.files))} />
                        </Field>
                    </fieldset>

                    <fieldset className="space-y-4 rounded-2xl border border-border p-6">
                        <legend className="px-2 text-lg font-semibold text-tblack">
                            <TransText en="Presentation" fr="Présentation" ar="عرض" />
                        </legend>
                        <Field label="Concept créatif et message principal" error={errors.creative_concept} required>
                            <textarea rows={4} className={inputClass} value={data.creative_concept} onChange={(e) => setData('creative_concept', e.target.value)} required />
                        </Field>
                        <Field label="Contribution EDI" error={errors.edi_contribution} required>
                            <textarea rows={4} className={inputClass} value={data.edi_contribution} onChange={(e) => setData('edi_contribution', e.target.value)} required />
                        </Field>
                    </fieldset>

                    <fieldset className="space-y-3 rounded-2xl border border-border p-6">
                        <CheckRow id="acc" checked={data.declared_accuracy} onChange={(v) => setData('declared_accuracy', v)} label="Je certifie l'exactitude des informations" error={errors.declared_accuracy} required />
                        <CheckRow id="rights" checked={data.declared_rights} onChange={(v) => setData('declared_rights', v)} label="Je dispose des droits nécessaires" error={errors.declared_rights} required />
                        <CheckRow id="rules" checked={data.accepted_rules} onChange={(v) => setData('accepted_rules', v)} label="J'accepte le règlement Tilila Awards" error={errors.accepted_rules} required />
                    </fieldset>

                    <button type="submit" disabled={processing} className="w-full rounded-full bg-beta-blue py-3 text-sm font-semibold text-twhite hover:opacity-90 disabled:opacity-60">
                        <TransText en="Submit application" fr="Envoyer ma candidature" ar="إرسال الترشح" />
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
            {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
        </label>
    );
}

function CheckRow({ id, checked, onChange, label, error, required = false }) {
    return (
        <div>
            <div className="flex items-center gap-2">
                <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
                <Label htmlFor={id} className="text-sm text-tgray">
                    {label}
                    {required ? <span className="text-red-600"> *</span> : null}
                </Label>
            </div>
            {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
        </div>
    );
}
