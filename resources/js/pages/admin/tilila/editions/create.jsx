import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import EditionForm from '@/pages/admin/tilila/editions/partials/EditionForm';

function emptyTri() {
    return { en: '', fr: '', ar: '' };
}

export default function AdminTililaEditionsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        year: '',
        edition_label: emptyTri(),
        theme: emptyTri(),
        ceremony_video_url: '',
        cover_image: null,
        cover_image_path: null,
        winners: [],
        jury: [],
        gallery_images: [],
        gallery_images_files: [],
        remove_gallery_images: [],
        has_gallery: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/tilila/editions', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Create Tilila edition" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Trophée Tilila
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Create Edition
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Add a new edition to the archive.
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
                    mode="create"
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

AdminTililaEditionsCreate.layout = (page) => <AppLayout>{page}</AppLayout>;
