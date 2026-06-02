import { Head, router, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import EditionForm from '@/pages/admin/tililab/editions/partials/EditionForm';

export default function AdminTililabEditionsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        year: '',
        edition_label: { en: '', fr: '', ar: '' },
        theme: { en: '', fr: '', ar: '' },
        has_gallery: false,
        is_current: false,
        gallery_images: [],
        gallery_images_files: [],
        remove_gallery_images: [],
        winners: [],
        jury: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post('/admin/tililab/editions', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Create Tililab Edition" />

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
                            Create edition
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Add a new Tililab edition.
                        </p>
                    </div>
                </div>

                <EditionForm
                    mode="create"
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

AdminTililabEditionsCreate.layout = (page) => <AppLayout>{page}</AppLayout>;
