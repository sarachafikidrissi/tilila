import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import ConfirmationModal from '@/components/modals/ConfirmationModal';
import SuccessModal from '@/components/modals/SuccessModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { cn } from '@/lib/utils';

import AccessRequestDetailsView from './partials/AccessRequestDetailsView';

function statusBadgeClass(status) {
    switch (status) {
        case 'approved':
            return 'border-alpha-green/40 bg-beta-green text-alpha-green';
        case 'rejected':
            return 'border-alpha-danger/40 bg-beta-danger text-alpha-danger';
        case 'revoked':
            return 'border-tgray/40 bg-muted text-tgray';
        default:
            return 'border-alpha-yellow/50 bg-beta-yellow text-alpha-yellow';
    }
}

const STATUS_TABS = [
    { value: '', labelKey: 'accessRequest.admin.filters.all' },
    { value: 'pending', labelKey: 'accessRequest.admin.filters.pending' },
    { value: 'approved', labelKey: 'accessRequest.admin.filters.approved' },
    { value: 'rejected', labelKey: 'accessRequest.admin.filters.rejected' },
];

const tabButtonClass = (active) =>
    cn(
        'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
        active
            ? 'border-beta-blue bg-beta-blue text-twhite shadow-sm hover:bg-beta-blue/90'
            : 'border-border bg-card text-tblack hover:border-beta-blue/40 hover:bg-alpha-blue/30',
    );

const approveButtonClass =
    'rounded-full bg-beta-blue text-twhite hover:bg-beta-blue/90';

const rejectButtonClass =
    'rounded-full border-alpha-danger/40 text-alpha-danger hover:bg-beta-danger';

const reacceptButtonClass =
    'rounded-full border-alpha-yellow/50 text-alpha-yellow hover:bg-beta-yellow';

export default function AdminAccessRequestsIndex({ requests, filters }) {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    const [successOpen, setSuccessOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: t('accessRequest.admin.title'), href: '#' },
        ],
        title: t('accessRequest.admin.title'),
        description: t('accessRequest.admin.description'),
    });

    useEffect(() => {
        if (flash?.success) {
            setSuccessOpen(true);
        }
    }, [flash?.success]);

    const rows = requests?.data ?? [];
    const links = requests?.links ?? [];
    const activeStatus = filters?.status ?? '';

    const setStatusFilter = (status) => {
        router.get(
            '/admin/access-requests',
            status ? { status } : {},
            { preserveState: true, replace: true },
        );
    };

    const openDetails = (row) => {
        setSelectedRequest(row);
    };

    const runConfirm = () => {
        if (!confirmAction) {
            return;
        }

        setProcessing(true);
        router.patch(
            `/admin/access-requests/${confirmAction.id}/${confirmAction.type}`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setConfirmAction(null);
                    if (
                        selectedRequest?.id === confirmAction.id
                    ) {
                        setSelectedRequest(null);
                    }
                },
            },
        );
    };

    const formatDate = (value) => {
        if (!value) {
            return '—';
        }

        return new Date(value).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const stopRowClick = (event) => {
        event.stopPropagation();
    };

    return (
        <>
            <Head title={t('accessRequest.admin.headTitle')} />

            <SuccessModal
                open={successOpen}
                onOpenChange={setSuccessOpen}
                message={flash?.success}
                title={t('accessRequest.admin.successTitle')}
            />

            <ConfirmationModal
                open={Boolean(confirmAction)}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title={
                    confirmAction?.type === 'approve'
                        ? t('accessRequest.admin.confirmApproveTitle')
                        : confirmAction?.type === 'reaccept'
                          ? t('accessRequest.admin.confirmReacceptTitle')
                          : t('accessRequest.admin.confirmRejectTitle')
                }
                description={
                    confirmAction?.type === 'approve'
                        ? t('accessRequest.admin.confirmApproveDescription')
                        : confirmAction?.type === 'reaccept'
                          ? t('accessRequest.admin.confirmReacceptDescription')
                          : t('accessRequest.admin.confirmRejectDescription')
                }
                confirmLabel={
                    confirmAction?.type === 'approve'
                        ? t('accessRequest.admin.approve')
                        : confirmAction?.type === 'reaccept'
                          ? t('accessRequest.admin.reaccept')
                          : t('accessRequest.admin.reject')
                }
                confirmVariant={
                    confirmAction?.type === 'reject'
                        ? 'destructive'
                        : confirmAction?.type === 'reaccept'
                          ? 'secondary'
                          : 'primary'
                }
                onConfirm={runConfirm}
                processing={processing}
            />

            <Dialog
                open={Boolean(selectedRequest)}
                onOpenChange={(open) => !open && setSelectedRequest(null)}
            >
                <DialogContent className="max-h-[min(90vh,800px)] max-w-2xl overflow-y-auto border-beta-blue/20 bg-background p-0 sm:max-w-2xl">
                    <DialogHeader className="border-b border-border/70 px-6 pt-6 pb-4">
                        <DialogTitle className="text-left text-xl font-bold text-tblack">
                            {t('accessRequest.admin.detailsTitle')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-6 pb-4">
                        <AccessRequestDetailsView request={selectedRequest} />
                    </div>
                    {selectedRequest?.status === 'pending' ? (
                        <DialogFooter className="gap-2 border-t border-border/70 px-6 py-4 sm:justify-end">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className={rejectButtonClass}
                                disabled={processing}
                                onClick={() =>
                                    setConfirmAction({
                                        id: selectedRequest.id,
                                        type: 'reject',
                                    })
                                }
                            >
                                {t('accessRequest.admin.reject')}
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                className={approveButtonClass}
                                disabled={processing}
                                onClick={() =>
                                    setConfirmAction({
                                        id: selectedRequest.id,
                                        type: 'approve',
                                    })
                                }
                            >
                                {t('accessRequest.admin.approve')}
                            </Button>
                        </DialogFooter>
                    ) : null}
                </DialogContent>
            </Dialog>

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-wrap gap-2">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.value || 'all'}
                            type="button"
                            className={tabButtonClass(activeStatus === tab.value)}
                            onClick={() => setStatusFilter(tab.value)}
                        >
                            {t(tab.labelKey)}
                        </button>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl border border-beta-blue/20 bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-tgray uppercase">
                                    {t('accessRequest.admin.columns.user')}
                                </TableHead>
                                <TableHead className="text-tgray uppercase">
                                    {t('accessRequest.admin.columns.email')}
                                </TableHead>
                                <TableHead className="text-tgray uppercase">
                                    {t('accessRequest.admin.columns.organization')}
                                </TableHead>
                                <TableHead className="text-tgray uppercase">
                                    {t('accessRequest.admin.columns.profession')}
                                </TableHead>
                                <TableHead className="text-tgray uppercase">
                                    {t('accessRequest.admin.columns.reason')}
                                </TableHead>
                                <TableHead className="text-tgray uppercase">
                                    {t('accessRequest.admin.columns.submitted')}
                                </TableHead>
                                <TableHead className="text-tgray uppercase">
                                    {t('accessRequest.admin.columns.status')}
                                </TableHead>
                                <TableHead className="text-right text-tgray uppercase">
                                    {t('accessRequest.admin.columns.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="py-12 text-center text-tgray"
                                    >
                                        {t('accessRequest.admin.empty')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="cursor-pointer hover:bg-alpha-blue/25"
                                        onClick={() => openDetails(row)}
                                    >
                                        <TableCell className="font-semibold text-tblack">
                                            {row.user?.name ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-tgray">
                                            {row.user?.email ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-tblack">
                                            {row.organization || '—'}
                                        </TableCell>
                                        <TableCell className="text-tblack">
                                            {row.profession || '—'}
                                        </TableCell>
                                        <TableCell
                                            className="max-w-[200px] truncate text-tgray"
                                            title={row.reason}
                                        >
                                            {row.reason}
                                        </TableCell>
                                        <TableCell className="text-tgray">
                                            {formatDate(row.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-xs',
                                                        statusBadgeClass(row.status),
                                                    )}
                                                >
                                                    {t(
                                                        `accessRequest.admin.status.${row.status}`,
                                                    )}
                                                </Badge>
                                                {row.resubmitted_at ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-alpha-yellow/50 bg-beta-yellow text-xs text-alpha-yellow"
                                                    >
                                                        {t(
                                                            'accessRequest.admin.reapplication',
                                                        )}
                                                    </Badge>
                                                ) : null}
                                            </div>
                                            {row.resubmitted_at ? (
                                                <p className="mt-1 text-xs text-tgray">
                                                    {t(
                                                        'accessRequest.admin.resubmittedAt',
                                                    )}{' '}
                                                    {formatDate(row.resubmitted_at)}
                                                </p>
                                            ) : null}
                                            {row.reviewer?.name ? (
                                                <p className="mt-1 text-xs text-tgray">
                                                    {row.reviewer.name} ·{' '}
                                                    {formatDate(row.reviewed_at)}
                                                </p>
                                            ) : null}
                                        </TableCell>
                                        <TableCell
                                            className="text-right"
                                            onClick={stopRowClick}
                                        >
                                            <div className="flex justify-end gap-2">
                                                {row.status === 'pending' ? (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            className={approveButtonClass}
                                                            onClick={() =>
                                                                setConfirmAction({
                                                                    id: row.id,
                                                                    type: 'approve',
                                                                })
                                                            }
                                                        >
                                                            {t(
                                                                'accessRequest.admin.approve',
                                                            )}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            className={
                                                                rejectButtonClass
                                                            }
                                                            onClick={() =>
                                                                setConfirmAction({
                                                                    id: row.id,
                                                                    type: 'reject',
                                                                })
                                                            }
                                                        >
                                                            {t(
                                                                'accessRequest.admin.reject',
                                                            )}
                                                        </Button>
                                                    </>
                                                ) : row.status === 'rejected' ? (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className={reacceptButtonClass}
                                                        onClick={() =>
                                                            setConfirmAction({
                                                                id: row.id,
                                                                type: 'reaccept',
                                                            })
                                                        }
                                                    >
                                                        {t('accessRequest.admin.reaccept')}
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {requests && requests.last_page > 1 ? (
                    <div className="flex flex-col items-center justify-between gap-3 text-sm text-tgray sm:flex-row">
                        <p>
                            {t('accessRequest.admin.paginationPrefix')}{' '}
                            {requests.from ?? 0}{' '}
                            {t('accessRequest.admin.paginationTo')}{' '}
                            {requests.to ?? 0}{' '}
                            {t('accessRequest.admin.paginationOf')}{' '}
                            {requests.total}{' '}
                            {t('accessRequest.admin.paginationResults')}
                        </p>
                        <nav
                            className="flex flex-wrap items-center gap-1"
                            aria-label="Pagination"
                        >
                            {links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={cn(
                                            'inline-flex min-w-9 items-center justify-center rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-alpha-blue/30',
                                            link.active &&
                                                'border-beta-blue bg-beta-blue text-twhite',
                                        )}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="inline-flex min-w-9 items-center justify-center px-3 py-1.5 text-xs text-tgray"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </nav>
                    </div>
                ) : null}
            </div>
        </>
    );
}

AdminAccessRequestsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
