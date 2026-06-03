import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

function Row({ label, value }) {
    return (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-4 sm:gap-4">
            <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
            </div>
            {typeof value === 'string' && value.startsWith('http') ? (
                <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-beta-blue hover:underline sm:col-span-3"
                >
                    {value}
                </a>
            ) : (
                <div className="text-sm wrap-break-word text-foreground sm:col-span-3">
                    {value ?? '—'}
                </div>
            )}
        </div>
    );
}

export default function AdminTililabParticipantShow({ participant }) {
    const p = participant ?? {};

    return (
        <>
            <Head title={`Tililab Participant #${p.id ?? ''}`} />

            <div className="mx-auto flex w-full max-w-[min(100%,70rem)] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <div className="flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Tililab Connect
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            {p.first_name} {p.last_name}
                        </h1>
                        <p className="mt-1 text-sm text-tgray">
                            Submitted{' '}
                            {p.created_at
                                ? new Date(p.created_at).toLocaleString()
                                : '—'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href="/admin/tililab/participants">Back</Link>
                        </Button>

                        {p.original_video_link ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() =>
                                    window.open(
                                        p.original_video_link,
                                        '_blank',
                                        'noopener,noreferrer',
                                    )
                                }
                            >
                                <ExternalLink className="size-4" />
                                Open video link
                            </Button>
                        ) : null}

                        {p.original_video_url ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() =>
                                    window.open(
                                        p.original_video_url,
                                        '_blank',
                                        'noopener,noreferrer',
                                    )
                                }
                            >
                                <ExternalLink className="size-4" />
                                Open uploaded video
                            </Button>
                        ) : null}

                        <Button
                            type="button"
                            variant="destructive"
                            className="gap-2"
                            onClick={() => {
                                if (
                                    confirm(
                                        'Delete this participant? This cannot be undone.',
                                    )
                                ) {
                                    router.delete(
                                        `/admin/tililab/participants/${p.id}`,
                                        {
                                            onSuccess: () =>
                                                router.visit(
                                                    '/admin/tililab/participants',
                                                ),
                                        },
                                    );
                                }
                            }}
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                    <Row
                        label="Edition"
                        value={
                            p.edition?.year
                                ? `${p.edition.year}${p.edition.is_current ? ' (current)' : ''}`
                                : '—'
                        }
                    />
                    <Row label="Email" value={p.email} />
                    <Row label="Phone" value={p.phone} />
                    <Row label="City" value={p.city} />
                    <Row label="Country" value={p.country} />
                    <Row label="Bio" value={p.bio} />
                    <Row label="Video link" value={p.original_video_link} />
                    {p.original_video_url ? (
                        <div className="grid grid-cols-1 gap-1 sm:grid-cols-4 sm:gap-4">
                            <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                Uploaded video
                            </div>
                            <div className="sm:col-span-3">
                                <video
                                    className="w-full rounded-lg ring-1 ring-border"
                                    controls
                                    preload="metadata"
                                    src={p.original_video_url}
                                />
                            </div>
                        </div>
                    ) : (
                        <Row label="Uploaded video" value={null} />
                    )}
                    <Row label="Locale" value={p.locale} />
                    <Row label="IP" value={p.ip} />
                    <Row label="User agent" value={p.user_agent} />
                </div>
            </div>
        </>
    );
}

AdminTililabParticipantShow.layout = (page) => <AppLayout>{page}</AppLayout>;
