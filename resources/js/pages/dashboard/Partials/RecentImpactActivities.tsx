import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const rows = [
    {
        activity: 'Women in Tech Panel',
        module: 'Tilitalks',
        moduleClass:
            'border-alpha-purple/30 bg-beta-purple/90 text-alpha-purple',
        metric: '120 Attendees',
        date: 'Oct 24, 2023',
        status: 'Completed' as const,
    },
    {
        activity: 'Expert Certification Batch 3',
        module: 'Tililab',
        moduleClass: 'border-beta-blue/25 bg-alpha-blue text-beta-blue',
        metric: '25 Certified',
        date: 'Oct 23, 2023',
        status: 'Completed' as const,
    },
    {
        activity: 'Annual Diversity Awards',
        module: 'Tilila Awards',
        moduleClass: 'border-alpha-yellow/40 bg-beta-yellow text-alpha-yellow',
        metric: '50 Nominees',
        date: 'Oct 21, 2023',
        status: 'In Progress' as const,
    },
] as const;

function StatusBadge({ status }: { status: 'Completed' | 'In Progress' }) {
    const isDone = status === 'Completed';

    return (
        <span
            className={cn(
                'inline-flex rounded-md border px-2.5 py-0.5 text-xs font-medium',
                isDone
                    ? 'border-alpha-green/40 bg-beta-green text-alpha-green'
                    : 'border-alpha-yellow/50 bg-beta-yellow text-alpha-yellow',
            )}
        >
            {status}
        </span>
    );
}

export function RecentImpactActivities() {
    return (
        <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-tblack">
                    Recent Impact Activities
                </h2>
                <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-beta-blue"
                >
                    View Full Log
                </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[28%] text-tgray uppercase">
                                Activity
                            </TableHead>
                            <TableHead className="text-tgray uppercase">
                                Module
                            </TableHead>
                            <TableHead className="text-tgray uppercase">
                                Impact metric
                            </TableHead>
                            <TableHead className="text-tgray uppercase">
                                Date
                            </TableHead>
                            <TableHead className="text-right text-tgray uppercase">
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.activity}>
                                <TableCell className="font-medium text-tblack">
                                    {row.activity}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={cn(
                                            'inline-flex rounded-md border px-2 py-0.5 text-xs font-medium',
                                            row.moduleClass,
                                        )}
                                    >
                                        {row.module}
                                    </span>
                                </TableCell>
                                <TableCell className="text-tgray">
                                    {row.metric}
                                </TableCell>
                                <TableCell className="text-tgray">
                                    {row.date}
                                </TableCell>
                                <TableCell className="text-right">
                                    <StatusBadge status={row.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}
