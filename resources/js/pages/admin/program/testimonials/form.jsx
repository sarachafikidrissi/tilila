import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminTestimonialForm({ testimonial }) {
    const isEdit = Boolean(testimonial?.id);
    const { data, setData, post, processing, errors } = useForm({
        program: testimonial?.program ?? 'tilila',
        name: testimonial?.name ?? '',
        quote: {
            fr: testimonial?.quote?.fr ?? '',
            en: testimonial?.quote?.en ?? '',
            ar: testimonial?.quote?.ar ?? '',
        },
        role: {
            fr: testimonial?.role?.fr ?? '',
            en: testimonial?.role?.en ?? '',
            ar: testimonial?.role?.ar ?? '',
        },
        edition_year: testimonial?.edition_year ?? '',
        video_url: testimonial?.video_url ?? '',
        sort: testimonial?.sort ?? 0,
        is_published: testimonial?.is_published ?? true,
        photo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(`/admin/program/testimonials/${testimonial.id}`, {
                forceFormData: true,
                _method: 'put',
            });
        } else {
            post('/admin/program/testimonials', { forceFormData: true });
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit testimonial' : 'New testimonial'} />
            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4 p-6">
                <h1 className="text-2xl font-bold">
                    {isEdit ? 'Edit' : 'New'} testimonial
                </h1>
                <div>
                    <Label>Program</Label>
                    <select
                        className="w-full rounded-md border px-3 py-2"
                        value={data.program}
                        onChange={(e) => setData('program', e.target.value)}
                    >
                        <option value="tilila">tilila</option>
                        <option value="tililab">tililab</option>
                    </select>
                </div>
                <div>
                    <Label>Name</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name ? (
                        <p className="text-sm text-red-600">{errors.name}</p>
                    ) : null}
                </div>
                <div>
                    <Label>Quote (FR)</Label>
                    <textarea
                        className="w-full rounded-md border px-3 py-2"
                        rows={3}
                        value={data.quote.fr}
                        onChange={(e) =>
                            setData('quote', {
                                ...data.quote,
                                fr: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <Label>Role (FR)</Label>
                    <Input
                        value={data.role.fr}
                        onChange={(e) =>
                            setData('role', {
                                ...data.role,
                                fr: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <Label>Photo</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('photo', e.target.files[0])}
                    />
                </div>
                <Button type="submit" disabled={processing}>
                    Save
                </Button>
            </form>
        </AppLayout>
    );
}
