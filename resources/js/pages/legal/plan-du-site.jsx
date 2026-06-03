import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TransText from '@/components/TransText';

const TREE = [
    {
        href: '/',
        en: 'Home',
        fr: 'Accueil',
        ar: 'الرئيسية',
    },
    {
        href: '/about',
        en: 'About',
        fr: 'À propos',
        ar: 'حول',
        children: [
            {
                href: '/gouvernance',
                en: 'Governance',
                fr: 'Gouvernance',
                ar: 'الحوكمة',
            },
        ],
    },
    {
        href: '/events',
        en: 'Events',
        fr: 'Événements',
        ar: 'الفعاليات',
        children: [
            {
                href: '/tilila',
                en: 'Tilila Awards',
                fr: 'Tilila Awards',
                ar: 'جوائز تيليلا',
            },
            { href: '/tililab', en: 'Tililab', fr: 'Tililab', ar: 'تيليلاب' },
            {
                href: '/events?view=calendar',
                en: 'Calendar / TiliTalks',
                fr: 'Agenda / TiliTalks',
                ar: 'الأجندة',
            },
        ],
    },
    {
        href: '/experts',
        en: 'Experts',
        fr: 'Expertes',
        ar: 'الخبيرات',
        children: [
            {
                href: '/experts/connect',
                en: 'Tilila Connect',
                fr: 'Tilila Connect',
                ar: 'تيليلا كونكت',
            },
            { href: '/media', en: 'Media', fr: 'Média', ar: 'الإعلام' },
        ],
    },
    {
        href: '/learn',
        en: 'Learn',
        fr: 'Learn',
        ar: 'تعلم',
        children: [
            {
                href: '/learn/academy',
                en: 'Academy',
                fr: 'Academy',
                ar: 'أكاديمية',
            },
            {
                href: '/learn/opportunities',
                en: 'Opportunities',
                fr: 'Opportunités',
                ar: 'الفرص',
            },
            {
                href: '/learn/agenda',
                en: 'Agenda',
                fr: 'Agenda',
                ar: 'أجندة',
            },
        ],
    },
    {
        href: '/contact',
        en: 'Contact',
        fr: 'Contact',
        ar: 'اتصل',
    },
    {
        href: '/mentions-legales',
        en: 'Legal & RGPD',
        fr: 'Mentions légales',
        ar: 'الإشعارات القانونية',
    },
];

export default function PlanDuSite() {
    return (
        <>
            <Head title="Plan du site" />
            <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold">
                    <TransText
                        en="Site map"
                        fr="Plan du site"
                        ar="خريطة الموقع"
                    />
                </h1>
                <ul className="mt-8 space-y-6 text-sm">
                    {TREE.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="font-semibold text-beta-blue hover:underline"
                            >
                                <TransText
                                    en={item.en}
                                    fr={item.fr}
                                    ar={item.ar}
                                />
                            </Link>
                            {item.children ? (
                                <ul className="ms-4 mt-2 list-disc space-y-1 text-muted-foreground">
                                    {item.children.map((ch) => (
                                        <li key={ch.href}>
                                            <Link
                                                href={ch.href}
                                                className="hover:underline"
                                            >
                                                <TransText
                                                    en={ch.en}
                                                    fr={ch.fr}
                                                    ar={ch.ar}
                                                />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

PlanDuSite.layout = (page) => <AppLayout>{page}</AppLayout>;
