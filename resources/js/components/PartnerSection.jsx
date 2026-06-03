import { cn } from '@/lib/utils';

export function PartnerLogoTile({ name, logoUrl, subtitle, tall = false }) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-2xl border border-border bg-white px-4 shadow-sm transition hover:shadow-md',
                tall ? 'min-h-32 py-5' : 'min-h-24 py-4',
            )}
        >
            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt={`${name} logo`}
                    className={cn(
                        'w-full object-contain',
                        tall ? 'max-h-24' : 'max-h-16',
                    )}
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <span className="text-center text-sm font-semibold text-tblack">
                    {name}
                </span>
            )}
            {logoUrl ? (
                <span className="mt-3 text-center text-xs font-medium text-tgray">
                    {name}
                </span>
            ) : null}
            {subtitle ? (
                <p className="mt-1 text-center text-xs text-tgray">
                    {subtitle}
                </p>
            ) : null}
        </div>
    );
}

export function PartnerTier({ badge, title, description, children }) {
    return (
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm ring-1 ring-border/50">
            <p className="text-xs font-bold tracking-[0.18em] text-beta-blue uppercase">
                {badge}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-tblack">{title}</h3>
            {description ? (
                <p className="mt-2 text-sm leading-relaxed text-tgray">
                    {description}
                </p>
            ) : null}
            <div className="mt-4">{children}</div>
        </div>
    );
}
