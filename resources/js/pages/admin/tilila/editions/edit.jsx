import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import EditionForm from '@/pages/admin/tilila/editions/partials/EditionForm';

function emptyTri() {
    return { en: '', fr: '', ar: '' };
}

export default function AdminTililaEditionsEdit({ edition }) {
    const { data, setData, errors, setError, clearErrors } = useForm({
        year: edition?.year ?? '',
        edition_label: edition?.edition_label ?? emptyTri(),
        theme: edition?.theme ?? emptyTri(),
        ceremony_video_url: edition?.ceremony_video_url ?? '',
        cover_image: null,
        cover_image_path: edition?.cover_image_path ?? null,
        winners: (edition?.winners ?? []).map((p) => ({
            ...p,
            photo: null,
            trophy: p?.trophy ?? emptyTri(),
        })),
        jury: (edition?.jury ?? []).map((p) => ({ ...p, photo: null })),
        gallery_images: edition?.gallery_images ?? [],
        gallery_images_files: [],
        remove_gallery_images: [],
        has_gallery: Boolean(edition?.has_gallery),
        is_current: Boolean(edition?.is_current),
        applications_close_at:
            edition?.applications_close_at?.slice(0, 16) ?? '',
    });

    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        router.post(
            `/admin/tilila/editions/${edition.id}`,
            { ...data, _method: 'put' },
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
            <Head title={`Edit Tilila edition ${edition?.year ?? ''}`} />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Tilila Awards
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Edit Edition
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Update the edition displayed in the archive.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/admin/tilila/editions" className="gap-2">
                            <ChevronLeft className="size-4" />
                            Back to list
                        </Link>
                    </Button>
                </div>

                <EditionForm
                    mode="edit"
                    data={data}
                    setData={setData}
                    errors={errors}
                    onSubmit={submit}
                    processing={processing}
                />
            </div>
        </>
    );
}

AdminTililaEditionsEdit.layout = (page) => <AppLayout>{page}</AppLayout>;
