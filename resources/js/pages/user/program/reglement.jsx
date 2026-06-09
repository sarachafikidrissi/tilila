import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TransText from '@/components/TransText';

export default function ProgramReglement({ program, downloadUrl, backUrl }) {
    const isTilila = program === 'tilila';

    return (
        <>
            <Head
                title={
                    isTilila
                        ? 'Tilila Awards — Règlement'
                        : 'Tililab — Règlement'
                }
            />
            <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
                <Link
                    href={backUrl}
                    className="text-sm font-semibold text-beta-blue hover:underline"
                >
                    <TransText en="← Back" fr="← Retour" ar="← رجوع" />
                </Link>
                <h1 className="mt-6 text-3xl font-bold text-tblack">
                    {isTilila ? (
                        <TransText
                            en="Tilila Awards regulations"
                            fr="Règlement du concours Tilila Awards"
                            ar="نظام مسابقة تيليلا أووردز"
                        />
                    ) : (
                        <TransText
                            en="Tililab regulations"
                            fr="Règlement du concours Tililab"
                            ar="نظام مسابقة تيليلاب"
                        />
                    )}
                </h1>
                <p className="mt-4 text-sm leading-7 text-tgray">
                    <TransText
                        en="Download the official 2026 competition regulations. Participation implies full acceptance of these rules."
                        fr="Téléchargez le règlement officiel du concours 2026. La participation implique l’acceptation pleine et entière de ce règlement."
                        ar="حمّلوا النظام الرسمي لمسابقة 2026. المشاركة تعني القبول الكامل لهذا النظام."
                    />
                </p>
                <a
                    href={downloadUrl}
                    className="mt-8 inline-flex items-center justify-center rounded-full bg-beta-blue px-6 py-3 text-sm font-semibold text-twhite hover:opacity-90"
                >
                    <TransText
                        en="Download regulations"
                        fr="Télécharger le règlement"
                        ar="تحميل النظام"
                    />
                </a>
            </section>
        </>
    );
}

ProgramReglement.layout = (page) => <AppLayout>{page}</AppLayout>;
