import { useForm } from '@inertiajs/react';
import { Send, Users } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// import NewsletterEmailPreview from './NewsletterEmailPreview';

function audienceCount(stats, locale) {
    if (!stats) {
        return 0;
    }

    switch (locale) {
        case 'en':
            return stats.en ?? 0;
        case 'fr':
            return stats.fr ?? 0;
        case 'ar':
            return stats.ar ?? 0;
        default:
            return stats.total ?? 0;
    }
}

const AUDIENCE_OPTIONS = [
    { value: 'all', label: 'All', short: 'Everyone' },
    { value: 'en', label: 'English', short: 'EN' },
    { value: 'fr', label: 'French', short: 'FR' },
    { value: 'ar', label: 'Arabic', short: 'AR' },
];

export default function NewsletterComposeForm({
    localeOptions = [],
    stats = {},
    className,
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        body: '',
        locale: 'all',
    });

    const recipients = audienceCount(stats, data.locale);
    const audienceLabel =
        localeOptions.find((o) => o.value === data.locale)?.label ??
        'All subscribers';

    const bodyLength = data.body.length;
    const canSend =
        data.subject.trim().length > 0 &&
        data.body.trim().length > 0 &&
        recipients > 0;

    const submitSend = () => {
        post('/admin/newsletter/send', {
            preserveScroll: true,
            onSuccess: () => {
                reset('subject', 'body');
                setData('locale', 'all');
                setConfirmOpen(false);
            },
        });
    };

    // const previewAudience = useMemo(
    //     () =>
    //         AUDIENCE_OPTIONS.find((o) => o.value === data.locale)?.label ??
    //         audienceLabel,
    //     [data.locale, audienceLabel],
    // );

    return (
        <>
            <section
                className={cn(
                    'overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm',
                    className,
                )}
            >
                <div className="border-b border-border/60 px-5 py-4 sm:px-6">
                    <h2 className="text-base font-semibold text-tblack">
                        Compose campaign
                    </h2>
                    <p className="mt-0.5 text-sm text-tgray">
                        Draft your message, pick an audience, and preview before
                        sending.
                    </p>
                </div>

                <div className=" lg:divide-x lg:divide-border/60">
                    <div className="space-y-5 p-5 sm:p-6">
                        <div className="space-y-2">
                            <Label htmlFor="newsletter-subject">Subject</Label>
                            <Input
                                id="newsletter-subject"
                                value={data.subject}
                                onChange={(e) =>
                                    setData('subject', e.target.value)
                                }
                                placeholder="e.g. This week on TILILA"
                                maxLength={255}
                            />
                            <InputError message={errors.subject} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <Label htmlFor="newsletter-body">Message</Label>
                                <span className="text-xs tabular-nums text-tgray">
                                    {bodyLength} / 50 000
                                </span>
                            </div>
                            <textarea
                                id="newsletter-body"
                                rows={8}
                                className={cn(
                                    'flex min-h-[180px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground',
                                    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                                )}
                                value={data.body}
                                onChange={(e) =>
                                    setData('body', e.target.value)
                                }
                                placeholder="Write your newsletter. Line breaks are preserved in the email."
                            />
                            <InputError message={errors.body} />
                        </div>

                        <div className="space-y-3">
                            <Label>Audience</Label>
                            <div className="flex flex-wrap gap-2">
                                {AUDIENCE_OPTIONS.map((opt) => {
                                    const count = audienceCount(
                                        stats,
                                        opt.value,
                                    );
                                    const active = data.locale === opt.value;

                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() =>
                                                setData('locale', opt.value)
                                            }
                                            className={cn(
                                                'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                                                active
                                                    ? 'border-beta-blue bg-beta-blue/10 font-semibold text-beta-blue'
                                                    : 'border-border bg-beta-white text-tgray hover:border-beta-blue/40 hover:text-tblack',
                                            )}
                                        >
                                            <span>{opt.label}</span>
                                            <span
                                                className={cn(
                                                    'rounded-md px-1.5 py-0.5 text-xs tabular-nums',
                                                    active
                                                        ? 'bg-beta-blue/15'
                                                        : 'bg-muted',
                                                )}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.locale} />
                            {recipients === 0 ? (
                                <p className="text-xs text-alpha-danger">
                                    No subscribers in this audience. Choose
                                    another segment or wait for new sign-ups.
                                </p>
                            ) : (
                                <p className="flex items-center gap-1.5 text-xs text-tgray">
                                    <Users className="size-3.5 shrink-0" />
                                    {recipients} recipient
                                    {recipients === 1 ? '' : 's'} will receive
                                    this email.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* <div className="border-t border-border/60 bg-beta-white/50 p-4 lg:border-t-0 lg:p-5">
                        <NewsletterEmailPreview
                            subject={data.subject}
                            body={data.body}
                            audienceLabel={previewAudience}
                        />
                    </div> */}
                </div>

                <div className="flex flex-col gap-3 border-t border-border/60 bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-xs text-tgray">
                        Sends immediately to the selected audience. This cannot
                        be undone.
                    </p>
                    <Button
                        type="button"
                        className="gap-2 bg-beta-blue text-twhite hover:bg-beta-blue/90 sm:shrink-0"
                        disabled={processing || !canSend}
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Send className="size-4" />
                        {processing ? 'Sending…' : 'Send newsletter'}
                    </Button>
                </div>
            </section>

            <ConfirmationModal
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Send this newsletter?"
                description={
                    <>
                        You are about to email <strong>{audienceLabel}</strong> (
                        {recipients} recipient{recipients === 1 ? '' : 's'}).
                    </>
                }
                confirmLabel="Confirm send"
                onConfirm={submitSend}
                processing={processing}
                confirmVariant="primary"
            >
                <p className="rounded-md border border-border bg-muted/40 px-3 py-2 font-medium text-foreground">
                    {data.subject}
                </p>
            </ConfirmationModal>
        </>
    );
}
