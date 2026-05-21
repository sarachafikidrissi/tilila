import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NewsletterPageHeader({ filters, onExport }) {
    return (
        <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:pb-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
                <p className="text-sm font-medium text-tgray">Communication</p>
                <h1 className="text-2xl font-bold tracking-tight text-tblack">
                    Newsletter
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-tgray">
                    Compose campaigns and manage subscribers collected from
                    the public site.
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={onExport}
                >
                    <Download className="size-4" />
                    Export CSV
                </Button>
            </div>
        </div>
    );
}
