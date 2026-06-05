import { Head, router } from '@inertiajs/react';
import { Check, Eye, X } from 'lucide-react';
import { useState } from 'react';

import TransText from '@/components/TransText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/contexts/TranslationContext';
import AppLayout from '@/layouts/app-layout';

import ContactRequestDetailModal from './ContactRequestDetailModal';

const PURPOSE_LABELS = {
    interview: { en: 'Interview', fr: 'Interview', ar: 'مقابلة' },
    speaker_panel: { en: 'Speaker / panel', fr: 'Speaker / panel', ar: 'متحدثة' },
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

function truncateMessage(text, max = 80) {
    const s = (text ?? '').trim();
    if (s.length <= max) {
        return s;
    }
    return `${s.slice(0, max)}…`;
}

export default function ExpertContactRequestsIndex({
    requests = [],
    pendingCount = 0,
}) {
    const { locale } = useTranslation();
    const rows = requests ?? [];
    const [selected, setSelected] = useState(null);

    const updateStatus = (id, status) => {
        router.patch(`/expert/contact-requests/${id}`, { status }, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Contact requests" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="border-b border-border/60 pb-6">
                    <p className="text-sm font-medium text-tgray">
                        <TransText en="Inbound" fr="Entrantes" ar="واردة" />
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight text-tblack">
                        <TransText
                            en="Contact requests"
                            fr="Demandes de contact"
                            ar="طلبات التواصل"
                        />
                    </h1>
                    {pendingCount > 0 ? (
                        <p className="mt-2 text-sm text-tgray">
                            <TransText
                                en={`${pendingCount} pending`}
                                fr={`${pendingCount} en attente`}
                                ar={`${pendingCount} قيد الانتظار`}
                            />
                        </p>
                    ) : null}
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <TransText en="Date" fr="Date" ar="التاريخ" />
                                </TableHead>
                                <TableHead>
                                    <TransText en="Purpose" fr="Objet" ar="الغرض" />
                                </TableHead>
                                <TableHead>
                                    <TransText
                                        en="Requester"
                                        fr="Demandeur·se"
                                        ar="مقدّم الطلب"
                                    />
                                </TableHead>
                                <TableHead className="max-w-xs">
                                    <TransText
                                        en="Message"
                                        fr="Message"
                                        ar="الرسالة"
                                    />
                                </TableHead>
                                <TableHead>
                                    <TransText en="Status" fr="Statut" ar="الحالة" />
                                </TableHead>
                                <TableHead className="text-right">
                                    <TransText
                                        en="Actions"
                                        fr="Actions"
                                        ar="إجراءات"
                                    />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-10 text-center text-sm text-tgray"
                                    >
                                        <TransText
                                            en="No contact requests yet."
                                            fr="Aucune demande de contact pour le moment."
                                            ar="لا توجد طلبات تواصل بعد."
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="text-xs whitespace-nowrap text-tgray">
                                            {r.created_at
                                                ? new Date(
                                                      r.created_at,
                                                  ).toLocaleString()
                                                : ''}
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold">
                                            {purposeLabel(r.purpose, locale)}
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                type="button"
                                                className="text-left hover:underline"
                                                onClick={() => setSelected(r)}
                                            >
                                                <div className="text-sm font-medium text-foreground">
                                                    {r.requester_name}
                                                </div>
                                                <div className="text-xs text-tgray">
                                                    {r.requester_email}
                                                </div>
                                            </button>
                                        </TableCell>
                                        <TableCell className="max-w-xs text-xs text-tgray">
                                            <button
                                                type="button"
                                                className="line-clamp-2 text-left hover:text-foreground hover:underline"
                                                onClick={() => setSelected(r)}
                                            >
                                                {truncateMessage(r.message)}
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    STATUS_VARIANT[r.status] ??
                                                    'secondary'
                                                }
                                            >
                                                {statusLabel(r.status, locale)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-1"
                                                    onClick={() =>
                                                        setSelected(r)
                                                    }
                                                >
                                                    <Eye className="size-3.5" />
                                                    <TransText
                                                        en="View"
                                                        fr="Voir"
                                                        ar="عرض"
                                                    />
                                                </Button>
                                                {r.status === 'pending' ? (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            className="gap-1"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    r.id,
                                                                    'accepted',
                                                                )
                                                            }
                                                        >
                                                            <Check className="size-3.5" />
                                                            <span className="sr-only">
                                                                Accept
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            className="gap-1 text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    r.id,
                                                                    'declined',
                                                                )
                                                            }
                                                        >
                                                            <X className="size-3.5" />
                                                            <span className="sr-only">
                                                                Decline
                                                            </span>
                                                        </Button>
                                                    </>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <ContactRequestDetailModal
                request={selected}
                open={Boolean(selected)}
                onOpenChange={(open) => !open && setSelected(null)}
            />
        </>
    );
}

ExpertContactRequestsIndex.layout = (page) => (
    <AppLayout>{page}</AppLayout>
);
