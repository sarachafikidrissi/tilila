import { Head, Link, router } from '@inertiajs/react';
import { Download, LayoutList, Plus, Search } from 'lucide-react';
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

function mediaRouteKey(item) {
    return encodeURIComponent(item.slug ?? '');
}

function statusBadgeClass(status) {
    switch (status) {
        case 'published':
            return 'border-alpha-green/40 bg-beta-green text-alpha-green';
        case 'draft':
            return 'border-alpha-yellow/50 bg-beta-yellow text-alpha-yellow';
        case 'archived':
            return 'border-border bg-muted text-muted-foreground';
        default:
            return 'border-border bg-muted text-muted-foreground';
    }
}

export default function AdminMediaIndex({
    items,
    filters,
    categories = [],
    statuses = [],
    visibilities = [],
}) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const data = items?.data ?? [];

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/media',
            {
                search,
                category: filters?.category,
                status: filters?.status,
                visibility: filters?.visibility,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Media Management" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:pb-8 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-tgray">Media</p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Media Management
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Manage articles, replays, and resources. Sidebar
                            topics, links, and expert spotlight can be set per
                            item on create/edit; the global sidebar applies to
                            the media list and as a fallback on detail pages.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/admin/media/sidebar/edit">
                                <LayoutList className="size-4" />
                                Media page sidebar
                            </Link>
                        </Button>

                        <Button
                            asChild
                            className="gap-2 bg-beta-blue text-twhite hover:bg-beta-blue/90"
                        >
                            <Link href="/admin/media/create">
                                <Plus className="size-4" />
                                Create media item
                            </Link>
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
                            placeholder="Search media…"
                            className="h-10 pl-10"
                            name="search"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={filters?.category ?? ''}
                            onChange={(e) =>
                                router.get(
                                    '/admin/media',
                                    {
                                        search,
                                        category: e.target.value,
                                        status: filters?.status,
                                        visibility: filters?.visibility,
                                    },
                                    { preserveState: true, replace: true },
                                )
                            }
                            className={cn(
                                'flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                            )}
                        >
                            <option value="">All categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters?.status ?? ''}
                            onChange={(e) =>
                                router.get(
                                    '/admin/media',
                                    {
                                        search,
                                        category: filters?.category,
                                        status: e.target.value,
                                        visibility: filters?.visibility,
                                    },
                                    { preserveState: true, replace: true },
                                )
                            }
                            className={cn(
                                'flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                            )}
                        >
                            <option value="">All statuses</option>
                            {statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters?.visibility ?? ''}
                            onChange={(e) =>
                                router.get(
                                    '/admin/media',
                                    {
                                        search,
                                        category: filters?.category,
                                        status: filters?.status,
                                        visibility: e.target.value,
                                    },
                                    { preserveState: true, replace: true },
                                )
                            }
                            className={cn(
                                'flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                            )}
                        >
                            <option value="">All visibilities</option>
                            {visibilities.map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </select>

                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="mb-1 gap-2"
                        onClick={() => {
                            const params = new URLSearchParams();
                            if (search?.trim())
                                params.set('search', search.trim());
                            if (filters?.category)
                                params.set('category', filters.category);
                            if (filters?.status)
                                params.set('status', filters.status);
                            if (filters?.visibility)
                                params.set('visibility', filters.visibility);
                            const qs = params.toString();
                            window.location.href = `/admin/media/export.csv${
                                qs ? `?${qs}` : ''
                            }`;
                        }}
                    >
                        <Download className="size-4" />
                        Export CSV
                    </Button>
                </form>

                <div className="overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[42%] py-3 text-tgray uppercase sm:px-3">
                                    Title
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Category
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Visibility
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Status
                                </TableHead>
                                <TableHead className="py-3 text-right text-tgray uppercase sm:px-3">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-10 text-center text-muted-foreground"
                                    >
                                        No media items found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="sm:px-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-12 overflow-hidden rounded-md bg-muted ring-1 ring-border">
                                                    {item.image_url ? (
                                                        <img
                                                            src={item.image_url}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-semibold text-foreground">
                                                        {item.title?.en ??
                                                            item.slug ??
                                                            '—'}
                                                    </div>
                                                    <div className="truncate text-xs text-muted-foreground">
                                                        {item.slug ?? ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="sm:px-3">
                                            <span className="text-sm text-foreground">
                                                {item.category_id ?? '—'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="sm:px-3">
                                            <span className="text-sm text-foreground">
                                                {item.visibility ?? '—'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="sm:px-3">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'capitalize',
                                                    statusBadgeClass(
                                                        item.status,
                                                    ),
                                                )}
                                            >
                                                {item.status ?? '—'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right sm:px-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/admin/media/${mediaRouteKey(item)}`}
                                                    >
                                                        View
                                                    </Link>
                                                </Button>
                                                <Button asChild size="sm">
                                                    <Link
                                                        href={`/admin/media/${mediaRouteKey(item)}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

AdminMediaIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
