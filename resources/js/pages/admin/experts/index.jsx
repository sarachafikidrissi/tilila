import { Head, Link, router } from '@inertiajs/react';
import { Download, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
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

function statusBadgeClass(status) {
    switch (status) {
        case 'published':
            return 'border-alpha-green/40 bg-beta-green text-alpha-green';
        case 'pending':
            return 'border-alpha-yellow/50 bg-beta-yellow text-alpha-yellow';
        case 'suspended':
            return 'border-alpha-danger/40 bg-beta-danger text-alpha-danger';
        default:
            return 'border-border bg-muted text-muted-foreground';
    }
}

export default function AdminExpertsIndex({ experts, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/experts',
            { search, status: filters?.status },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const data = experts?.data ?? [];
    const links = experts?.links ?? [];

    return (
        <>
            <Head title="Expert Management" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:pb-8 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Experts Directory
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Expert Management
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Manage, verify, and track expert profiles for media
                            connections.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/admin/expert-applications">
                                Review Requests
                            </Link>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                                const params = new URLSearchParams();
                                if (search?.trim())
                                    params.set('search', search.trim());
                                if (filters?.status)
                                    params.set('status', filters.status);
                                const qs = params.toString();
                                window.location.href = `/admin/experts/export.csv${qs ? `?${qs}` : ''}`;
                            }}
                        >
                            <Download className="size-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                <form
                    onSubmit={submitSearch}
                    className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4"
                >
                    <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search experts by name, email, or institution..."
                            className="h-10 pl-10"
                            name="search"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                                router.get('/admin/experts', {
                                    search,
                                    status: '',
                                })
                            }
                        >
                            All Statuses
                        </Button>
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                        >
                            <SlidersHorizontal className="size-4" />
                            More Filters
                        </Button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[32%] py-3 text-tgray uppercase sm:px-3">
                                    Expert name
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Status
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Expertise
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Last activity
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
                                        className="px-4 py-14 text-center text-sm text-tgray sm:px-6"
                                    >
                                        No accepted experts yet. Review
                                        applications to publish experts.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((expert) => (
                                    <TableRow key={expert.id}>
                                        <TableCell className="py-4 sm:px-3">
                                            <Link
                                                href={`/admin/experts/${expert.id}/edit`}
                                                className="group flex items-center gap-3"
                                            >
                                                {expert.image_url ? (
                                                    <img
                                                        src={expert.image_url}
                                                        alt=""
                                                        className="size-10 shrink-0 rounded-full border border-border object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                                                        {(
                                                            expert.name?.en ??
                                                            '?'
                                                        )
                                                            .split(' ')
                                                            .map((w) => w[0])
                                                            .join('')
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-tblack group-hover:underline">
                                                        {expert.name?.en}
                                                    </div>
                                                    <div className="truncate text-xs text-tgray">
                                                        {expert.title?.en}
                                                    </div>
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="py-4 sm:px-3">
                                            <span
                                                className={cn(
                                                    'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
                                                    statusBadgeClass(
                                                        expert.status,
                                                    ),
                                                )}
                                            >
                                                {expert.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="max-w-xs py-4 text-tgray sm:px-3">
                                            <div className="flex flex-wrap gap-1">
                                                {(expert.tags ?? [])
                                                    .slice(0, 3)
                                                    .map((tag) => (
                                                        <Badge
                                                            key={
                                                                tag.en ||
                                                                tag.fr ||
                                                                tag.ar
                                                            }
                                                            variant="secondary"
                                                            className="text-xs font-normal"
                                                        >
                                                            {tag.en || tag.fr || tag.ar}
                                                        </Badge>
                                                    ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-tgray sm:px-3">
                                            {expert.updated_at
                                                ? new Date(
                                                      expert.updated_at,
                                                  ).toLocaleString()
                                                : '—'}
                                        </TableCell>
                                        <TableCell className="py-4 text-right sm:px-3">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="text-beta-blue"
                                            >
                                                <Link
                                                    href={`/admin/experts/${expert.id}/edit`}
                                                >
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-alpha-danger"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Delete this expert?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            `/admin/experts/${expert.id}`,
                                                        );
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {experts && experts.last_page > 1 ? (
                    <div className="flex flex-col items-center justify-between gap-3 text-sm text-tgray sm:flex-row">
                        <p>
                            Showing {experts.from ?? 0} to {experts.to ?? 0} of{' '}
                            {experts.total} results
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
                                        className={cn(
                                            'inline-flex min-w-9 items-center justify-center rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-muted',
                                            link.active &&
                                                'border-beta-blue bg-beta-blue text-twhite',
                                        )}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className={cn(
                                            'inline-flex min-w-9 items-center justify-center px-3 py-1.5 text-xs',
                                            link.active &&
                                                'border-beta-blue font-semibold text-beta-blue',
                                        )}
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

AdminExpertsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
