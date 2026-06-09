import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';

export default function ProgramNewsShow({ article, program }) {
    const { locale } = useTranslation();
    const textFor = (obj) =>
        obj?.[locale] || obj?.fr || obj?.en || obj?.ar || '';

    const backHref =
        program === 'tilila'
            ? '/tilila'
            : program === 'tililab'
              ? '/tililab'
              : '/actualites';

    return (
        <>
            <Head title={textFor(article.title)} />
            <article className="mx-auto max-w-3xl px-4 py-12">
                <Link
                    href={backHref}
                    className="text-sm font-semibold text-beta-blue hover:underline"
                >
                    <TransText en="← Back" fr="← Retour" ar="← رجوع" />
                </Link>
                <h1 className="mt-6 text-3xl font-bold text-tblack">
                    {textFor(article.title)}
                </h1>
                {article.cover_image_url ? (
                    <img
                        src={article.cover_image_url}
                        alt=""
                        className="mt-6 w-full rounded-2xl object-cover"
                    />
                ) : null}
                <div className="prose prose-sm mt-8 max-w-none text-tgray">
                    <p className="whitespace-pre-line">
                        {textFor(article.body)}
                    </p>
                </div>
            </article>
        </>
    );
}

ProgramNewsShow.layout = (page) => <AppLayout>{page}</AppLayout>;
