import { Head, Link, router, setLayoutProps } from '@inertiajs/react';
import { FileText, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TransText from '@/components/TransText';
import { resolveTri } from '@/lib/resolve-tri';
import { useTranslation } from '@/contexts/TranslationContext';

export default function ExpertArticlesIndex({ articles = [] }) {
    const { locale } = useTranslation();

    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: '/expert/dashboard' },
            { title: 'Articles', href: '/expert/articles' },
        ],
        title: 'Articles',
        description: 'Write and publish articles for the experts feed.',
    });

    const deleteArticle = (slug) => {
        if (!window.confirm('Delete this article?')) {
            return;
        }

        router.delete(`/expert/articles/${slug}`);
    };

    return (
        <>
            <Head title="My articles" />

            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-extrabold text-tblack">
                            <TransText
                                en="Your articles"
                                fr="Vos articles"
                                ar="مقالاتك"
                            />
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            <TransText
                                en="Published posts appear on the public experts feed."
                                fr="Les articles publiés apparaissent dans le fil public des expertes."
                                ar="تظهر المقالات المنشورة في خلاصة الخبيرات العامة."
                            />
                        </p>
                    </div>
                    <Button asChild className="gap-1.5">
                        <Link href="/expert/articles/create">
                            <Plus className="size-4" />
                            <TransText
                                en="New article"
                                fr="Nouvel article"
                                ar="مقال جديد"
                            />
                        </Link>
                    </Button>
                </div>

                {articles.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-border/80 bg-card p-10 text-center">
                        <FileText className="mx-auto size-10 text-muted-foreground" />
                        <p className="mt-4 text-sm font-semibold text-tblack">
                            <TransText
                                en="No articles yet"
                                fr="Aucun article pour le moment"
                                ar="لا توجد مقالات بعد"
                            />
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/expert/articles/create">
                                <TransText
                                    en="Write your first article"
                                    fr="Rédiger votre premier article"
                                    ar="اكتبي أول مقال"
                                />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <ul className="mt-6 divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70 bg-card">
                        {articles.map((article) => {
                            const title = resolveTri(article.title, locale);

                            return (
                                <li
                                    key={article.id}
                                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-tblack">
                                            {title || '—'}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            <span className="capitalize">
                                                {article.status}
                                            </span>
                                            {article.created_at
                                                ? ` · ${article.created_at}`
                                                : ''}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {article.public_url ? (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="gap-1"
                                            >
                                                <a
                                                    href={article.public_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="size-3.5" />
                                                    <TransText
                                                        en="View"
                                                        fr="Voir"
                                                        ar="عرض"
                                                    />
                                                </a>
                                            </Button>
                                        ) : null}
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                            className="gap-1"
                                        >
                                            <Link href={article.edit_url}>
                                                <Pencil className="size-3.5" />
                                                <TransText
                                                    en="Edit"
                                                    fr="Modifier"
                                                    ar="تعديل"
                                                />
                                            </Link>
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="gap-1 text-alpha-danger hover:text-alpha-danger"
                                            onClick={() =>
                                                deleteArticle(article.slug)
                                            }
                                        >
                                            <Trash2 className="size-3.5" />
                                            <TransText
                                                en="Delete"
                                                fr="Supprimer"
                                                ar="حذف"
                                            />
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </>
    );
}
