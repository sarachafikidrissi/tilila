import { Head, Link, router } from '@inertiajs/react';
import { Download, Plus, Search } from 'lucide-react';
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
import { EVENT_TYPE_PRESETS, typeLabel } from '@/lib/eventOptions';
import { cn } from '@/lib/utils';

function eventRouteKey(ev) {
    return encodeURIComponent(ev.slug ?? '');
}

function statusBadgeClass(status) {
    switch (status) {
        case 'upcoming':
            return 'border-beta-blue/40 bg-beta-blue/10 text-beta-blue';
        case 'live':
            return 'border-alpha-green/40 bg-beta-green text-alpha-green';
        case 'finished':
            return 'border-border bg-muted text-muted-foreground';
        case 'archived':
            return 'border-border bg-muted text-muted-foreground';
        case 'draft':
            return 'border-alpha-yellow/40 bg-beta-yellow text-alpha-yellow';
        default:
            return 'border-border bg-muted text-muted-foreground';
    }
}

export default function AdminEventsIndex({
    events,
    filters,
    types = [],
    statuses = [],
}) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const data = events?.data ?? [];

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/events',
            { search, type: filters?.type, status: filters?.status },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Event Management" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:pb-8 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-tgray">Events</p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Event Management
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Manage TiliTalks, Tilila Awards, Tililab, and other
                            events.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                        >
                            <Download className="size-4" />
                            Export
                        </Button>
                        <Button
                            asChild
                            className="gap-2 bg-beta-blue text-twhite hover:bg-beta-blue/90"
                        >
                            <Link href="/admin/events/create">
                                <Plus className="size-4" />
                                Create New Event
                            </Link>
                        </Button>
                    </div>
                </div>

                <form
                    onSubmit={submitSearch}
                    className="flex flex-col gap-4 lg:flex-row lg:items-center"
                >
                    <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search events by name, location…"
                            className="h-10 pl-10"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={filters?.type ?? ''}
                            onChange={(e) =>
                                router.get(
                                    '/admin/events',
                                    {
                                        search,
                                        type: e.target.value,
                                        status: filters?.status,
                                    },
                                    { preserveState: true, replace: true },
                                )
                            }
                            className={cn(
                                'flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                            )}
                        >
                            <option value="">All Event Types</option>
                            {EVENT_TYPE_PRESETS.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                            <option value="other">Other (custom)</option>
                        </select>

                        <select
                            value={filters?.status ?? ''}
                            onChange={(e) =>
                                router.get(
                                    '/admin/events',
                                    {
                                        search,
                                        type: filters?.type,
                                        status: e.target.value,
                                    },
                                    { preserveState: true, replace: true },
                                )
                            }
                            className={cn(
                                'flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                            )}
                        >
                            <option value="">All Statuses</option>
                            {statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>

                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[40%] py-3 text-tgray uppercase sm:px-3">
                                    Event name
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Type
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Date & time
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Location
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
                                        colSpan={6}
                                        className="px-4 py-14 text-center text-sm text-tgray sm:px-6"
                                    >
                                        No events yet. Create one to get
                                        started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((ev) => (
                                    <TableRow key={ev.id}>
                                        <TableCell className="py-4 sm:px-3">
                                            <Link
                                                href={`/admin/events/${eventRouteKey(ev)}`}
                                                className="group block"
                                            >
                                                <div className="font-semibold text-tblack group-hover:underline">
                                                    {ev.title?.en ?? 'Event'}
                                                </div>
                                                <div className="mt-1 text-xs text-tgray">
                                                    Host: {ev.host ?? '—'}
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="py-4 sm:px-3">
                                            <Badge
                                                variant="secondary"
                                                className="text-xs font-normal"
                                            >
                                                {typeLabel(ev.type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-tgray sm:px-3">
                                            <div>{ev.date ?? ''}</div>
                                            <div className="text-xs">
                                                {ev.time ?? ''}{' '}
                                                {ev.timezone ?? 'GMT+1'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-tgray sm:px-3">
                                            {ev.location?.en ?? ''}
                                        </TableCell>
                                        <TableCell className="py-4 sm:px-3">
                                            <span
                                                className={cn(
                                                    'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
                                                    statusBadgeClass(ev.status),
                                                )}
                                            >
                                                {ev.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 text-right sm:px-3">
                                            <div className="flex justify-end gap-3 text-sm font-medium">
                                                <Link
                                                    href={`/admin/events/${eventRouteKey(ev)}/edit`}
                                                    className="text-beta-blue hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="text-alpha-danger hover:underline"
                                                    onClick={() => {
                                                        if (
                                                            window.confirm(
                                                                'Delete this event?',
                                                            )
                                                        ) {
                                                            router.delete(
                                                                `/admin/events/${eventRouteKey(ev)}`,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
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

AdminEventsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
