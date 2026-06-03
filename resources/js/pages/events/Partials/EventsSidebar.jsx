import React, { useMemo, useState } from 'react';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';

const WEEKDAY_LABELS = [
    { en: 'Sun', fr: 'Dim', ar: 'أحد' },
    { en: 'Mon', fr: 'Lun', ar: 'اثن' },
    { en: 'Tue', fr: 'Mar', ar: 'ثلا' },
    { en: 'Wed', fr: 'Mer', ar: 'أرب' },
    { en: 'Thu', fr: 'Jeu', ar: 'خمي' },
    { en: 'Fri', fr: 'Ven', ar: 'جمع' },
    { en: 'Sat', fr: 'Sam', ar: 'سبت' },
];

function pad2(n) {
    return String(n).padStart(2, '0');
}

function toIsoDate(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, delta) {
    return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function monthLabel(date, locale) {
    try {
        const tag =
            locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr-FR' : 'en-US';
        return date.toLocaleDateString(tag, {
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
    }
}

function CategoryCheckbox({ id, label, checked, onChange }) {
    return (
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 rounded border-border text-beta-blue focus:ring-ring"
            />
            <span className="font-semibold text-foreground">{label}</span>
        </label>
    );
}

function Calendar({
    monthDate,
    setMonthDate,
    selectedDayIso,
    setSelectedDayIso,
    daysWithEvents,
}) {
    const { locale, t } = useTranslation();
    const grid = useMemo(() => {
        const first = startOfMonth(monthDate);
        const firstWeekday = first.getDay();
        const start = new Date(first);
        start.setDate(first.getDate() - firstWeekday);

        const days = Array.from({ length: 42 }).map((_, idx) => {
            const d = new Date(start);
            d.setDate(start.getDate() + idx);
            const iso = toIsoDate(d);
            return {
                iso,
                day: d.getDate(),
                isInMonth: d.getMonth() === monthDate.getMonth(),
                isToday: iso === toIsoDate(new Date()),
                hasEvent: daysWithEvents.has(iso),
            };
        });

        return { days, month: monthLabel(monthDate, locale) };
    }, [daysWithEvents, locale, monthDate]);

    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-extrabold text-foreground">
                    {grid.month}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMonthDate((d) => addMonths(d, -1))}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background text-muted-foreground ring-1 ring-border hover:text-foreground"
                        aria-label={t('events.calendar.prevMonthAria')}
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={() => setMonthDate((d) => addMonths(d, 1))}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background text-muted-foreground ring-1 ring-border hover:text-foreground"
                        aria-label={t('events.calendar.nextMonthAria')}
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-[11px] font-semibold text-muted-foreground">
                {WEEKDAY_LABELS.map((w) => (
                    <div key={w.en} className="py-1 text-center">
                        <TransText en={w.en} fr={w.fr} ar={w.ar} />
                    </div>
                ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
                {grid.days.map((d) => {
                    const isSelected = selectedDayIso === d.iso;
                    const isDisabled = !d.isInMonth;

                    return (
                        <button
                            key={d.iso}
                            type="button"
                            onClick={() =>
                                setSelectedDayIso((cur) =>
                                    cur === d.iso ? null : d.iso,
                                )
                            }
                            disabled={isDisabled}
                            className={[
                                'relative inline-flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold transition',
                                isDisabled
                                    ? 'text-muted-foreground/40'
                                    : 'text-foreground hover:bg-secondary',
                                isSelected
                                    ? 'bg-beta-blue text-white hover:bg-beta-blue'
                                    : 'bg-transparent',
                                d.isToday && !isSelected
                                    ? 'ring-1 ring-beta-blue/30'
                                    : '',
                            ].join(' ')}
                            aria-label={(
                                t('events.calendar.selectDayAria') ?? ''
                            ).replace('{date}', d.iso)}
                            aria-pressed={isSelected}
                        >
                            {d.day}
                            {d.hasEvent ? (
                                <span
                                    className={[
                                        'absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full',
                                        isSelected
                                            ? 'bg-white'
                                            : 'bg-beta-blue',
                                    ].join(' ')}
                                    aria-hidden="true"
                                />
                            ) : null}
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => setSelectedDayIso(null)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
                >
                    <TransText
                        en="Clear date"
                        fr="Effacer la date"
                        ar="مسح التاريخ"
                    />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        const todayIso = toIsoDate(new Date());
                        setMonthDate(startOfMonth(new Date()));
                        setSelectedDayIso(todayIso);
                    }}
                    className="text-xs font-semibold text-beta-blue hover:underline"
                >
                    <TransText en="Today" fr="Aujourd’hui" ar="اليوم" />
                </button>
            </div>
        </div>
    );
}

function statusLabelNode(status) {
    switch (status) {
        case 'upcoming':
            return <TransText en="Upcoming" fr="À venir" ar="قادمة" />;
        case 'live':
            return <TransText en="Live" fr="En direct" ar="مباشر" />;
        case 'finished':
            return <TransText en="Finished" fr="Terminé" ar="منتهية" />;
        default:
            return (
                <span className="capitalize">
                    {String(status).replace(/-/g, ' ')}
                </span>
            );
    }
}

export default function EventsSidebar({
    categories,
    setCategories,
    selectedDayIso,
    setSelectedDayIso,
    events = [],
    eventStatuses = ['upcoming', 'live', 'finished'],
    statusFilters = {},
    setStatusFilters,
}) {
    const { t } = useTranslation();
    const initialMonth = useMemo(() => startOfMonth(new Date()), []);
    const [monthDate, setMonthDate] = useState(initialMonth);

    const daysWithEvents = useMemo(() => {
        const s = new Set();
        (events ?? []).forEach((e) => {
            if (e?.dateIso) s.add(e.dateIso);
        });
        return s;
    }, [events]);

    return (
        <div className="space-y-4">
            <Calendar
                monthDate={monthDate}
                setMonthDate={setMonthDate}
                selectedDayIso={selectedDayIso}
                setSelectedDayIso={setSelectedDayIso}
                daysWithEvents={daysWithEvents}
            />

            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
                <div className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
                    <TransText en="Status" fr="Statut" ar="الحالة" />
                </div>
                <div className="mt-4 space-y-3">
                    {(eventStatuses ?? []).map((status) => (
                        <label
                            key={status}
                            className="flex items-center gap-3 text-sm text-muted-foreground"
                            htmlFor={`evt-status-${status}`}
                        >
                            <input
                                id={`evt-status-${status}`}
                                type="checkbox"
                                checked={Boolean(statusFilters?.[status])}
                                onChange={(e) =>
                                    setStatusFilters?.((f) => ({
                                        ...f,
                                        [status]: e.target.checked,
                                    }))
                                }
                                className="h-4 w-4 rounded border-border text-beta-blue focus:ring-ring"
                            />
                            <span className="font-semibold text-foreground">
                                {statusLabelNode(status)}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
                <div className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
                    <TransText en="Categories" fr="Catégories" ar="الفئات" />
                </div>

                <div className="mt-4 space-y-3">
                    <CategoryCheckbox
                        id="cat-awards"
                        label={
                            <TransText
                                en="Tilila Awards"
                                fr="Tilila Awards"
                                ar="جوائز تيليلا"
                            />
                        }
                        checked={Boolean(categories?.awards)}
                        onChange={(checked) =>
                            setCategories((c) => ({ ...c, awards: checked }))
                        }
                    />
                    <CategoryCheckbox
                        id="cat-tililab"
                        label={
                            <TransText en="Tililab" fr="Tililab" ar="تيليلاب" />
                        }
                        checked={Boolean(categories?.tililab)}
                        onChange={(checked) =>
                            setCategories((c) => ({ ...c, tililab: checked }))
                        }
                    />
                    <CategoryCheckbox
                        id="cat-tilitalks"
                        label={
                            <TransText
                                en="TiliTalks"
                                fr="TiliTalks"
                                ar="تيلي توكس"
                            />
                        }
                        checked={Boolean(categories?.tilitalks)}
                        onChange={(checked) =>
                            setCategories((c) => ({ ...c, tilitalks: checked }))
                        }
                    />
                </div>
            </div>
        </div>
    );
}
