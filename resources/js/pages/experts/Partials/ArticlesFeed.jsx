import { Link } from '@inertiajs/react';
import { resolveTri } from '@/lib/resolve-tri';
import { excerptFromHtml } from '@/lib/html-text';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';

function formatDate(iso, locale) {
    if (!iso) {
        return '';
    }

    try {
        return new Intl.DateTimeFormat(
            locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US',
            { dateStyle: 'medium' },
        ).format(new Date(iso));
    } catch {
        return '';
    }
}

export default function ArticlesFeed({ articles = [] }) {
    const { locale } = useTranslation();

    if (!articles.length) {
        return null;
    }

    return (
        <section
            id="experts-feed"
            className="scroll-mt-16 border-t border-border/60 bg-twhite py-14"
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center sm:text-left">
                    <TransText
                        tag="h2"
                        className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
                        en="Expert voices"
                        fr="Voix d'expertes"
                        ar="أصوات الخبيرات"
                    />
                    <TransText
                        tag="p"
                        className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base"
                        en="Articles and insights from women experts in our network."
                        fr="Articles et analyses rédigés par les expertes de notre réseau."
                        ar="مقالات وتحليلات من خبيرات شبكتنا."
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => {
                        const title = resolveTri(article.title, locale);
                        const contentHtml = resolveTri(article.content, locale);
                        const excerpt = excerptFromHtml(contentHtml);
                        const expertName = resolveTri(
                            article.expert?.name,
                            locale,
                        );
                        const href = `/experts/articles/${article.slug}`;

                        return (
                            <article
                                key={article.id}
                                className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:border-beta-blue/40 hover:shadow-md"
                            >
                                <div className="flex flex-1 flex-col p-5">
                                    <time
                                        dateTime={article.published_at ?? ''}
                                        className="text-xs font-medium text-muted-foreground"
                                    >
                                        {formatDate(
                                            article.published_at,
                                            locale,
                                        )}
                                    </time>
                                    <h3 className="mt-2 text-lg font-bold text-tblack">
                                        <Link
                                            href={href}
                                            className="hover:text-beta-blue"
                                        >
                                            {title}
                                        </Link>
                                    </h3>
                                    {excerpt ? (
                                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                                            {excerpt}
                                        </p>
                                    ) : null}
                                    <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
                                        {article.expert?.image ? (
                                            <img
                                                src={article.expert.image}
                                                alt=""
                                                className="size-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-10 items-center justify-center rounded-full bg-beta-blue/10 text-sm font-bold text-beta-blue">
                                                {expertName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            {article.expert
                                                ?.public_profile_url ? (
                                                <Link
                                                    href={
                                                        article.expert
                                                            .public_profile_url
                                                    }
                                                    className="text-sm font-semibold text-tblack hover:text-beta-blue"
                                                >
                                                    {expertName}
                                                </Link>
                                            ) : (
                                                <p className="text-sm font-semibold text-tblack">
                                                    {expertName}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                <TransText
                                                    en="Expert"
                                                    fr="Experte"
                                                    ar="خبيرة"
                                                />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={href}
                                    className="border-t border-border/60 bg-muted/30 px-5 py-3 text-center text-sm font-semibold text-beta-blue transition hover:bg-beta-blue/5"
                                >
                                    <TransText
                                        en="Read article →"
                                        fr="Lire l'article →"
                                        ar="قراءة المقال ←"
                                    />
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
