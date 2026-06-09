import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import {
    formatParticipantDate,
    formatParticipantDateTime,
    ParticipantFileLink,
    ParticipantRow,
} from '@/pages/admin/shared/ParticipantShowRows';

export default function AdminTililaSubmissionShow({ participant }) {
    const p = participant ?? {};
    const extraDocs = Array.isArray(p.extra_document_paths)
        ? p.extra_document_paths
        : [];

    return (
        <>
            <Head title={`Tilila Submission #${p.id ?? ''}`} />

            <div className="mx-auto flex w-full max-w-[min(100%,70rem)] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <div className="flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Tilila Awards
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            {p.first_name} {p.last_name}
                        </h1>
                        <p className="mt-1 text-sm text-tgray">
                            {p.company} — {p.campaign_title}
                        </p>
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
                                Campaign link
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
                    <ParticipantRow
                        label="Edition"
                        value={
                            p.edition?.year
                                ? `${p.edition.year}${p.edition.is_current ? ' (current)' : ''}`
                                : '—'
                        }
                    />
                    <ParticipantRow
                        label="Representative role"
                        value={p.representative_role}
                    />
                    <ParticipantRow label="Email" value={p.email} />
                    <ParticipantRow label="Phone" value={p.phone} />
                    <ParticipantRow label="Company" value={p.company} />
                    <ParticipantRow label="Brand" value={p.brand} />
                    <ParticipantRow label="Agency" value={p.agency} />
                    <ParticipantRow label="City" value={p.city} />
                    <ParticipantRow label="Country" value={p.country} />
                    <ParticipantRow
                        label="Campaign title"
                        value={p.campaign_title}
                    />
                    <ParticipantRow
                        label="First broadcast"
                        value={formatParticipantDate(p.first_broadcast_date)}
                    />
                    <ParticipantRow label="Category" value={p.category} />
                    <ParticipantRow
                        label="Creative concept"
                        value={p.creative_concept}
                    />
                    <ParticipantRow
                        label="EDI contribution"
                        value={p.edi_contribution}
                    />
                    <ParticipantRow
                        label="Submission link"
                        value={p.submission_link}
                    />
                    <ParticipantFileLink
                        label="Video file"
                        url={p.submission_video_url}
                    />
                    <ParticipantFileLink label="Audio file" url={p.audio_url} />
                    <ParticipantFileLink
                        label="Visual file"
                        url={p.visual_url}
                    />
                    {extraDocs.map((_, index) => (
                        <ParticipantFileLink
                            key={`extra-${index}`}
                            label={`Extra document ${index + 1}`}
                            url={`/admin/tilila/participants/${p.id}/files/extra-${index}`}
                        />
                    ))}
                    <ParticipantRow
                        label="Declarations"
                        value={`Accuracy: ${p.declared_accuracy ? 'yes' : 'no'} | Rights: ${p.declared_rights ? 'yes' : 'no'} | Rules: ${p.accepted_rules ? 'yes' : 'no'}`}
                    />
                    <ParticipantRow
                        label="Submitted at"
                        value={formatParticipantDateTime(p.created_at)}
                    />
                </div>
            </div>
        </>
    );
}

AdminTililaSubmissionShow.layout = (page) => <AppLayout>{page}</AppLayout>;
