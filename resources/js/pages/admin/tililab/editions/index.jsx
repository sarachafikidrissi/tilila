import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Trash2 } from 'lucide-react';
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

export default function AdminTililabEditionsIndex({ editions, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const data = editions?.data ?? [];
    const links = editions?.links ?? [];

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/tililab/editions',
            { search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Tililab Editions" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:pb-8 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Tililab
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Editions
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Manage Tililab editions.
                        </p>
                    </div>

                    <Button
                        asChild
                        className="gap-2 bg-beta-blue text-twhite hover:bg-beta-blue/90"
                    >
                        <Link href="/admin/tililab/editions/create">
                            <Plus className="size-4" />
                            Add edition
                        </Link>
                    </Button>
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
                            placeholder="Search by year, label, theme…"
                            className="h-10 pl-10"
                            name="search"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSearch('');
                                router.get('/admin/tililab/editions', {
                                    search: '',
                                });
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Year
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Edition
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Theme (EN)
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Gallery
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
                                        No editions yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell className="font-semibold sm:px-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {e.year}
                                                {e.is_current ? (
                                                    <span className="rounded-full bg-beta-blue/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-beta-blue uppercase">
                                                        Current
                                                    </span>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                        <TableCell className="sm:px-3">
                                            <div className="font-semibold text-foreground">
                                                {e.edition_label?.en ?? '—'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {e.edition_label?.fr ?? ''}{' '}
                                                {e.edition_label?.ar ?? ''}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground sm:px-3">
                                            {e.theme?.en ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-sm sm:px-3">
                                            {e.has_gallery ? 'Yes' : 'No'}
                                        </TableCell>
                                        <TableCell className="text-right sm:px-3">
                                            <div className="inline-flex items-center justify-end gap-2">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Link
                                                        href={`/admin/tililab/editions/${e.id}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-alpha-danger"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                'Delete this edition?',
                                                            )
                                                        ) {
                                                            router.delete(
                                                                `/admin/tililab/editions/${e.id}`,
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

                {editions && editions.last_page > 1 ? (
                    <div className="flex flex-col items-center justify-between gap-3 text-sm text-tgray sm:flex-row">
                        <p>
                            Showing {editions.from ?? 0} to {editions.to ?? 0}{' '}
                            of {editions.total} results
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

AdminTililabEditionsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
