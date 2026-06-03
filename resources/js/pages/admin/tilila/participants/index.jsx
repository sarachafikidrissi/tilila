import { Head, Link, router } from '@inertiajs/react';
import { Download, ExternalLink, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

const selectClassName = cn(
    'flex h-10 min-w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
);

function KpiCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {label}
                    </div>
                    <div className="mt-2 text-3xl font-bold text-foreground">
                        {value ?? 0}
                    </div>
                </div>
                {Icon ? (
                    <div className="rounded-lg border border-border bg-muted p-2 text-muted-foreground">
                        <Icon className="size-5" />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function buildQueryParams(filters, searchOverride) {
    const params = {
        search:
            searchOverride !== undefined
                ? searchOverride
                : (filters?.search ?? ''),
        edition_id: filters?.edition_id ?? '',
        country: filters?.country ?? '',
        from: filters?.from ?? '',
        to: filters?.to ?? '',
    };

    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== ''),
    );
}

export default function AdminTililaSubmissionsIndex({
    participants,
    filters,
    kpis,
    editions = [],
    countries = [],
}) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const data = participants?.data ?? [];
    const links = participants?.links ?? [];

    const applyFilters = (overrides = {}, searchValue) => {
        const next = {
            ...filters,
            ...overrides,
        };
        const searchParam =
            searchValue !== undefined ? searchValue : search.trim();

        router.get(
            '/admin/tilila/participants',
            buildQueryParams(next, searchParam),
            { preserveState: true, replace: true },
        );
    };

    const submitSearch = (e) => {
        e.preventDefault();
        applyFilters({}, search.trim());
    };

    const resetFilters = () => {
        setSearch('');
        router.get('/admin/tilila/participants', {}, { replace: true });
    };

    const hasActiveFilters = Boolean(
        filters?.search ||
        filters?.edition_id ||
        filters?.country ||
        filters?.from ||
        filters?.to,
    );

    return (
        <>
            <Head title="Tilila Submissions" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:pb-8 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Trophée Tilila
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Participation Submissions
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Manage participation forms submitted from the Tilila
                            modal.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                                const params = new URLSearchParams(
                                    buildQueryParams(filters, search.trim()),
                                );
                                const qs = params.toString();
                                window.location.href = `/admin/tilila/participants/export.csv${qs ? `?${qs}` : ''}`;
                            }}
                        >
                            <Download className="size-4" />
                            Export CSV
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/admin/tilila/editions">Editions</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <KpiCard
                        icon={Users}
                        label="Total submissions"
                        value={kpis?.total ?? 0}
                    />
                    <KpiCard
                        label="New (last 7 days)"
                        value={kpis?.last7Days ?? 0}
                    />
                    <KpiCard
                        label="Current results"
                        value={participants?.total ?? 0}
                    />
                </div>

                <form
                    onSubmit={submitSearch}
                    className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-sm sm:p-5"
                >
                    <div className="text-sm font-semibold text-foreground">
                        Filters
                    </div>

                    <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, title, city…"
                            className="h-10 pl-10"
                            name="search"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={filters?.edition_id ?? ''}
                            onChange={(e) =>
                                applyFilters({ edition_id: e.target.value })
                            }
                            className={selectClassName}
                            aria-label="Filter by edition"
                        >
                            <option value="">All editions</option>
                            <option value="none">No edition</option>
                            {editions.map((edition) => (
                                <option
                                    key={edition.id}
                                    value={String(edition.id)}
                                >
                                    {edition.year}
                                    {edition.is_current ? ' (current)' : ''}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters?.country ?? ''}
                            onChange={(e) =>
                                applyFilters({ country: e.target.value })
                            }
                            className={selectClassName}
                            aria-label="Filter by country"
                        >
                            <option value="">All countries</option>
                            {countries.map((code) => (
                                <option key={code} value={code}>
                                    {code.toUpperCase()}
                                </option>
                            ))}
                        </select>

                        <Input
                            type="date"
                            value={filters?.from ?? ''}
                            onChange={(e) =>
                                applyFilters({ from: e.target.value })
                            }
                            className="h-10 w-auto"
                            aria-label="Submitted from"
                        />
                        <Input
                            type="date"
                            value={filters?.to ?? ''}
                            onChange={(e) =>
                                applyFilters({ to: e.target.value })
                            }
                            className="h-10 w-auto"
                            aria-label="Submitted to"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetFilters}
                            disabled={!hasActiveFilters && !search.trim()}
                        >
                            Reset filters
                        </Button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[30%] py-3 text-tgray uppercase sm:px-3">
                                    Participant
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Edition
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Submission
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Submitted
                                </TableHead>
                                <TableHead className="py-3 text-right text-tgray uppercase sm:px-3">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-14 text-center text-sm text-muted-foreground"
                                    >
                                        No submissions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((p) => (
                                    <TableRow
                                        key={p.id}
                                        className="cursor-pointer hover:bg-muted/40"
                                        onClick={() =>
                                            router.visit(
                                                `/admin/tilila/participants/${p.id}`,
                                            )
                                        }
                                    >
                                        <TableCell className="py-4 sm:px-3">
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/admin/tilila/participants/${p.id}`}
                                                    className="truncate font-semibold text-foreground hover:underline"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    {p.first_name} {p.last_name}
                                                </Link>
                                                <div className="truncate text-xs text-muted-foreground">
                                                    {p.email ?? '—'}
                                                </div>
                                                {p.country ? (
                                                    <div className="text-xs text-muted-foreground">
                                                        {String(
                                                            p.country,
                                                        ).toUpperCase()}
                                                        {p.city
                                                            ? ` · ${p.city}`
                                                            : ''}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 sm:px-3">
                                            <div className="text-sm font-medium text-foreground">
                                                {p.edition?.year ?? '—'}
                                            </div>
                                            {p.edition?.is_current ? (
                                                <div className="text-xs text-beta-blue">
                                                    Current
                                                </div>
                                            ) : null}
                                        </TableCell>
                                        <TableCell className="py-4 sm:px-3">
                                            <div className="truncate text-sm text-foreground">
                                                {p.submission_title ?? '—'}
                                            </div>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {p.submission_link ? (
                                                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                                                        Link
                                                    </span>
                                                ) : null}
                                                {p.submission_video_url ? (
                                                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                                                        Video
                                                    </span>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-muted-foreground sm:px-3">
                                            {p.created_at
                                                ? new Date(
                                                      p.created_at,
                                                  ).toLocaleDateString()
                                                : '—'}
                                        </TableCell>
                                        <TableCell className="py-4 text-right sm:px-3">
                                            <div className="inline-flex items-center justify-end gap-2">
                                                {p.submission_link ? (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(
                                                                p.submission_link,
                                                                '_blank',
                                                                'noopener,noreferrer',
                                                            );
                                                        }}
                                                    >
                                                        <ExternalLink className="size-4" />
                                                        Link
                                                    </Button>
                                                ) : null}
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-alpha-danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (
                                                            confirm(
                                                                'Delete this submission? This cannot be undone.',
                                                            )
                                                        ) {
                                                            router.delete(
                                                                `/admin/tilila/participants/${p.id}`,
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {participants && participants.last_page > 1 ? (
                    <div className="flex flex-col items-center justify-between gap-3 text-sm text-tgray sm:flex-row">
                        <p>
                            Showing {participants.from ?? 0} to{' '}
                            {participants.to ?? 0} of {participants.total}{' '}
                            results
                        </p>
                        <nav
                            className="flex flex-wrap items-center gap-1"
                            aria-label="Pagination"
                        >
                            {links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={[
                                            'inline-flex min-w-9 items-center justify-center rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-muted',
                                            link.active
                                                ? 'border-beta-blue bg-beta-blue text-twhite'
                                                : '',
                                        ].join(' ')}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className={[
                                            'inline-flex min-w-9 items-center justify-center px-3 py-1.5 text-xs',
                                            link.active
                                                ? 'border-beta-blue font-semibold text-beta-blue'
                                                : '',
                                        ].join(' ')}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </nav>
                    </div>
                ) : null}
            </div>
        </>
    );
}

AdminTililaSubmissionsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
