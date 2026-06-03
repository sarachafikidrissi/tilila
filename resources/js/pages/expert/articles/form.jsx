import { Head, router, setLayoutProps, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import RichTextEditor from '@/components/expert/RichTextEditor';
import TransText from '@/components/TransText';

const LANGS = [
    { code: 'fr', label: 'Français', required: true },
    { code: 'en', label: 'English', required: false },
    { code: 'ar', label: 'العربية', required: false },
];

const emptyTri = () => ({ en: '', fr: '', ar: '' });

function FieldError({ error }) {
    if (!error) {
        return null;
    }

    return <p className="mt-1 text-xs text-alpha-danger">{error}</p>;
}

export default function ExpertArticleForm({ article = null }) {
    const isEdit = Boolean(article?.id);
    const [langTab, setLangTab] = useState('fr');

    const { data, setData, processing, errors } = useForm({
        title: article?.title ?? emptyTri(),
        content: article?.content ?? emptyTri(),
        status: article?.status ?? 'draft',
    });

    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: '/expert/dashboard' },
            { title: 'Articles', href: '/expert/articles' },
            {
                title: isEdit ? 'Edit' : 'New',
                href: isEdit
                    ? `/expert/articles/${article.slug}/edit`
                    : '/expert/articles/create',
            },
        ],
        title: isEdit ? 'Edit article' : 'New article',
        description: 'French is required. English and Arabic are optional.',
    });

    const setTriField = (field, lang, value) => {
        setData(field, { ...data[field], [lang]: value });
    };

    const submit = (event) => {
        event.preventDefault();

        if (isEdit) {
            router.patch(`/expert/articles/${article.slug}`, data);
            return;
        }

        router.post('/expert/articles', data);
    };

    return (
        <>
            <Head title={isEdit ? 'Edit article' : 'New article'} />

            <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <form onSubmit={submit} className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {LANGS.map((lang) => (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => setLangTab(lang.code)}
                                className={cn(
                                    'rounded-full border px-4 py-1.5 text-sm font-semibold transition',
                                    langTab === lang.code
                                        ? 'border-beta-blue bg-beta-blue text-twhite'
                                        : 'border-border bg-card text-muted-foreground hover:text-tblack',
                                )}
                            >
                                {lang.label}
                                {lang.required ? (
                                    <span className="text-alpha-danger">
                                        {' '}
                                        *
                                    </span>
                                ) : null}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="title">
                                <TransText en="Title" fr="Titre" ar="العنوان" />
                                {langTab === 'fr' ? (
                                    <span className="text-alpha-danger">
                                        {' '}
                                        *
                                    </span>
                                ) : null}
                            </Label>
                            <Input
                                id="title"
                                value={data.title[langTab] ?? ''}
                                onChange={(e) =>
                                    setTriField(
                                        'title',
                                        langTab,
                                        e.target.value,
                                    )
                                }
                                required={langTab === 'fr'}
                            />
                            <FieldError
                                error={
                                    errors['title.fr'] ||
                                    errors[`title.${langTab}`]
                                }
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>
                                <TransText
                                    en="Content"
                                    fr="Contenu"
                                    ar="المحتوى"
                                />
                                {langTab === 'fr' ? (
                                    <span className="text-alpha-danger">
                                        {' '}
                                        *
                                    </span>
                                ) : null}
                            </Label>
                            <RichTextEditor
                                key={langTab}
                                value={data.content[langTab] ?? ''}
                                onChange={(html) =>
                                    setTriField('content', langTab, html)
                                }
                                placeholder={
                                    langTab === 'fr'
                                        ? 'Rédigez en français…'
                                        : 'Optional translation…'
                                }
                            />
                            <FieldError
                                error={
                                    errors['content.fr'] ||
                                    errors[`content.${langTab}`]
                                }
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="status">
                                <TransText
                                    en="Status"
                                    fr="Statut"
                                    ar="الحالة"
                                />
                            </Label>
                            <select
                                id="status"
                                className="flex h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                            >
                                <option value="draft">Draft / Brouillon</option>
                                <option value="published">
                                    Published / Publié
                                </option>
                            </select>
                            <FieldError error={errors.status} />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/expert/articles')}
                        >
                            <TransText en="Cancel" fr="Annuler" ar="إلغاء" />
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving…'
                                : isEdit
                                  ? 'Update'
                                  : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
