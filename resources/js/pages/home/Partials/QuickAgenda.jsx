import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';
import { typeLabel } from '@/lib/eventOptions';

function formatEventDate(iso, locale) {
    if (!iso || typeof iso !== 'string') {
        return '';
    }
    const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10));
    if (!y || !m || !d) {
        return iso;
    }
    const date = new Date(Date.UTC(y, m - 1, d));
    const tag = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr-FR' : 'en-US';
    try {
        return date.toLocaleDateString(tag, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
        });
    } catch {
        return iso;
    }
}

function dateParts(iso, locale) {
    if (!iso) {
        return { month: '', day: '' };
    }
    const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10));
    if (!y || !m || !d) {
        return { month: '', day: '' };
    }
    const date = new Date(Date.UTC(y, m - 1, d));
    const tag = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr-FR' : 'en-US';
    try {
        return {
            month: date
                .toLocaleDateString(tag, { month: 'short', timeZone: 'UTC' })
                .toUpperCase(),
            day: date.toLocaleDateString(tag, {
                day: '2-digit',
                timeZone: 'UTC',
            }),
        };
    } catch {
        return { month: '', day: '' };
    }
}

function StatusBadge({ status }) {
    if (status === 'live') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white uppercase">
                <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-200 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                </span>
                <TransText en="Live" fr="En direct" ar="مباشر" tag="span" />
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-beta-blue/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-beta-blue uppercase ring-1 ring-beta-blue/20">
            <TransText en="Upcoming" fr="À venir" ar="قادمة" tag="span" />
        </span>
    );
}

function AgendaCard({ row, locale }) {
    const { month, day } = dateParts(row.date, locale);
    const href = row.href ?? '/events?view=calendar';
    const isLive = row.status === 'live';

    return (
        <Link
            href={href}
            className={[
                'group flex h-full flex-col rounded-2xl border border-border bg-card p-5 text-start shadow-sm ring-1 ring-border/60 transition hover:-translate-y-0.5 hover:shadow-md',
                isLive
                    ? 'border-red-500/30 ring-red-500/20'
                    : 'hover:ring-beta-blue/25',
            ].join(' ')}
        >
            <div className="flex items-start justify-between gap-3">
                <div
                    className={[
                        'flex shrink-0 flex-col items-center justify-center rounded-xl px-3 py-2 text-center',
                        isLive
                            ? 'bg-red-600 text-white'
                            : 'bg-beta-blue/10 text-beta-blue',
                    ].join(' ')}
                >
                    <span className="text-[10px] font-bold tracking-wider">
                        {month}
                    </span>
                    <span className="text-xl leading-none font-extrabold tabular-nums">
                        {day}
                    </span>
                </div>
                <ArrowRight
                    className="size-5 shrink-0 text-muted-foreground/50 transition group-hover:translate-x-0.5 group-hover:text-beta-blue rtl:rotate-180"
                    aria-hidden
                />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge status={row.status} />
                <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {typeLabel(row.type)}
                </span>
            </div>
            <h3 className="mt-2 line-clamp-2 text-base font-bold text-foreground group-hover:text-beta-blue">
                <TransText
                    en={row.title?.en ?? ''}
                    fr={row.title?.fr ?? ''}
                    ar={row.title?.ar ?? ''}
                />
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
                <time dateTime={row.date}>
                    {formatEventDate(row.date, locale)}
                </time>
                {row.time ? (
                    <span>
                        {' · '}
                        {row.time}
                        {row.timezone ? ` (${row.timezone})` : ''}
                    </span>
                ) : null}
            </p>
            {row.locationLabel ? (
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/90">
                    {row.locationLabel}
                </p>
            ) : null}
        </Link>
    );
}

export default function QuickAgenda({ items = [] }) {
    const { locale } = useTranslation();
    const list = Array.isArray(items) ? items.slice(0, 3) : [];

    return (
        <section className="border-y border-border bg-muted/30">
            <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-beta-blue/10 px-3 py-1 text-xs font-bold tracking-wide text-beta-blue uppercase ring-1 ring-beta-blue/15">
                            <CalendarDays className="size-3.5" aria-hidden />
                            <TransText
                                en="Agenda"
                                fr="Agenda"
                                ar="الأجندة"
                                tag="span"
                            />
                        </div>
                        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                            <TransText
                                en="Upcoming events"
                                fr="Prochains événements"
                                ar="الفعاليات القادمة"
                            />
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                            <TransText
                                en="TiliTalks, Tilila Awards, and Tililab moments on the calendar—join us live or save the date."
                                fr="TiliTalks, Tilila Awards et rendez-vous Tililab au calendrier—en direct ou à noter dans votre agenda."
                                ar="تيلي توكس وجوائز تيليلا وتيليلاب في التقويم—شاركونا مباشرة أو احفظوا الموعد."
                            />
                        </p>
                    </div>
                    <Link
                        href="/events?view=calendar"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-beta-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-beta-blue/90"
                    >
                        <TransText
                            en="Full calendar"
                            fr="Calendrier complet"
                            ar="التقويم الكامل"
                        />
                        <ArrowRight
                            className="size-4 rtl:rotate-180"
                            aria-hidden
                        />
                    </Link>
                </div>

                {list.length > 0 ? (
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {list.map((row) => (
                            <AgendaCard
                                key={row.id ?? row.href}
                                row={row}
                                locale={locale}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/80 px-6 py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            <TransText
                                en="No upcoming events right now. Browse past sessions or check back soon."
                                fr="Aucun événement à venir pour le moment. Consultez les sessions passées ou revenez bientôt."
                                ar="لا توجد فعاليات قادمة حالياً. تصفّحوا الجلسات السابقة أو عودوا قريباً."
                            />
                        </p>
                        <Link
                            href="/events?view=calendar"
                            className="mt-4 inline-flex text-sm font-semibold text-beta-blue hover:underline"
                        >
                            <TransText
                                en="Open the agenda"
                                fr="Ouvrir l’agenda"
                                ar="افتح الأجندة"
                            />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
