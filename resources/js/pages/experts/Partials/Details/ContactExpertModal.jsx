import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import TransText from '@/components/TransText';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/contexts/TranslationContext';
import { cn } from '@/lib/utils';
import { login } from '@/routes';

const PURPOSE_LABELS = {
    interview: {
        en: 'Interview request',
        fr: 'Demande d’interview',
        ar: 'طلب مقابلة',
    },
    speaker_panel: {
        en: 'Speaker / panel',
        fr: 'Speaker / panel',
        ar: 'متحدثة / نقاش',
    },
    collaboration: {
        en: 'Collaboration',
        fr: 'Collaboration',
        ar: 'تعاون',
    },
    media: {
        en: 'Media / press',
        fr: 'Médias / presse',
        ar: 'إعلام / صحافة',
    },
    other: {
        en: 'Other',
        fr: 'Autre',
        ar: 'أخرى',
    },
};

export default function ContactExpertModal({
    open,
    onOpenChange,
    expertId,
    contactPurposes = [],
}) {
    const { locale } = useTranslation();
    const authUser = usePage().props?.auth?.user ?? null;

    const labelForPurpose = (purpose) => {
        const L = PURPOSE_LABELS[purpose];
        if (!L) {
            return purpose;
        }
        if (locale === 'ar') {
            return L.ar;
        }
        if (locale === 'fr') {
            return L.fr;
        }
        return L.en;
    };

    const purposes =
        contactPurposes.length > 0 ? contactPurposes : Object.keys(PURPOSE_LABELS);

    const { data, setData, post, processing, errors, clearErrors, reset } =
        useForm({
            purpose: purposes[0] ?? 'interview',
            message: '',
            locale,
        });

    useEffect(() => {
        if (!open) {
            return;
        }
        clearErrors();
        setData('locale', locale);
    }, [open, locale, clearErrors, setData]);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        post(`/experts/${expertId}/contact`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange?.(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    'flex max-h-[min(92vh,720px)] w-[calc(100%-1.5rem)] max-w-lg flex-col gap-0 overflow-hidden p-0',
                    'border-border shadow-2xl',
                )}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="border-b border-border px-5 py-4 text-left">
                    <DialogTitle className="text-lg font-bold">
                        <TransText
                            en="Contact Expert"
                            fr="Contacter l’experte"
                            ar="تواصل مع الخبيرة"
                        />
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {authUser ? (
                            <TransText
                                en="Send a structured request. The expert can accept or decline after reviewing your message."
                                fr="Envoyez une demande structurée. L’experte pourra accepter ou refuser après lecture."
                                ar="أرسلي طلبًا منظمًا. يمكن للخبيرة القبول أو الرفض بعد مراجعة رسالتك."
                            />
                        ) : (
                            <TransText
                                en="Sign in to contact this expert using your account details."
                                fr="Connectez-vous pour contacter cette experte avec les informations de votre compte."
                                ar="سجّلي الدخول للتواصل مع هذه الخبيرة باستخدام بيانات حسابك."
                            />
                        )}
                    </DialogDescription>
                </DialogHeader>

                {!authUser ? (
                    <div className="px-5 py-6">
                        <Button asChild className="w-full">
                            <Link href={login()}>
                                <TransText
                                    en="Sign in"
                                    fr="Se connecter"
                                    ar="تسجيل الدخول"
                                />
                            </Link>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-3 w-full"
                            onClick={() => onOpenChange?.(false)}
                        >
                            <TransText en="Cancel" fr="Annuler" ar="إلغاء" />
                        </Button>
                    </div>
                ) : (
                    <form
                        onSubmit={submit}
                        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4"
                    >
                        {errors.contact ? (
                            <p className="mb-3 text-xs text-destructive">
                                {errors.contact}
                            </p>
                        ) : null}

                        <div className="mb-4 rounded-lg border border-border/80 bg-muted/40 px-4 py-3 text-sm">
                            <p className="font-semibold text-foreground">
                                {authUser.name}
                            </p>
                            <p className="text-muted-foreground">
                                {authUser.email}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>
                                    <TransText
                                        en="Purpose of contact"
                                        fr="Objet du contact"
                                        ar="غرض التواصل"
                                    />
                                </Label>
                                <Select
                                    value={data.purpose}
                                    onValueChange={(v) => setData('purpose', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {purposes.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {labelForPurpose(p)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.purpose ? (
                                    <p className="text-xs text-destructive">
                                        {errors.purpose}
                                    </p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_message">
                                    <TransText
                                        en="Message"
                                        fr="Message"
                                        ar="الرسالة"
                                    />
                                </Label>
                                <textarea
                                    id="contact_message"
                                    rows={5}
                                    value={data.message}
                                    onChange={(e) =>
                                        setData('message', e.target.value)
                                    }
                                    required
                                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                {errors.message ? (
                                    <p className="text-xs text-destructive">
                                        {errors.message}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange?.(false)}
                            >
                                <TransText
                                    en="Cancel"
                                    fr="Annuler"
                                    ar="إلغاء"
                                />
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <TransText
                                    en="Send request"
                                    fr="Envoyer"
                                    ar="إرسال"
                                />
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
