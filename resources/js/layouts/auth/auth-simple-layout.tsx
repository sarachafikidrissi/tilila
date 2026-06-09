import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-svh overflow-hidden bg-beta-white">
            <div className="bg-brand-subtle absolute inset-0" />

            <div className="relative mx-auto flex min-h-svh max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="rounded-3xl border border-border bg-background px-6 py-8 shadow-sm sm:px-8 sm:py-10">
                        <div className="mb-8 flex flex-col items-center gap-4 text-center">
                            <Link
                                href={home()}
                                className="inline-flex items-center rounded-full focus-visible:ring-2 focus-visible:ring-beta-blue/40 focus-visible:ring-offset-2"
                            >
                                <img
                                    src="/assets/logo.png"
                                    alt="Tilila"
                                    className="h-11 w-auto object-contain"
                                    loading="eager"
                                    decoding="async"
                                />
                            </Link>

                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight text-tblack sm:text-3xl">
                                    {title}
                                </h1>
                                <p className="mx-auto max-w-sm text-sm leading-6 text-tgray">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div>{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
