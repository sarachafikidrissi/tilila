import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminNewsForm({ article }) {
    const isEdit = Boolean(article?.id);
    const { data, setData, post, processing } = useForm({
        program: article?.program ?? 'tilila',
        title: {
            fr: article?.title?.fr ?? '',
            en: article?.title?.en ?? '',
            ar: article?.title?.ar ?? '',
        },
        slug: article?.slug ?? '',
        excerpt: { fr: article?.excerpt?.fr ?? '', en: '', ar: '' },
        body: { fr: article?.body?.fr ?? '', en: '', ar: '' },
        published_at: article?.published_at?.slice(0, 16) ?? '',
        is_published: article?.is_published ?? false,
        cover_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(`/admin/program/news/${article.id}`, {
                forceFormData: true,
                _method: 'put',
            });
        } else {
            post('/admin/program/news', { forceFormData: true });
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit news' : 'New news'} />
            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4 p-6">
                <h1 className="text-2xl font-bold">
                    {isEdit ? 'Edit' : 'New'} article
                </h1>
                <div>
                    <Label>Program</Label>
                    <select
                        className="w-full rounded-md border px-3 py-2"
                        value={data.program ?? ''}
                        onChange={(e) =>
                            setData('program', e.target.value || null)
                        }
                    >
                        <option value="">All</option>
                        <option value="tilila">tilila</option>
                        <option value="tililab">tililab</option>
                    </select>
                </div>
                <div>
                    <Label>Title (FR)</Label>
                    <Input
                        value={data.title.fr}
                        onChange={(e) =>
                            setData('title', {
                                ...data.title,
                                fr: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <Label>Slug</Label>
                    <Input
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                    />
                </div>
                <div>
                    <Label>Excerpt (FR)</Label>
                    <textarea
                        className="w-full rounded-md border px-3 py-2"
                        rows={2}
                        value={data.excerpt.fr}
                        onChange={(e) =>
                            setData('excerpt', {
                                ...data.excerpt,
                                fr: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <Label>Body (FR)</Label>
                    <textarea
                        className="w-full rounded-md border px-3 py-2"
                        rows={6}
                        value={data.body.fr}
                        onChange={(e) =>
                            setData('body', {
                                ...data.body,
                                fr: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <Label>Published at</Label>
                    <Input
                        type="datetime-local"
                        value={data.published_at}
                        onChange={(e) =>
                            setData('published_at', e.target.value)
                        }
                    />
                </div>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={data.is_published}
                        onChange={(e) =>
                            setData('is_published', e.target.checked)
                        }
                    />
                    Published
                </label>
                <div>
                    <Label>Cover image</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setData('cover_image', e.target.files[0])
                        }
                    />
                </div>
                <Button type="submit" disabled={processing}>
                    Save
                </Button>
            </form>
        </AppLayout>
    );
}
