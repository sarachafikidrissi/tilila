import { useMemo, useState } from 'react';
import { EXPERT_DOMAINS } from '@/constans';
import TransText from '@/components/TransText';
import { cn } from '@/lib/utils';

const inputClass =
    'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export default function ExpertDomainsPicker({
    locale = 'fr',
    value = [],
    onChange,
    errors = {},
    maxDomains = 6,
    required = true,
}) {
    const [query, setQuery] = useState('');
    const requiredMark = required ? (
        <span className="text-alpha-danger">*</span>
    ) : null;

    const domainLabel = (domain) =>
        domain?.[locale] || domain?.fr || domain?.en || '';
    const domainKey = (domain) => domain?.fr ?? '';

    const selectedKeys = useMemo(
        () => new Set((value ?? []).map((item) => domainKey(item))),
        [value],
    );

    const selectedLabels = useMemo(
        () => (value ?? []).map((item) => domainLabel(item)).filter(Boolean),
        [value, locale],
    );

    const filteredOptions = useMemo(() => {
        const q = query.trim().toLowerCase();
        const searchable = EXPERT_DOMAINS.map((domain) => ({
            domain,
            searchText: [domain.fr, domain.en, domain.ar]
                .join(' ')
                .toLowerCase(),
        }));

        if (!q) {
            return searchable;
        }

        return searchable.filter((item) => item.searchText.includes(q));
    }, [query]);

    const toggle = (domain) => {
        const key = domainKey(domain);
        const current = value ?? [];

        if (selectedKeys.has(key)) {
            onChange(current.filter((item) => domainKey(item) !== key));
            return;
        }

        if (current.length >= maxDomains) {
            return;
        }

        onChange([...current, { en: domain.en, fr: domain.fr, ar: domain.ar }]);
    };

    const getFirstArrayError = (prefix) =>
        Object.entries(errors).find(([key]) => key.startsWith(prefix))?.[1];

    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-tblack">
                <TransText
                    en="Areas of expertise"
                    fr="Domaines d’expertise"
                    ar="مجالات الخبرة"
                />{' '}
                {requiredMark}
            </label>
            <p className="text-xs text-muted-foreground">
                <TransText
                    en={`Select up to ${maxDomains} domains from the official list.`}
                    fr={`Sélectionnez jusqu’à ${maxDomains} domaines dans la liste officielle.`}
                    ar={`اختر حتى ${maxDomains} مجالات من القائمة الرسمية.`}
                />
            </p>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={cn(inputClass, 'mt-3')}
                placeholder={
                    locale === 'fr'
                        ? 'Rechercher un domaine…'
                        : locale === 'ar'
                          ? 'ابحث عن مجال…'
                          : 'Search a domain…'
                }
            />
            <div className="mt-3 max-h-56 overflow-y-auto rounded-md border border-border bg-background p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                    {filteredOptions.map(({ domain }) => {
                        const key = domainKey(domain);
                        const checked = selectedKeys.has(key);
                        const atLimit =
                            (value?.length ?? 0) >= maxDomains && !checked;

                        return (
                            <label
                                key={key}
                                className={cn(
                                    'flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm',
                                    checked
                                        ? 'border-beta-blue bg-beta-blue/10 text-beta-blue'
                                        : 'border-border bg-card text-foreground',
                                    atLimit && 'cursor-not-allowed opacity-50',
                                )}
                            >
                                <input
                                    type="checkbox"
                                    className="mt-0.5"
                                    checked={checked}
                                    disabled={atLimit}
                                    onChange={() => toggle(domain)}
                                />
                                <span>{domainLabel(domain)}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
                <TransText en="Selected" fr="Sélection" ar="المحدد" />:{' '}
                {selectedLabels.length > 0 ? selectedLabels.join(', ') : '—'} ·{' '}
                {value?.length ?? 0}/{maxDomains}
            </p>
            {errors.expertise_domains ? (
                <p className="mt-1 text-xs text-alpha-danger">
                    {errors.expertise_domains}
                </p>
            ) : getFirstArrayError('expertise_domains.') ? (
                <p className="mt-1 text-xs text-alpha-danger">
                    {getFirstArrayError('expertise_domains.')}
                </p>
            ) : null}
        </div>
    );
}
