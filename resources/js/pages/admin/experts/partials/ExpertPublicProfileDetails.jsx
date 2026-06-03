import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function emptyTri() {
    return { en: '', fr: '', ar: '' };
}

const textareaClass = cn(
    'flex min-h-[72px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
);

function TriLangInputs({ label, value, onChange }) {
    return (
        <div className="grid gap-3 sm:grid-cols-3">
            {['en', 'fr', 'ar'].map((lang) => (
                <div key={lang} className="space-y-1.5">
                    <Label className="text-xs font-medium">
                        {label}{' '}
                        <span className="text-muted-foreground">
                            ({lang.toUpperCase()})
                        </span>
                    </Label>
                    <Input
                        value={value?.[lang] ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, [lang]: e.target.value })
                        }
                    />
                </div>
            ))}
        </div>
    );
}

function TriLangTextareas({ label, value, onChange, minHeight = 72 }) {
    return (
        <div className="grid gap-3 sm:grid-cols-3">
            {['en', 'fr', 'ar'].map((lang) => (
                <div key={lang} className="space-y-1.5">
                    <Label className="text-xs font-medium">
                        {label}{' '}
                        <span className="text-muted-foreground">
                            ({lang.toUpperCase()})
                        </span>
                    </Label>
                    <textarea
                        className={textareaClass}
                        style={{ minHeight }}
                        value={value?.[lang] ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, [lang]: e.target.value })
                        }
                    />
                </div>
            ))}
        </div>
    );
}

/** Edits the `details` JSON shown on the public expert profile (`experts/[id]`). */
export default function ExpertPublicProfileDetails({ details, onChange }) {
    const d = details;

    const patch = (partial) => onChange({ ...d, ...partial });

    return (
        <Card>
            <CardHeader className="px-5 sm:px-8">
                <CardTitle>Public profile content</CardTitle>
                <CardDescription>
                    Biography, social links, and expertise sections shown on the
                    expert detail page.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 px-5 sm:px-8">
                {/* Bio paragraphs */}
                <section className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold">
                                Biography paragraphs
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Each block is one paragraph in the intro card.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() =>
                                patch({
                                    bio: [...(d.bio ?? []), emptyTri()],
                                })
                            }
                        >
                            <Plus className="size-4" />
                            Add paragraph
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {(d.bio ?? []).map((p, i) => (
                            <div
                                key={i}
                                className="space-y-2 rounded-lg border border-border/70 p-3"
                            >
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-destructive"
                                        onClick={() =>
                                            patch({
                                                bio: (d.bio ?? []).filter(
                                                    (_, j) => j !== i,
                                                ),
                                            })
                                        }
                                        aria-label="Remove paragraph"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                                <TriLangTextareas
                                    label="Paragraph"
                                    value={p}
                                    onChange={(next) => {
                                        const nextBio = [...(d.bio ?? [])];
                                        nextBio[i] = next;
                                        patch({ bio: nextBio });
                                    }}
                                    minHeight={96}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Social links (sidebar icons) */}
                <section className="space-y-3">
                    <h3 className="text-sm font-semibold">
                        Social profiles (sidebar)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Full URLs for LinkedIn, X (Twitter), and Instagram.
                        Contact email is set in the main expert fields on this
                        form.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-1">
                        {[
                            ['linkedin', 'LinkedIn URL'],
                            ['twitter', 'X (Twitter) URL'],
                            ['instagram', 'Instagram URL'],
                        ].map(([key, label]) => (
                            <div key={key} className="space-y-1.5">
                                <Label className="text-xs font-medium">
                                    {label}
                                </Label>
                                <Input
                                    placeholder="https://…"
                                    value={d.socials?.[key] ?? ''}
                                    onChange={(e) =>
                                        patch({
                                            socials: {
                                                ...(d.socials ?? {
                                                    linkedin: '',
                                                    twitter: '',
                                                    instagram: '',
                                                }),
                                                [key]: e.target.value,
                                            },
                                        })
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Expertise */}
                <section className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold">
                                Areas of expertise
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Cards under “Areas of Expertise”.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() =>
                                patch({
                                    expertise: [
                                        ...(d.expertise ?? []),
                                        {
                                            title: emptyTri(),
                                            description: emptyTri(),
                                        },
                                    ],
                                })
                            }
                        >
                            <Plus className="size-4" />
                            Add area
                        </Button>
                    </div>
                    <div className="space-y-6">
                        {(d.expertise ?? []).map((item, i) => (
                            <div
                                key={i}
                                className="space-y-4 rounded-lg border border-border/70 p-3"
                            >
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-destructive"
                                        onClick={() =>
                                            patch({
                                                expertise: (
                                                    d.expertise ?? []
                                                ).filter((_, j) => j !== i),
                                            })
                                        }
                                        aria-label="Remove area"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                                <TriLangInputs
                                    label="Title"
                                    value={item.title ?? emptyTri()}
                                    onChange={(next) => {
                                        const list = [...(d.expertise ?? [])];
                                        list[i] = { ...list[i], title: next };
                                        patch({ expertise: list });
                                    }}
                                />
                                <TriLangTextareas
                                    label="Description"
                                    value={item.description ?? emptyTri()}
                                    onChange={(next) => {
                                        const list = [...(d.expertise ?? [])];
                                        list[i] = {
                                            ...list[i],
                                            description: next,
                                        };
                                        patch({ expertise: list });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </CardContent>
        </Card>
    );
}
