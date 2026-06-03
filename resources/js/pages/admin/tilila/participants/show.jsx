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
                    onClick={(e) => e.stopPropagation()}
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

export default function AdminTililaSubmissionShow({ participant }) {
    const p = participant ?? {};

    return (
        <>
            <Head title={`Tilila Submission #${p.id ?? ''}`} />

            <div className="mx-auto flex w-full max-w-[min(100%,70rem)] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <div className="flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Trophée Tilila
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            {p.first_name} {p.last_name}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href="/admin/tilila/participants">Back</Link>
                        </Button>

                        {p.submission_link ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() =>
                                    window.open(
                                        p.submission_link,
                                        '_blank',
                                        'noopener,noreferrer',
                                    )
                                }
                            >
                                <ExternalLink className="size-4" />
                                Open submission link
                            </Button>
                        ) : null}

                        {p.submission_video_url ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() =>
                                    window.open(
                                        p.submission_video_url,
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
                                        'Delete this submission? This cannot be undone.',
                                    )
                                ) {
                                    router.delete(
                                        `/admin/tilila/participants/${p.id}`,
                                        {
                                            onSuccess: () =>
                                                router.visit(
                                                    '/admin/tilila/participants',
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
                    <Row label="Title" value={p.submission_title} />
                    <Row label="Description" value={p.submission_description} />
                    <Row label="Link" value={p.submission_link} />
                    {/* <Row label="Uploaded video" value={p.submission_video_url} /> */}
                    {p.submission_video_url ? (
                        <div className="pt-2">
                            <video
                                className="w-full rounded-lg ring-1 ring-border"
                                controls
                                preload="metadata"
                                src={p.submission_video_url}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}

AdminTililaSubmissionShow.layout = (page) => <AppLayout>{page}</AppLayout>;
