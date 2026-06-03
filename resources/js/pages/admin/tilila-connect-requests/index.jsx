import { Head } from '@inertiajs/react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

export default function AdminTililaConnectRequestsIndex({ requests = [] }) {
    const rows = requests ?? [];

    return (
        <>
            <Head title="Tilila Connect requests" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="border-b border-border/60 pb-6">
                    <p className="text-sm font-medium text-tgray">Inbound</p>
                    <h1 className="text-2xl font-bold tracking-tight text-tblack">
                        Tilila Connect
                    </h1>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="max-w-md">
                                    Message
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-10 text-center text-sm text-tgray"
                                    >
                                        No requests yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="text-xs whitespace-nowrap text-tgray">
                                            {r.created_at
                                                ? new Date(
                                                      r.created_at,
                                                  ).toLocaleString()
                                                : ''}
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold">
                                            {r.request_type}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {r.full_name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {r.email}
                                        </TableCell>
                                        <TableCell className="max-w-md truncate text-xs text-tgray">
                                            {r.message}
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

AdminTililaConnectRequestsIndex.layout = (page) => (
    <AppLayout>{page}</AppLayout>
);
