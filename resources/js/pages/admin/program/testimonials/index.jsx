import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

export default function AdminTestimonialsIndex({ testimonials, filters }) {
    return (
        <AppLayout>
            <Head title="Program testimonials" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Program testimonials</h1>
                    <Button asChild>
                        <Link href="/admin/program/testimonials/create">
                            Add testimonial
                        </Link>
                    </Button>
                </div>
                <div className="space-y-3">
                    {testimonials.data.map((row) => (
                        <div
                            key={row.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                        >
                            <div>
                                <p className="font-semibold">
                                    {row.name} — {row.program}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {row.quote?.fr}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={`/admin/program/testimonials/${row.id}/edit`}
                                    >
                                        Edit
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                'Delete this testimonial?',
                                            )
                                        ) {
                                            router.delete(
                                                `/admin/program/testimonials/${row.id}`,
                                            );
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
