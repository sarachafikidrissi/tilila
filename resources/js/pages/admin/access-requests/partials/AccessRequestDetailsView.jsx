import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/contexts/TranslationContext';
import { cn } from '@/lib/utils';

const readOnlyInputClass =
    'cursor-default border-border bg-twhite/80 text-tblack focus-visible:ring-0';

const readOnlyTextareaClass = cn(
    'flex min-h-[120px] w-full cursor-default resize-none rounded-md border border-border bg-twhite/80 px-3 py-2 text-sm text-tblack shadow-sm outline-none',
    'focus-visible:ring-0',
);

function statusBadgeClass(status) {
    switch (status) {
        case 'approved':
            return 'border-alpha-green/40 bg-beta-green text-alpha-green';
        case 'rejected':
            return 'border-alpha-danger/40 bg-beta-danger text-alpha-danger';
        default:
            return 'border-alpha-yellow/50 bg-beta-yellow text-alpha-yellow';
    }
}

function formatDate(value) {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function displayValue(value) {
    const text = (value ?? '').toString().trim();
    return text === '' ? '—' : text;
}

export default function AccessRequestDetailsView({ request }) {
    const { t } = useTranslation();

    if (!request) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-4">
                <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-[0.2em] text-tgray uppercase">
                        {t('accessRequest.admin.detailsKicker')}
                    </p>
                    <p className="text-lg font-semibold text-tblack">
                        {request.user?.name ?? '—'}
                    </p>
                    <p className="text-sm text-tgray">
                        {request.user?.email ?? '—'}
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className={cn('text-xs', statusBadgeClass(request.status))}
                >
                    {t(`accessRequest.admin.status.${request.status}`)}
                </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-tgray uppercase">
                        {t('accessRequest.admin.detailsSubmitted')}
                    </p>
                    <p className="text-sm text-tblack">
                        {formatDate(request.created_at)}
                    </p>
                </div>
                {request.reviewer?.name ? (
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-tgray uppercase">
                            {t('accessRequest.admin.detailsReviewed')}
                        </p>
                        <p className="text-sm text-tblack">
                            {request.reviewer.name} ·{' '}
                            {formatDate(request.reviewed_at)}
                        </p>
                    </div>
                ) : null}
            </div>

            <div className="space-y-6 rounded-2xl border border-beta-blue/20 bg-card/90 p-6">
                <div className="space-y-2">
                    <Label className="text-tblack">
                        {t('accessRequest.create.reasonLabel')}
                    </Label>
                    <textarea
                        readOnly
                        rows={5}
                        className={readOnlyTextareaClass}
                        value={displayValue(request.reason)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-tblack">
                        {t('accessRequest.create.organizationLabel')}
                    </Label>
                    <Input
                        readOnly
                        className={readOnlyInputClass}
                        value={displayValue(request.organization)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-tblack">
                        {t('accessRequest.create.professionLabel')}
                    </Label>
                    <Input
                        readOnly
                        className={readOnlyInputClass}
                        value={displayValue(request.profession)}
                    />
                </div>
            </div>
        </div>
    );
}
