import { router } from '@inertiajs/react';
import { Search, Trash2 } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

function localeBadgeClass(locale) {
    switch (locale) {
        case 'en':
            return 'border-alpha-green/40 bg-beta-green text-alpha-green';
        case 'fr':
            return 'border-alpha-yellow/50 bg-beta-yellow text-alpha-yellow';
        case 'ar':
            return 'border-beta-blue/40 bg-beta-blue/10 text-beta-blue';
        default:
            return 'border-border bg-muted text-muted-foreground';
    }
}

function formatDate(value) {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString();
}

export default function NewsletterSubscribersTable({
    subscribers,
    filters = {},
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [localeFilter, setLocaleFilter] = useState(filters.locale ?? '');
    const [deleteId, setDeleteId] = useState(null);

    const rows = subscribers?.data ?? [];
    const links = subscribers?.links ?? [];

    const applyFilters = (e) => {
        e?.preventDefault?.();
        router.get(
            '/admin/newsletter',
            {
                search: search.trim() || undefined,
                locale: localeFilter || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const confirmDelete = () => {
        if (!deleteId) {
            return;
        }

        router.delete(`/admin/newsletter/${deleteId}`, {
            preserveScroll: true,
            onFinish: () => setDeleteId(null),
        });
    };

    return (
        <>
            <Card className="border-border/70 shadow-sm">
                <CardHeader className="border-b border-border/60 pb-4">
                    <CardTitle className="text-lg text-tblack">
                        Subscribers
                    </CardTitle>
                    <p className="text-sm font-normal text-tgray">
                        Search, filter, and remove individual emails.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <form
                        onSubmit={applyFilters}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-tgray" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by email or locale…"
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={localeFilter || 'all'}
                            onValueChange={(v) =>
                                setLocaleFilter(v === 'all' ? '' : v)
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="All locales" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All locales</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="ar">Arabic</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            type="submit"
                            variant="outline"
                            className="shrink-0"
                        >
                            Apply
                        </Button>
                    </form>

                    <div className="overflow-hidden rounded-xl border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Locale</TableHead>
                                    <TableHead>Subscribed</TableHead>
                                    <TableHead className="w-[72px] text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-12 text-center text-sm text-tgray"
                                        >
                                            No subscribers match your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="font-medium text-tblack">
                                                {row.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-xs font-semibold uppercase',
                                                        localeBadgeClass(
                                                            row.locale,
                                                        ),
                                                    )}
                                                >
                                                    {row.locale || '—'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-xs text-tgray">
                                                {formatDate(
                                                    row.subscribed_at ??
                                                        row.created_at,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-alpha-danger hover:bg-beta-danger hover:text-alpha-danger"
                                                    onClick={() =>
                                                        setDeleteId(row.id)
                                                    }
                                                    aria-label={`Remove ${row.email}`}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {links.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {links.map((link, i) =>
                                link.url ? (
                                    <Button
                                        key={`${link.label}-${i}`}
                                        type="button"
                                        variant={
                                            link.active
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        className={cn(
                                            link.active &&
                                                'bg-beta-blue text-twhite hover:bg-beta-blue/90',
                                        )}
                                        disabled={!link.url}
                                        onClick={() =>
                                            router.get(link.url, {}, {
                                                preserveState: true,
                                            })
                                        }
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : null,
                            )}
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            <AlertDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove subscriber?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This email will be removed from the newsletter list.
                            They can subscribe again from the public site.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel type="button">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            type="button"
                            className="bg-alpha-danger text-twhite hover:bg-alpha-danger/90"
                            onClick={confirmDelete}
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
