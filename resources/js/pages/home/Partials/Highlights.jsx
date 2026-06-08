import React from 'react';
import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';

function editionDetailsUrl(base, edition) {
    const id = edition?.id;
    if (!id) return base;
    return `${base}/editions/${id}`;
}

export default function Highlights({
    tropheeImageSrc,
    talkImageSrc,
    tililaEdition,
    tililabEdition,
}) {
    const highlights = [
        {
            enTag: 'Award',
            frTag: 'Prix',
            arTag: 'جائزة',
            enTitle: 'Tilila Awards',
            frTitle: 'Tilila Awards',
            arTitle: 'جائزة تيليلا',
            enDescription:
                'Discover editions, winners, jury, and gallery — managed dynamically from our archive.',
            frDescription:
                'Découvrez les éditions, lauréats, jury et galerie — gérés dynamiquement depuis l’archive.',
            arDescription:
                'اكتشف الدورات والفائزين ولجنة التحكيم والمعرض — تتم إدارتها ديناميكياً من الأرشيف.',
            enCta: 'View edition details',
            frCta: 'Voir les détails',
            arCta: 'عرض التفاصيل',
            href: editionDetailsUrl('/tilila', tililaEdition),
            imageSrc: tropheeImageSrc,
        },
        {
            enTag: 'Program',
            frTag: 'Programme',
            arTag: 'برنامج',
            enTitle: 'Tililab',
            frTitle: 'Tililab',
            arTitle: 'تيليلاب',
            enDescription:
                'Apply to Tililab and explore past editions & winners curated from the database.',
            frDescription:
                'Postulez à Tililab et explorez les éditions précédentes et lauréats depuis la base de données.',
            arDescription:
                'قدّم إلى تيليلاب واستكشف الدورات السابقة والفائزين من قاعدة البيانات.',
            enCta: 'Apply now',
            frCta: 'Postuler',
            arCta: 'قدّم الآن',
            href: '/tililab/form',
            imageSrc: talkImageSrc,
        },
        {
            enTag: 'Editions',
            frTag: 'Éditions',
            arTag: 'الدورات',
            enTitle: 'Tililab Editions',
            frTitle: 'Éditions Tililab',
            arTitle: 'دورات تيليلاب',
            enDescription:
                'Browse editions and open the details page (winners, jury, gallery).',
            frDescription:
                'Parcourez les éditions et ouvrez la page de détails (lauréats, jury, galerie).',
            arDescription:
                'تصفّح الدورات وافتح صفحة التفاصيل (الفائزون، لجنة التحكيم، المعرض).',
            enCta: 'View edition details',
            frCta: 'Voir les détails',
            arCta: 'عرض التفاصيل',
            href: editionDetailsUrl('/tililab', tililabEdition),
            imageSrc: talkImageSrc,
        },
    ];

    return (
        <section className="bg-background">
            <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                            <TransText
                                en="Highlighting Excellence & Dialogue"
                                fr="Mettre en lumière l’excellence et le dialogue"
                                ar="إبراز التميز والحوار"
                            />
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            <TransText
                                en="Discover our key initiatives designed to promote diversity in media and foster meaningful conversations."
                                fr="Découvrez nos initiatives clés pour promouvoir la diversité dans les médias et encourager des échanges porteurs de sens."
                                ar="اكتشف مبادراتنا الأساسية المصممة لتعزيز التنوع في الإعلام وخلق حوارات ذات معنى."
                            />
                        </p>
                    </div>
                    <Link
                        href="#initiatives"
                        className="inline-flex w-fit items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                    >
                        <TransText
                            en="View All Initiatives"
                            fr="Voir toutes les initiatives"
                            ar="عرض جميع المبادرات"
                        />
                    </Link>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {highlights.map((item) => (
                        <div
                            key={item.enTitle}
                            className="relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border"
                        >
                            <div className="relative aspect-video w-full bg-linear-to-br from-muted to-secondary">
                                {item.imageSrc ? (
                                    <img
                                        src={item.imageSrc}
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : null}
                                <div className="absolute inset-0 bg-linear-to-br from-tblack/75 via-tblack/40 to-transparent" />
                                <div className="relative flex h-full w-full flex-col justify-end p-6">
                                    <div className="inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                                        <TransText
                                            en={item.enTag}
                                            fr={item.frTag}
                                            ar={item.arTag}
                                        />
                                    </div>
                                    <div className="mt-3 text-xl font-extrabold text-white">
                                        <TransText
                                            en={item.enTitle}
                                            fr={item.frTitle}
                                            ar={item.arTitle}
                                        />
                                    </div>
                                    <div className="mt-2 max-w-md text-sm text-white/85">
                                        <TransText
                                            en={item.enDescription}
                                            fr={item.frDescription}
                                            ar={item.arDescription}
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <Link
                                            href={item.href}
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline"
                                        >
                                            <TransText
                                                en={item.enCta}
                                                fr={item.frCta}
                                                ar={item.arCta}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
