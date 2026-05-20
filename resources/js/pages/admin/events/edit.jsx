import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import EventForm from '@/pages/admin/events/partials/EventForm';
import {
    buildEventSubmitPayload,
    initialEventTypeFields,
    normalizeStoredStatus,
} from '@/lib/eventOptions';

function emptyTri() {
    return { en: '', fr: '', ar: '' };
}

export default function AdminEventsEdit({
    event,
    statuses = [],
    visibilities = [],
}) {
    const { data, setData, errors, setError, clearErrors } = useForm({
        ...initialEventTypeFields(event.type ?? 'tilitalks'),
        status: normalizeStoredStatus(event.status ?? statuses[0]),
        visibility: event.visibility ?? visibilities[0] ?? 'public',
        title: { ...emptyTri(), ...(event.title ?? {}) },
        location: { ...emptyTri(), ...(event.location ?? {}) },
        description: { ...emptyTri(), ...(event.description ?? {}) },
        date: event.date ?? '',
        time: event.time ?? '',
        timezone: event.timezone ?? 'GMT+1',
        cover_image_path: event.cover_image_path ?? null,
        cover_image_url: event.cover_image_url ?? null,
        cover_image: null,
        media_files: [],
        speakers: (event.speakers ?? []).map((s) => ({
            full_name: s.full_name ?? '',
            role: s.role ?? '',
            email: s.email ?? '',
            photo_path: s.photo_path ?? null,
            photo_url: s.photo_url ?? null,
        })),
        partners: (event.partners ?? []).map((p) => ({
            name: p.name ?? '',
            url: p.url ?? '',
            logo_path: p.logo_path ?? null,
            logo_url: p.logo_url ?? null,
        })),
        replay_video_url: event.replay_video_url ?? '',
        live_video_url: event.live_video_url ?? '',
        agenda:
            event.agenda &&
            typeof event.agenda === 'object' &&
            !Array.isArray(event.agenda)
                ? {
                      title:
                          typeof event.agenda.title === 'string' &&
                          event.agenda.title.trim() !== ''
                              ? event.agenda.title
                              : 'Timeline',
                      items: Array.isArray(event.agenda.items)
                          ? event.agenda.items.map((row) => ({
                                time: row?.time ?? '',
                                label: row?.label ?? '',
                            }))
                          : [],
                  }
                : { title: 'Timeline', items: [] },
    });

    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        router.post(
            `/admin/events/${encodeURIComponent(event.slug ?? '')}`,
            { ...buildEventSubmitPayload(data), _method: 'put' },
            {
                forceFormData: true,
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onError: (serverErrors) => setError(serverErrors),
            },
        );
    };

    return (
        <>
            <Head title={`Edit ${event.title?.en ?? 'event'}`} />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
                    <div>
                        <p className="text-sm font-medium text-tgray">Events</p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Edit event
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            {event.title?.en ?? 'Event'} — update the fields and
                            save.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/admin/events" className="gap-2">
                            <ChevronLeft className="size-4" />
                            Back to list
                        </Link>
                    </Button>
                </div>

                <EventForm
                    mode="edit"
                    existingMedia={event.media ?? []}
                    data={data}
                    setData={setData}
                    errors={errors}
                    statuses={statuses}
                    visibilities={visibilities}
                    submitLabel="Save changes"
                    processing={processing}
                    onSubmit={submit}
                />
            </div>
        </>
    );
}

AdminEventsEdit.layout = (page) => <AppLayout>{page}</AppLayout>;
