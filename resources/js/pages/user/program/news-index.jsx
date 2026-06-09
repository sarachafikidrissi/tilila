import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';

export default function ProgramNewsIndex({ program, news }) {
    const { locale } = useTranslation();
    const textFor = (obj) =>
        obj?.[locale] || obj?.fr || obj?.en || obj?.ar || '';

    return (
        <>
            <Head title="Actualités" />
            <section className="mx-auto max-w-7xl px-4 py-12">
                <h1 className="text-3xl font-bold text-tblack">
                    <TransText en="News" fr="Actualités" ar="أخبار" />
                </h1>
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {news.data.map((item) => (
                        <Link
                            key={item.id}
                            href={`/actualites/${item.slug}`}
                            className="rounded-2xl border border-border p-5 hover:border-beta-blue/40"
                        >
                            <h2 className="font-semibold text-tblack">
                                {textFor(item.title)}
                            </h2>
                            {item.excerpt ? (
                                <p className="mt-2 line-clamp-3 text-sm text-tgray">
                                    {textFor(item.excerpt)}
                                </p>
                            ) : null}
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}

ProgramNewsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
