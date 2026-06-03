import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/contexts/TranslationContext';
import ExpertCard from '@/pages/experts/Partials/ExpertCard';
import TransText from '@/components/TransText';

export default function FeaturedExperts({ items = [] }) {
    const { t } = useTranslation();
    const list = Array.isArray(items) ? items.slice(0, 3) : [];

    if (list.length === 0) return null;

    return (
        <section className="bg-beta-white py-10">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-xs font-semibold tracking-widest text-tgray uppercase">
                            <TransText
                                en="Featured experts"
                                fr="Expertes à la Une"
                                ar="خبيرات تحت الأضواء"
                            />
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold text-tblack">
                            <TransText
                                en="Discover profiles"
                                fr="Découvrir des profils"
                                ar="اكتشف الملفات"
                            />
                        </h2>
                    </div>
                    <Link
                        href="/experts"
                        className="text-sm font-semibold text-beta-blue hover:underline"
                    >
                        {t('home.cta.findExpert') ?? 'View all'}
                    </Link>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-3">
                    {list.map((expert) => (
                        <ExpertCard key={expert.id} expert={expert} />
                    ))}
                </div>
            </div>
        </section>
    );
}
