import { Head, Link, router, setLayoutProps } from '@inertiajs/react';
import { Search, SlidersHorizontal, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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

export default function AdminExpertsIndex({
    experts,
    filters,
    expertOfMonths,
}) {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
            },
            {
                title: 'Expertes',
                href: '#',
            },
        ],
        title: `Experts`,
        description: 'Manage, verify, and track expert profiles.',
    });

    const [search, setSearch] = useState(filters?.search ?? '');
    const [monthModal, setMonthModal] = useState({
        open: false,
        expertId: null,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        videoUrl: '',
    });
    const [editMonthModal, setEditMonthModal] = useState({
        open: false,
        entryId: null,
        month: null,
        year: null,
        videoUrl: '',
        expertName: '',
    });
    const [deleteMonthId, setDeleteMonthId] = useState(null);

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/experts',
            { search },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const data = experts?.data ?? [];
    const links = experts?.links ?? [];
    const monthEntries = expertOfMonths ?? [];

    const toggleFeatured = (expert) => {
        const nextValue = !Boolean(expert?.on_front);

        router.patch(
            `/admin/experts/${expert.id}/feature`,
            {
                on_front: nextValue,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const openMonthModal = (expertId) => {
        setMonthModal({
            open: true,
            expertId,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            videoUrl: '',
        });
    };

    const submitMonth = () => {
        if (!monthModal.expertId) {
            return;
        }

        if (!String(monthModal.videoUrl ?? '').trim()) {
            return;
        }

        router.post(
            `/admin/experts/${monthModal.expertId}/expert-of-month`,
            {
                month: Number(monthModal.month),
                year: Number(monthModal.year),
                video_url: monthModal.videoUrl,
            },
            {
                preserveScroll: true,
                onSuccess: () =>
                    setMonthModal({
                        open: false,
                        expertId: null,
                        month: new Date().getMonth() + 1,
                        year: new Date().getFullYear(),
                        videoUrl: '',
                    }),
            },
        );
    };

    const openEditMonthModal = (entry) => {
        setEditMonthModal({
            open: true,
            entryId: entry.id,
            month: entry.month,
            year: entry.year,
            videoUrl: entry.video_url ?? '',
            expertName:
                entry?.expert?.name?.en ||
                entry?.expert?.name?.fr ||
                entry?.expert?.name?.ar ||
                'Expert',
        });
    };

    const submitEditMonth = () => {
        if (!editMonthModal.entryId) {
            return;
        }

        if (!String(editMonthModal.videoUrl ?? '').trim()) {
            return;
        }

        router.patch(
            `/admin/expert-of-months/${editMonthModal.entryId}`,
            {
                video_url: editMonthModal.videoUrl,
            },
            {
                preserveScroll: true,
                onSuccess: () =>
                    setEditMonthModal({
                        open: false,
                        entryId: null,
                        month: null,
                        year: null,
                        videoUrl: '',
                        expertName: '',
                    }),
            },
        );
    };

    const confirmDeleteMonth = () => {
        if (!deleteMonthId) {
            return;
        }

        router.delete(`/admin/expert-of-months/${deleteMonthId}`, {
            onFinish: () => setDeleteMonthId(null),
        });
    };

    return (
        <>
            <Head title="Experts" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-8 px-4 py-4 sm:gap-10 md:px-6">
                <div className="overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
                    <div className="mb-4 flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-tblack">
                            Experts of the month
                        </h2>
                        <p className="text-sm text-tgray">
                            Manage monthly highlights and the linked YouTube
                            URL.
                        </p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Month
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Expert
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Video URL
                                </TableHead>
                                <TableHead className="py-3 text-right text-tgray uppercase sm:px-3">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {monthEntries.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="px-4 py-10 text-center text-sm text-tgray sm:px-6"
                                    >
                                        No experts of the month yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                monthEntries.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="py-4 sm:px-3">
                                            {String(entry.month).padStart(
                                                2,
                                                '0',
                                            )}
                                            /{entry.year}
                                        </TableCell>
                                        <TableCell className="py-4 sm:px-3">
                                            <div className="font-semibold text-tblack">
                                                {entry?.expert?.name?.en ||
                                                    entry?.expert?.name?.fr ||
                                                    entry?.expert?.name?.ar ||
                                                    '—'}
                                            </div>
                                            <div className="text-xs text-tgray">
                                                {entry?.expert?.title?.en ||
                                                    entry?.expert?.title?.fr ||
                                                    entry?.expert?.title?.ar ||
                                                    '—'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-tgray sm:px-3">
                                            {entry.video_url ? (
                                                <a
                                                    href={entry.video_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-beta-blue hover:underline"
                                                >
                                                    {entry.video_url}
                                                </a>
                                            ) : (
                                                '—'
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 text-right sm:px-3">
                                            <div className="inline-flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        openEditMonthModal(
                                                            entry,
                                                        )
                                                    }
                                                >
                                                    Edit URL
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        setDeleteMonthId(
                                                            entry.id,
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
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
                    <Button type="submit" variant="outline">
                        Search
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setSearch('');
                            router.get('/admin/experts');
                        }}
                    >
                        Reset
                    </Button>
                </form>

                <div className="overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[32%] py-3 text-tgray uppercase sm:px-3">
                                    Expert name
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
                                            <div className="flex items-center gap-3">
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
                                                    <div className="font-semibold text-tblack">
                                                        {expert.name?.en}
                                                    </div>
                                                    <div className="truncate text-xs text-tgray">
                                                        {expert.title?.en}
                                                    </div>
                                                </div>
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
                                            <div className="inline-flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={
                                                        expert.on_front
                                                            ? 'outline'
                                                            : 'secondary'
                                                    }
                                                    onClick={() =>
                                                        toggleFeatured(expert)
                                                    }
                                                >
                                                    <Star className="mr-1 size-3" />
                                                    {expert.on_front
                                                        ? 'Remove'
                                                        : 'Feature'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        openMonthModal(
                                                            expert.id,
                                                        )
                                                    }
                                                >
                                                    <Sparkles className="mr-1 size-3" />
                                                    Expert of month
                                                </Button>
                                            </div>
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

            <Dialog
                open={monthModal.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setMonthModal({
                            open: false,
                            expertId: null,
                            month: new Date().getMonth() + 1,
                            year: new Date().getFullYear(),
                            videoUrl: '',
                        });
                        return;
                    }
                    setMonthModal((prev) => ({ ...prev, open }));
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Expert of the month</DialogTitle>
                        <DialogDescription>
                            Choose the month and attach the YouTube highlight.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="month-select"
                                className="text-sm font-medium text-foreground"
                            >
                                Month
                            </label>
                            <select
                                id="month-select"
                                value={monthModal.month}
                                onChange={(e) =>
                                    setMonthModal((prev) => ({
                                        ...prev,
                                        month: Number(e.target.value),
                                    }))
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                {Array.from(
                                    { length: 12 },
                                    (_, i) => i + 1,
                                ).map((value) => (
                                    <option key={value} value={value}>
                                        {String(value).padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="year-input"
                                className="text-sm font-medium text-foreground"
                            >
                                Year
                            </label>
                            <Input
                                id="year-input"
                                type="number"
                                min="2000"
                                max="2100"
                                value={monthModal.year}
                                onChange={(e) =>
                                    setMonthModal((prev) => ({
                                        ...prev,
                                        year: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="video-url"
                            className="text-sm font-medium text-foreground"
                        >
                            YouTube video URL
                        </label>
                        <Input
                            id="video-url"
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={monthModal.videoUrl}
                            onChange={(e) =>
                                setMonthModal((prev) => ({
                                    ...prev,
                                    videoUrl: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setMonthModal({
                                    open: false,
                                    expertId: null,
                                    month: new Date().getMonth() + 1,
                                    year: new Date().getFullYear(),
                                    videoUrl: '',
                                })
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={submitMonth}
                            disabled={!String(monthModal.videoUrl ?? '').trim()}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editMonthModal.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditMonthModal({
                            open: false,
                            entryId: null,
                            month: null,
                            year: null,
                            videoUrl: '',
                            expertName: '',
                        });
                        return;
                    }
                    setEditMonthModal((prev) => ({ ...prev, open }));
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit YouTube URL</DialogTitle>
                        <DialogDescription>
                            {editMonthModal.expertName}
                            {editMonthModal.month && editMonthModal.year
                                ? ` — ${String(editMonthModal.month).padStart(2, '0')}/${editMonthModal.year}`
                                : ''}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <label
                            htmlFor="edit-video-url"
                            className="text-sm font-medium text-foreground"
                        >
                            YouTube video URL
                        </label>
                        <Input
                            id="edit-video-url"
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={editMonthModal.videoUrl}
                            onChange={(e) =>
                                setEditMonthModal((prev) => ({
                                    ...prev,
                                    videoUrl: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setEditMonthModal({
                                    open: false,
                                    entryId: null,
                                    month: null,
                                    year: null,
                                    videoUrl: '',
                                    expertName: '',
                                })
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={submitEditMonth}
                            disabled={
                                !String(editMonthModal.videoUrl ?? '').trim()
                            }
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={Boolean(deleteMonthId)}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteMonthId(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Remove expert of the month
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete the selected month entry.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={confirmDeleteMonth}
                            >
                                Remove
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
