import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import EditionForm from '@/pages/admin/tililab/editions/partials/EditionForm';

export default function AdminTililabEditionsEdit({ edition }) {
    const { data, setData, errors, setError, clearErrors } = useForm({
        year: edition?.year ?? '',
        edition_label: {
            en: edition?.edition_label?.en ?? '',
            fr: edition?.edition_label?.fr ?? '',
            ar: edition?.edition_label?.ar ?? '',
        },
        theme: {
            en: edition?.theme?.en ?? '',
            fr: edition?.theme?.fr ?? '',
            ar: edition?.theme?.ar ?? '',
        },
        has_gallery: Boolean(edition?.has_gallery),
        gallery_images: Array.isArray(edition?.gallery_images)
            ? edition.gallery_images
            : [],
        gallery_images_files: [],
        remove_gallery_images: [],
        winners: Array.isArray(edition?.winners)
            ? edition.winners.map((p) => ({ ...p, photo: null }))
            : [],
        jury: Array.isArray(edition?.jury)
            ? edition.jury.map((p) => ({ ...p, photo: null }))
            : [],
    });

    const [processing, setProcessing] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        router.post(
            `/admin/tililab/editions/${edition.id}`,
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
            <Head title="Edit Tililab Edition" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-3 border-b border-border/60 pb-6 sm:pb-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.visit('/admin/tililab/editions')
                            }
                        >
                            Back
                        </Button>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Tililab
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Edit edition
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Update Tililab edition details.
                        </p>
                    </div>
                </div>

                <EditionForm
                    mode="edit"
                    data={data}
                    setData={setData}
                    errors={errors}
                    onSubmit={onSubmit}
                    processing={processing}
                />
            </div>
        </>
    );
}

AdminTililabEditionsEdit.layout = (page) => <AppLayout>{page}</AppLayout>;
