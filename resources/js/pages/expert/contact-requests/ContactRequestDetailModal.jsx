import { router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';

import TransText from '@/components/TransText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/contexts/TranslationContext';

const PURPOSE_LABELS = {
    interview: { en: 'Interview', fr: 'Interview', ar: 'مقابلة' },
    speaker_panel: {
        en: 'Speaker / panel',
        fr: 'Speaker / panel',
        ar: 'متحدثة',
    },
    collaboration: { en: 'Collaboration', fr: 'Collaboration', ar: 'تعاون' },
    media: { en: 'Media', fr: 'Médias', ar: 'إعلام' },
    other: { en: 'Other', fr: 'Autre', ar: 'أخرى' },
};

const STATUS_VARIANT = {
    pending: 'secondary',
    accepted: 'default',
    declined: 'destructive',
};

function purposeLabel(purpose, locale) {
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
}

function statusLabel(status, locale) {
    const map = {
        pending: { en: 'Pending', fr: 'En attente', ar: 'قيد الانتظار' },
        accepted: { en: 'Accepted', fr: 'Acceptée', ar: 'مقبولة' },
        declined: { en: 'Declined', fr: 'Refusée', ar: 'مرفوضة' },
    };
    const L = map[status];
    if (!L) {
        return status;
    }
    if (locale === 'ar') {
        return L.ar;
    }
    if (locale === 'fr') {
        return L.fr;
    }
    return L.en;
}

function formatDate(iso) {
    if (!iso) {
        return '—';
    }
    return new Date(iso).toLocaleString();
}

function DetailRow({ label, value }) {
    return (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-3">
            <div className="text-[11px] font-extrabold tracking-wide text-muted-foreground uppercase">
                {label}
            </div>
            <div className="sm:col-span-2">
                <div className="text-sm font-semibold text-foreground">
                    {value ?? '—'}
                </div>
            </div>
        </div>
    );
}

export default function ContactRequestDetailModal({
    request,
    open,
    onOpenChange,
}) {
    const { locale } = useTranslation();
    const r = request;

    const updateStatus = (status) => {
        if (!r?.id) {
            return;
        }
        router.patch(
            `/expert/contact-requests/${r.id}`,
            { status },
            {
                preserveScroll: true,
                onSuccess: () => onOpenChange?.(false),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[min(92vh,800px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="border-b border-border px-5 py-4 text-left">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <DialogTitle className="text-xl font-extrabold tracking-tight">
                                {r?.requester_name ?? '—'}
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm">
                                <TransText
                                    en="Full contact request details"
                                    fr="Détails complets de la demande"
                                    ar="تفاصيل طلب التواصل كاملة"
                                />
                            </DialogDescription>
                        </div>
                        {r?.status ? (
                            <Badge
                                variant={
                                    STATUS_VARIANT[r.status] ?? 'secondary'
                                }
                            >
                                {statusLabel(r.status, locale)}
                            </Badge>
                        ) : null}
                    </div>
                </DialogHeader>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <div className="text-sm font-extrabold text-beta-blue">
                            <TransText en="Request" fr="Demande" ar="الطلب" />
                        </div>
                        <div className="mt-4 space-y-3">
                            <DetailRow
                                label={
                                    <TransText
                                        en="Submitted"
                                        fr="Envoyée le"
                                        ar="تاريخ الإرسال"
                                    />
                                }
                                value={formatDate(r?.created_at)}
                            />
                            <DetailRow
                                label={
                                    <TransText
                                        en="Purpose"
                                        fr="Objet"
                                        ar="الغرض"
                                    />
                                }
                                value={
                                    r?.purpose
                                        ? purposeLabel(r.purpose, locale)
                                        : null
                                }
                            />
                            {r?.reviewed_at ? (
                                <DetailRow
                                    label={
                                        <TransText
                                            en="Reviewed"
                                            fr="Traitée le"
                                            ar="تاريخ المراجعة"
                                        />
                                    }
                                    value={formatDate(r.reviewed_at)}
                                />
                            ) : null}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5">
                        <div className="text-sm font-extrabold text-beta-blue">
                            <TransText
                                en="Requester"
                                fr="Demandeur·se"
                                ar="مقدّم الطلب"
                            />
                        </div>
                        <div className="mt-4 space-y-3">
                            <DetailRow
                                label={
                                    <TransText en="Name" fr="Nom" ar="الاسم" />
                                }
                                value={r?.requester_name}
                            />
                            <DetailRow
                                label="Email"
                                value={
                                    r?.requester_email ? (
                                        <a
                                            href={`mailto:${r.requester_email}`}
                                            className="text-beta-blue hover:underline"
                                        >
                                            {r.requester_email}
                                        </a>
                                    ) : null
                                }
                            />
                            <DetailRow
                                label={
                                    <TransText
                                        en="Phone"
                                        fr="Téléphone"
                                        ar="الهاتف"
                                    />
                                }
                                value={r?.requester_phone}
                            />
                            <DetailRow
                                label={
                                    <TransText
                                        en="Organization"
                                        fr="Organisation"
                                        ar="الجهة"
                                    />
                                }
                                value={r?.requester_organization}
                            />
                        </div>
                    </div>

                    {r?.user ? (
                        <div className="rounded-2xl border border-border bg-card p-5">
                            <div className="text-sm font-extrabold text-beta-blue">
                                <TransText
                                    en="Account"
                                    fr="Compte"
                                    ar="الحساب"
                                />
                            </div>
                            <div className="mt-4 space-y-3">
                                <DetailRow
                                    label={
                                        <TransText
                                            en="Registered user"
                                            fr="Utilisateur·rice inscrit·e"
                                            ar="مستخدم مسجّل"
                                        />
                                    }
                                    value={r.user.name}
                                />
                                <DetailRow
                                    label="Email"
                                    value={
                                        r.user.email ? (
                                            <a
                                                href={`mailto:${r.user.email}`}
                                                className="text-beta-blue hover:underline"
                                            >
                                                {r.user.email}
                                            </a>
                                        ) : null
                                    }
                                />
                            </div>
                        </div>
                    ) : null}

                    <div className="rounded-2xl border border-border bg-card p-5">
                        <div className="text-sm font-extrabold text-beta-blue">
                            <TransText en="Message" fr="Message" ar="الرسالة" />
                        </div>
                        <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                            {r?.message || '—'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-4">
                    {r?.status === 'pending' ? (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-1 text-destructive hover:text-destructive"
                                onClick={() => updateStatus('declined')}
                            >
                                <X className="size-4" />
                                <TransText en="Decline" fr="Refuser" ar="رفض" />
                            </Button>
                            <Button
                                type="button"
                                className="gap-1"
                                onClick={() => updateStatus('accepted')}
                            >
                                <Check className="size-4" />
                                <TransText
                                    en="Accept"
                                    fr="Accepter"
                                    ar="قبول"
                                />
                            </Button>
                        </>
                    ) : null}
                    <Button
                        type="button"
                        variant={r?.status === 'pending' ? 'ghost' : 'default'}
                        onClick={() => onOpenChange?.(false)}
                    >
                        <TransText en="Close" fr="Fermer" ar="إغلاق" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
