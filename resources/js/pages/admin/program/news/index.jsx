import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

export default function AdminNewsIndex({ news }) {
    return (
        <AppLayout>
            <Head title="Program news" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Program news</h1>
                    <Button asChild>
                        <Link href="/admin/program/news/create">
                            Add article
                        </Link>
                    </Button>
                </div>
                <div className="space-y-3">
                    {news.data.map((row) => (
                        <div
                            key={row.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                        >
                            <div>
                                <p className="font-semibold">{row.title?.fr}</p>
                                <p className="text-sm text-muted-foreground">
                                    {row.program ?? 'all'} — {row.slug}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={`/admin/program/news/${row.id}/edit`}
                                    >
                                        Edit
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                'Delete this article?',
                                            )
                                        ) {
                                            router.delete(
                                                `/admin/program/news/${row.id}`,
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
