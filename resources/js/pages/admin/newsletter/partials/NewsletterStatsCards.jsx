import { Globe, Mail, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function StatCard({ label, value, hint, icon: Icon, accentClass }) {
    return (
        <Card className="border-border/70 shadow-sm">
            <CardContent className="flex items-start gap-4 p-5">
                <span
                    className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-lg',
                        accentClass,
                    )}
                >
                    <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-tgray">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-tblack">
                        {value}
                    </p>
                    {hint ? (
                        <p className="mt-1 text-xs text-tgray">{hint}</p>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}

export default function NewsletterStatsCards({ stats = {} }) {
    const total = stats.total ?? 0;
    const en = stats.en ?? 0;
    const fr = stats.fr ?? 0;
    const ar = stats.ar ?? 0;
    const unknown = stats.unknown ?? 0;

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                label="Total subscribers"
                value={total}
                hint="All active emails in the list"
                icon={Users}
                accentClass="bg-beta-blue/15 text-beta-blue"
            />
            <StatCard
                label="English"
                value={en}
                hint={unknown > 0 ? `${unknown} without locale` : 'Locale: EN'}
                icon={Mail}
                accentClass="bg-beta-green text-alpha-green"
            />
            <StatCard
                label="French"
                value={fr}
                hint="Locale: FR"
                icon={Globe}
                accentClass="bg-beta-yellow text-alpha-yellow"
            />
            <StatCard
                label="Arabic"
                value={ar}
                hint="Locale: AR"
                icon={Globe}
                accentClass="bg-beta-purple text-alpha-purple"
            />
        </div>
    );
}
