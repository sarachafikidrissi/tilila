import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import EventForm from '@/pages/admin/events/partials/EventForm';
import {
    buildEventSubmitPayload,
    initialEventTypeFields,
} from '@/lib/eventOptions';

function emptyTri() {
    return { en: '', fr: '', ar: '' };
}

export default function AdminEventsCreate({
    statuses = [],
    visibilities = [],
}) {
    const { data, setData, errors, setError, clearErrors } = useForm({
        ...initialEventTypeFields('tilitalks'),
        status: statuses[0] ?? 'upcoming',
        visibility: visibilities[0] ?? 'public',
        title: emptyTri(),
        location: emptyTri(),
        description: emptyTri(),
        date: '',
        time: '',
        timezone: 'GMT+1',
        cover_image_path: null,
        cover_image_url: null,
        cover_image: null,
        media_files: [],
        speakers: [],
        partners: [],
        replay_video_url: '',
        live_video_url: '',
        agenda: { title: 'Timeline', items: [] },
    });

    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        router.post('/admin/events', buildEventSubmitPayload(data), {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onError: (serverErrors) => setError(serverErrors),
        });
    };

    return (
        <>
            <Head title="Create event" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
                    <div>
                        <p className="text-sm font-medium text-tgray">Events</p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Create New Event
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Add a new event to the agenda.
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
                    mode="create"
                    data={data}
                    setData={setData}
                    errors={errors}
                    statuses={statuses}
                    visibilities={visibilities}
                    submitLabel="Publish Event"
                    processing={processing}
                    onSubmit={submit}
                />
            </div>
        </>
    );
}

AdminEventsCreate.layout = (page) => <AppLayout>{page}</AppLayout>;
