import React from 'react';
import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';
import {
    TILILA_AWARDS_LOGO,
    TILILAB_LOGO,
    TILITALKS_LOGO,
} from '@/data/tilila-brand-logos';

const MODULES = [
    {
        href: '/tilila',
        logoSrc: TILILA_AWARDS_LOGO,
        logoAlt: 'Les Débats Tilila — Trophée Tilila',
        logoClassName: 'h-14 w-full max-w-[12rem] object-contain',
        enTitle: 'Tilila Awards',
        frTitle: 'Tilila Awards',
        arTitle: 'جوائز تيليلا',
        enBody: 'Concept · Prizes · Evaluation criteria · Jury · Apply · FAQ · Sponsors · Laureates',
        frBody: 'Concept · Prix · Critères · Jury · Candidater · FAQ · Sponsors · Lauréats',
        arBody: 'المفهوم · الجوائز · المعايير · لجنة التحكيم · الترشح · الأسئلة · الرعاة · الفائزات',
    },
    {
        href: '/tililab',
        logoSrc: TILILAB_LOGO,
        logoAlt: 'Tililab',
        logoClassName: 'h-14 w-14 object-contain',
        enTitle: 'Tililab',
        frTitle: 'Tililab',
        arTitle: 'تيليلاب',
        enBody: 'Concept · Prizes · Evaluation criteria · Jury · Apply · FAQ · Sponsors · Laureates',
        frBody: 'Présentation · Prix · Critères · Jury · Candidater · FAQ · Sponsors · Lauréats',
        arBody: 'عرض · جوائز · معايير · لجنة التحكيم · ترشح · أسئلة · رعاة · فائزات',
    },
    {
        href: '/events?view=calendar',
        logoSrc: TILITALKS_LOGO,
        logoAlt: 'TiliTalks',
        logoClassName: 'h-12 w-full max-w-[10rem] object-contain',
        enTitle: 'TiliTalks',
        frTitle: 'TiliTalks',
        arTitle: 'تيلي توكس',
        enBody: '',
        frBody: '',
        arBody: '',
    },
];

export default function EventsHub({ eventsByYear = {} }) {
    const years = Object.keys(eventsByYear)
        .map((y) => parseInt(y, 10))
        .filter((y) => !Number.isNaN(y))
        .sort((a, b) => a - b);

    return (
        <div className="space-y-12">
            <div className="grid gap-6 md:grid-cols-3">
                {MODULES.map((m) => (
                    <Link
                        key={m.href}
                        href={m.href}
                        className="group flex h-full cursor-pointer flex-col rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-beta-blue focus-visible:outline-none"
                    >
                        <div className="flex h-16 items-center">
                            <img
                                src={m.logoSrc}
                                alt={m.logoAlt}
                                className={m.logoClassName}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-beta-blue">
                            <TransText
                                en={m.enTitle}
                                fr={m.frTitle}
                                ar={m.arTitle}
                            />
                        </h3>
                        {m.enBody || m.frBody || m.arBody ? (
                            <p className="mt-2 text-sm text-muted-foreground">
                                <TransText
                                    en={m.enBody}
                                    fr={m.frBody}
                                    ar={m.arBody}
                                />
                            </p>
                        ) : null}
                        <span
                            className={[
                                'inline-flex text-sm font-semibold text-beta-blue',
                                m.enBody || m.frBody || m.arBody
                                    ? 'mt-4'
                                    : 'mt-6',
                            ].join(' ')}
                        >
                            <TransText en="Open" fr="Ouvrir" ar="افتح" /> →
                        </span>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-border lg:col-span-7">
                    <h3 className="text-sm font-extrabold tracking-wide text-muted-foreground uppercase">
                        <TransText
                            en="How it works"
                            fr="Comment ça marche"
                            ar="كيف يعمل"
                        />
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                            <span className="mt-1 size-2 rounded-full bg-beta-blue" />
                            <TransText
                                en="Awards & Tililab share a common structure: concept → criteria → jury → apply → laureates by year."
                                fr="Awards & Tililab suivent une structure commune : concept → critères → jury → candidater → lauréats par année."
                                ar="الجوائز وتيليلاب لهما نفس البنية: مفهوم → معايير → لجنة تحكيم → ترشح → فائزات حسب السنة."
                            />
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-1 size-2 rounded-full bg-beta-blue" />
                            <TransText
                                en="TiliTalks are public conversations (talks, workshops, webinars) — explore replays and register for upcoming sessions."
                                fr="Les TiliTalks sont des conversations publiques (talks, ateliers, webinaires) — replays et inscriptions."
                                ar="TiliTalks حوارات عامة (لقاءات وورش وندوات) — شاهد الإعادات وسجّل للقادم."
                            />
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-1 size-2 rounded-full bg-beta-blue" />
                            <TransText
                                en="Need help choosing? Start from the hub cards above, then use the calendar filters."
                                fr="Besoin d’orientation ? Commencez par les cartes ci-dessus puis utilisez les filtres de l’agenda."
                                ar="لا تعرف من أين تبدأ؟ ابدأ ببطاقات البوابة ثم استخدم فلاتر الأجندة."
                            />
                        </li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-border bg-muted/30 p-6 lg:col-span-5">
                    <h3 className="text-sm font-extrabold tracking-wide text-muted-foreground uppercase">
                        <TransText
                            en="Quick links"
                            fr="Liens rapides"
                            ar="روابط سريعة"
                        />
                    </h3>
                    <div className="mt-4 grid gap-3">
                        <Link
                            href="/tilila"
                            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-muted/40"
                        >
                            <TransText
                                en="Tilila Awards overview →"
                                fr="Accéder à Tilila Awards →"
                                ar="Tilila Awards →"
                            />
                        </Link>
                        <Link
                            href="/tililab"
                            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-muted/40"
                        >
                            <TransText
                                en="Tililab overview →"
                                fr="Accéder à Tililab →"
                                ar="Tililab →"
                            />
                        </Link>
                        <Link
                            href="/events?view=calendar"
                            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-muted/40"
                        >
                            <TransText
                                en="Open agenda →"
                                fr="Ouvrir l’agenda →"
                                ar="افتح الأجندة →"
                            />
                        </Link>
                    </div>
                </div>
            </div>
            {/* {years.length > 0 ? (
                <div className="rounded-2xl border border-border bg-muted/30 p-6">
                    <h3 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
                        <TransText
                            en="Annual overview"
                            fr="Vue d’ensemble annuelle"
                            ar="نظرة عامة سنوية"
                        />
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {years.map((y) => (
                            <div
                                key={y}
                                className="rounded-xl border border-border bg-card px-4 py-3 text-center shadow-sm"
                            >
                                <div className="text-lg font-extrabold tabular-nums text-foreground">
                                    {eventsByYear[y] ?? eventsByYear[String(y)]}
                                </div>
                                <div className="text-xs font-medium text-muted-foreground">
                                    {y}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null} */}
        </div>
    );
}
