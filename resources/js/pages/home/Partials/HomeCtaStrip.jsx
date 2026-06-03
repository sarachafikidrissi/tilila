import React from 'react';
import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';

const CTAS = [
    {
        href: '/about',
        label: { en: 'Explore', fr: 'Explorer', ar: 'استكشاف' },
        style: 'bg-muted/70 text-foreground hover:bg-muted',
    },
    {
        href: '/experts',
        label: {
            en: 'Find an expert',
            fr: 'Trouver une experte',
            ar: 'ابحث عن خبيرة',
        },
        style: 'bg-beta-blue text-white hover:bg-beta-blue/90',
    },
    {
        href: '/events',
        label: { en: 'Participate', fr: 'Participer', ar: 'شارك' },
        style: 'bg-card text-foreground hover:bg-muted ring-1 ring-border',
    },
];

export default function HomeCtaStrip() {
    return (
        <section className="bg-background">
            <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
                    {CTAS.map((cta) => (
                        <Link
                            key={cta.href}
                            href={cta.href}
                            className={[
                                'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition',
                                cta.style,
                            ].join(' ')}
                        >
                            <TransText
                                en={cta.label.en}
                                fr={cta.label.fr}
                                ar={cta.label.ar}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
