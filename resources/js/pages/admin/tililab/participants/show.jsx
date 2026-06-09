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

export default function AdminTililabParticipantShow({ participant }) {
    const p = participant ?? {};

    return (
        <>
            <Head title={`Tililab Participant #${p.id ?? ''}`} />

            <div className="mx-auto flex w-full max-w-[min(100%,70rem)] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <div className="flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Tililab
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            {p.first_name} {p.last_name}
                        </h1>
                        <p className="mt-1 text-sm text-tgray">
                            {p.project_title}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href="/admin/tililab/participants">Back</Link>
                        </Button>

                        {p.prior_work_link ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() =>
                                    window.open(
                                        p.prior_work_link,
                                        '_blank',
                                        'noopener,noreferrer',
                                    )
                                }
                            >
                                <ExternalLink className="size-4" />
                                Prior work
                            </Button>
                        ) : null}

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
                                Video link
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
                    <ParticipantRow
                        label="Edition"
                        value={
                            p.edition?.year
                                ? `${p.edition.year}${p.edition.is_current ? ' (current)' : ''}`
                                : '—'
                        }
                    />
                    <ParticipantRow label="Email" value={p.email} />
                    <ParticipantRow label="Phone" value={p.phone} />
                    <ParticipantRow label="City" value={p.city} />
                    <ParticipantRow label="Country" value={p.country} />
                    <ParticipantRow
                        label="Birth date"
                        value={formatParticipantDate(p.birth_date)}
                    />
                    <ParticipantRow label="CIN" value={p.cin} />
                    <ParticipantRow
                        label="Education"
                        value={p.education_level}
                    />
                    <ParticipantRow label="Profession" value={p.profession} />
                    <ParticipantRow
                        label="Social links"
                        value={p.social_links}
                    />
                    <ParticipantRow
                        label="Project title"
                        value={p.project_title}
                    />
                    <ParticipantRow
                        label="Candidate presentation"
                        value={p.candidate_presentation}
                    />
                    <ParticipantRow
                        label="Project presentation"
                        value={p.project_presentation}
                    />
                    <ParticipantRow
                        label="Main message"
                        value={p.main_message}
                    />
                    <ParticipantRow label="Motivation" value={p.motivation} />
                    <ParticipantFileLink
                        label="Uploaded video"
                        url={p.original_video_url}
                    />
                    <ParticipantFileLink
                        label="Portfolio"
                        url={p.portfolio_url}
                    />
                    <ParticipantFileLink
                        label="PDF dossier"
                        url={p.pdf_dossier_url}
                    />
                    <ParticipantRow
                        label="Declarations"
                        value={`Under 30: ${p.declared_under_30 ? 'yes' : 'no'} | Accuracy: ${p.declared_accuracy ? 'yes' : 'no'} | Rights: ${p.declared_rights ? 'yes' : 'no'} | Rules: ${p.accepted_rules ? 'yes' : 'no'}`}
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

AdminTililabParticipantShow.layout = (page) => <AppLayout>{page}</AppLayout>;
