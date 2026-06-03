import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';
import MediaCard from '@/pages/user/media/partials/MediaCard';

export default function LatestMedia({ items = [] }) {
    const { locale } = useTranslation();
    const list = Array.isArray(items) ? items.slice(0, 6) : [];

    if (list.length === 0) return null;

    return (
        <section className="bg-background py-10">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-xs font-semibold tracking-widest text-tgray uppercase">
                            <TransText
                                en="Latest media"
                                fr="Derniers contenus médias"
                                ar="أحدث محتويات الوسائط"
                            />
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold text-tblack">
                            <TransText
                                en="Watch, listen, read"
                                fr="Voir, écouter, lire"
                                ar="شاهد، استمع، اقرأ"
                            />
                        </h2>
                    </div>
                    <Link
                        href="/media"
                        className="text-sm font-semibold text-beta-blue hover:underline"
                    >
                        <TransText
                            en="Explore all media"
                            fr="Explorer tous les médias"
                            ar="استكشاف كل الوسائط"
                        />
                    </Link>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {list.map((item) => (
                        <MediaCard key={item.id} item={item} locale={locale} />
                    ))}
                </div>
            </div>
        </section>
    );
}
