import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import TransText from '@/components/TransText';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function Field({ label, children, error }) {
    return (
        <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground">{label}</div>
            {children}
            {error ? (
                <div className="text-xs text-alpha-danger">{error}</div>
            ) : null}
        </div>
    );
}

export default function ParticipateModal({ open, onOpenChange }) {
    const flash = usePage().props?.flash ?? {};
    const { data, setData, post, processing, errors, clearErrors, reset } =
        useForm({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            city: '',
            country: 'ma',
            submission_title: '',
            submission_description: '',
            submission_link: '',
            submission_video: null,
            accepted_rules: false,
        });

    useEffect(() => {
        clearErrors();
    }, [clearErrors]);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        post('/tilila/participate', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset();
                onOpenChange?.(false);
                requestAnimationFrame(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            },
            onError: () => {
                requestAnimationFrame(() => {
                    const el = document.getElementById(
                        'tilila-participate-scroll',
                    );
                    if (el) el.scrollTop = 0;
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    'flex max-h-[min(92vh,900px)] w-[calc(100%-1.5rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl',
                    'border-border shadow-2xl',
                )}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="border-b border-border bg-muted/30 px-5 py-4 text-start sm:px-6">
                    <DialogTitle className="text-xl font-semibold text-foreground">
                        <TransText
                            en="Participate in the Trophée Tilila"
                            fr="Participer au Trophée Tilila"
                            ar="المشاركة في جائزة تيليلا"
                        />
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        <TransText
                            en="Complete the form and accept the contest rules. You will receive an acknowledgment by email."
                            fr="Complétez le formulaire et acceptez le règlement. Un accusé de réception vous sera envoyé par e-mail."
                            ar="أكمل الاستمارة واقبل النظام. ستصلك رسالة تأكيد بالبريد."
                        />
                    </DialogDescription>
                </DialogHeader>

                <div
                    id="tilila-participate-scroll"
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
                >
                    {flash?.success ? (
                        <div className="mx-5 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 sm:mx-6">
                            {flash.success}
                        </div>
                    ) : null}

                    <div className="p-5 sm:p-6">
                        <form
                                onSubmit={submit}
                                className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
                            >
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <Field
                                        label={
                                            <TransText
                                                en="First name"
                                                fr="Prénom"
                                                ar="الاسم الأول"
                                            />
                                        }
                                        error={errors.first_name}
                                    >
                                        <Input
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData(
                                                    'first_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label={
                                            <TransText
                                                en="Last name"
                                                fr="Nom"
                                                ar="اسم العائلة"
                                            />
                                        }
                                        error={errors.last_name}
                                    >
                                        <Input
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    'last_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>

                                    <div className="sm:col-span-2">
                                        <Field
                                            label={
                                                <TransText
                                                    en="Email"
                                                    fr="E-mail"
                                                    ar="البريد الإلكتروني"
                                                />
                                            }
                                            error={errors.email}
                                        >
                                            <Input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                    </div>

                                    <Field
                                        label={
                                            <TransText
                                                en="Phone"
                                                fr="Téléphone"
                                                ar="الهاتف"
                                            />
                                        }
                                        error={errors.phone}
                                    >
                                        <Input
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData(
                                                    'phone',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label={
                                            <TransText
                                                en="Country"
                                                fr="Pays"
                                                ar="البلد"
                                            />
                                        }
                                        error={errors.country}
                                    >
                                        <Input
                                            value={data.country}
                                            onChange={(e) =>
                                                setData(
                                                    'country',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="ma"
                                        />
                                    </Field>

                                    <div className="sm:col-span-2">
                                        <Field
                                            label={
                                                <TransText
                                                    en="City"
                                                    fr="Ville"
                                                    ar="المدينة"
                                                />
                                            }
                                            error={errors.city}
                                        >
                                            <Input
                                                value={data.city}
                                                onChange={(e) =>
                                                    setData(
                                                        'city',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <Field
                                            label={
                                                <TransText
                                                    en="Submission title"
                                                    fr="Titre de la candidature"
                                                    ar="عنوان المشاركة"
                                                />
                                            }
                                            error={errors.submission_title}
                                        >
                                            <Input
                                                value={data.submission_title}
                                                onChange={(e) =>
                                                    setData(
                                                        'submission_title',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <Field
                                            label={
                                                <TransText
                                                    en="Short description"
                                                    fr="Description (courte)"
                                                    ar="وصف مختصر"
                                                />
                                            }
                                            error={
                                                errors.submission_description
                                            }
                                        >
                                            <textarea
                                                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                value={
                                                    data.submission_description
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'submission_description',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <Field
                                            label={
                                                <TransText
                                                    en="Submission video (upload)"
                                                    fr="Vidéo de soumission (upload)"
                                                    ar="فيديو المشاركة (رفع)"
                                                />
                                            }
                                            error={errors.submission_video}
                                        >
                                            <Input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) =>
                                                    setData(
                                                        'submission_video',
                                                        e.target.files?.[0] ??
                                                            null,
                                                    )
                                                }
                                            />
                                            <div className="mt-2 text-xs text-muted-foreground">
                                                <TransText
                                                    en="Upload your video (recommended). You may also use a file-sharing link if indicated by the team."
                                                    fr="Téléversez votre vidéo (recommandé). Un lien de partage peut aussi convenir selon les consignes."
                                                    ar="ارفع الفيديو (موصى به). أو رابط مشاركة حسب التعليمات."
                                                />
                                            </div>
                                        </Field>
                                    </div>

                                    <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border sm:col-span-2">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="accepted_rules_modal"
                                                checked={Boolean(
                                                    data.accepted_rules,
                                                )}
                                                onCheckedChange={(v) =>
                                                    setData(
                                                        'accepted_rules',
                                                        Boolean(v),
                                                    )
                                                }
                                            />
                                            <div className="min-w-0">
                                                <Label
                                                    htmlFor="accepted_rules_modal"
                                                    className="text-sm font-semibold text-foreground"
                                                >
                                                    <TransText
                                                        en="I accept the contest rules"
                                                        fr="J’accepte le règlement du concours"
                                                        ar="أوافق على نظام المسابقة"
                                                    />
                                                </Label>
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    <TransText
                                                        en="You must accept the rules to submit."
                                                        fr="Vous devez accepter le règlement pour soumettre."
                                                        ar="يجب قبول النظام للإرسال."
                                                    />
                                                </div>
                                                {errors.accepted_rules ? (
                                                    <div className="mt-2 text-xs text-alpha-danger">
                                                        {errors.accepted_rules}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-2 sm:col-span-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onOpenChange?.(false)
                                            }
                                            className="rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                                        >
                                            <TransText
                                                en="Cancel"
                                                fr="Annuler"
                                                ar="إلغاء"
                                            />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={[
                                                'inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold text-white shadow-sm',
                                                !processing
                                                    ? 'bg-beta-blue hover:opacity-90'
                                                    : 'cursor-not-allowed bg-muted text-muted-foreground',
                                            ].join(' ')}
                                        >
                                            <TransText
                                                en={
                                                    processing
                                                        ? 'Submitting…'
                                                        : 'Submit participation'
                                                }
                                                fr={
                                                    processing
                                                        ? 'Envoi…'
                                                        : 'Envoyer la participation'
                                                }
                                                ar={
                                                    processing
                                                        ? 'جارٍ الإرسال…'
                                                        : 'إرسال المشاركة'
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
