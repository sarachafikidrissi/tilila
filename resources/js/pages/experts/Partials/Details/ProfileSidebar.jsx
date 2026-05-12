import React from 'react';
import { Instagram, Linkedin, Link, Mail, X } from 'lucide-react';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';
import { buildCountryOptions } from '@/components/helpers/expert-form-options';

/** @param {string | null | undefined} url */
function withHttps(url) {
    const s = (url ?? '').trim();
    if (s === '') {
        return null;
    }
    if (/^https?:\/\//i.test(s)) {
        return s;
    }
    return `https://${s}`;
}

export default function ProfileSidebar({ expert, details }) {
    const { locale, t } = useTranslation();

    const socials = details?.socials ?? {};
    const linkedin = withHttps(socials.linkedin);
    const twitter = withHttps(socials.twitter);
    const instagram = withHttps(socials.instagram);
    const portfolio = withHttps(socials.portfolio);
    const email = (expert.email ?? '').trim();

    const iconWrapClass =
        'inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-beta-blue hover:bg-beta-blue/5 hover:text-beta-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-beta-blue';

    return (
        <aside className="space-y-4">
            <div className="rounded-2xl bg-card shadow-sm ring-1 ring-border">
                <div className="relative">
                    <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-muted">
                        {expert.image ? (
                            <img
                                src={expert.image}
                                alt="Profile image"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : null}
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="text-lg font-extrabold text-foreground">
                                <TransText {...expert?.name} />
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                                <TransText {...expert?.title} />
                            </div>
                        </div>
                    </div>

                    {linkedin || twitter || instagram || portfolio ? (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {linkedin ? (
                                <a
                                    href={linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={iconWrapClass}
                                    aria-label={
                                        t('experts.actions.linkedinAria') ??
                                        'LinkedIn'
                                    }
                                >
                                    <Linkedin
                                        className="size-4"
                                        strokeWidth={2}
                                        aria-hidden
                                    />
                                </a>
                            ) : null}
                            {twitter ? (
                                <a
                                    href={twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={iconWrapClass}
                                    aria-label={
                                        t('experts.actions.twitterAria') ??
                                        'X (Twitter)'
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 640 640"
                                        className="size-4.5 fill-current stroke-2"
                                        aria-hidden
                                    >
                                        <path d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z" />
                                    </svg>
                                </a>
                            ) : null}
                            {instagram ? (
                                <a
                                    href={instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={iconWrapClass}
                                    aria-label={
                                        t('experts.actions.instagramAria') ??
                                        'Instagram'
                                    }
                                >
                                    <Instagram
                                        className="size-4"
                                        strokeWidth={2}
                                        aria-hidden
                                    />
                                </a>
                            ) : null}
                            {portfolio ? (
                                <a
                                    href={portfolio}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={iconWrapClass}
                                    aria-label={
                                        t('experts.actions.portfolioAria') ??
                                        'Portfolio'
                                    }
                                >
                                    <Link
                                        className="size-4"
                                        strokeWidth={2}
                                        aria-hidden
                                    />
                                </a>
                            ) : null}
                        </div>
                    ) : null}

                    {email ? (
                        <a
                            href={`mailto:${email}`}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-beta-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                            <Mail className="size-4 shrink-0 opacity-90" />
                            <TransText
                                en="Contact Expert"
                                fr="Contacter l’experte"
                                ar="تواصل مع الخبيرة"
                            />
                        </a>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground opacity-80"
                        >
                            <Mail className="size-4 shrink-0" />
                            <TransText
                                en="Contact Expert"
                                fr="Contacter l’experte"
                                ar="تواصل مع الخبيرة"
                            />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
