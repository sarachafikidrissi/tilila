import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RichTextContent from '@/components/expert/RichTextContent';
import { resolveTri } from '@/lib/resolve-tri';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';

function formatDate(iso, locale) {
    if (!iso) {
        return '';
    }

    try {
        return new Intl.DateTimeFormat(
            locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US',
            { dateStyle: 'long' },
        ).format(new Date(iso));
    } catch {
        return '';
    }
}

export default function ExpertArticleShow({ article }) {
    const { locale } = useTranslation();
    const title = resolveTri(article.title, locale);
    const content = resolveTri(article.content, locale);
    const expertName = resolveTri(article.expert?.name, locale);

    return (
        <>
            <Head title={title || 'Article'} />

            <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href="/experts#experts-feed"
                    className="text-sm font-semibold text-beta-blue hover:underline"
                >
                    ←{' '}
                    <TransText
                        en="Back to feed"
                        fr="Retour au fil"
                        ar="العودة إلى الخلاصة"
                    />
                </Link>

                <time
                    dateTime={article.published_at ?? ''}
                    className="mt-6 block text-sm text-muted-foreground"
                >
                    {formatDate(article.published_at, locale)}
                </time>

                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-tblack">
                    {title}
                </h1>

                {article.expert ? (
                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4">
                        {article.expert.image ? (
                            <img
                                src={article.expert.image}
                                alt=""
                                className="size-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-12 items-center justify-center rounded-full bg-beta-blue/10 text-lg font-bold text-beta-blue">
                                {expertName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            {article.expert.public_profile_url ? (
                                <Link
                                    href={article.expert.public_profile_url}
                                    className="font-semibold text-tblack hover:text-beta-blue"
                                >
                                    {expertName}
                                </Link>
                            ) : (
                                <p className="font-semibold text-tblack">
                                    {expertName}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                <TransText
                                    en="Author"
                                    fr="Auteure"
                                    ar="الكاتبة"
                                />
                            </p>
                        </div>
                    </div>
                ) : null}

                <div className="mt-8">
                    <RichTextContent html={content} />
                </div>
            </article>
        </>
    );
}

ExpertArticleShow.layout = (page) => <AppLayout>{page}</AppLayout>;
