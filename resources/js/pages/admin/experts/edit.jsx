import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import InputError from '@/components/input-error';
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
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import ExpertPublicProfileDetails from '@/pages/admin/experts/partials/ExpertPublicProfileDetails';
import { update } from '@/routes/admin/experts';

function emptyDetails() {
    return {
        bio: [],
        socials: { linkedin: '', twitter: '', instagram: '' },
        expertise: [],
    };
}

/**
 * @param {unknown} raw
 */
function normalizeDetails(raw) {
    const e = emptyDetails();
    if (!raw || typeof raw !== 'object') {
        return e;
    }
    const d = /** @type {Record<string, unknown>} */ (raw);
    const socialsIn =
        d.socials && typeof d.socials === 'object'
            ? /** @type {Record<string, string>} */ (d.socials)
            : {};
    return {
        bio: Array.isArray(d.bio) ? d.bio : e.bio,
        socials: {
            ...e.socials,
            linkedin: socialsIn.linkedin ?? e.socials.linkedin,
            twitter: socialsIn.twitter ?? e.socials.twitter,
            instagram: socialsIn.instagram ?? e.socials.instagram,
        },
        expertise: Array.isArray(d.expertise) ? d.expertise : e.expertise,
    };
}

/**
 * @param {Record<string, unknown>} data
 */
function buildExpertPayload(data) {
    const { languagesStr, remove_image, profile_image, ...rest } = data;

    const payload = {
        name: rest.name,
        title: rest.title,
        country: rest.country,
        region_scope:
            typeof rest.region_scope === 'string' &&
            rest.region_scope.trim() !== ''
                ? rest.region_scope.trim()
                : null,
        industries: String(industriesStr ?? '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        languages: String(languagesStr ?? '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        status: rest.status,
        email:
            typeof rest.email === 'string' && rest.email.trim() !== ''
                ? rest.email.trim()
                : null,
        details: rest.details ?? {},
    };

    if (
        profile_image instanceof File ||
        (profile_image instanceof Blob && profile_image.size > 0)
    ) {
        payload.profile_image = profile_image;
    }
    if (remove_image === true) {
        payload.remove_image = true;
    }

    return payload;
}

const STEPS = [
    {
        id: 1,
        title: 'Identity',
        short: 'Names & title',
        description:
            'How the expert appears on the directory and profile (English is required).',
    },
    {
        id: 2,
        title: 'Classification',
        short: 'Filters & card',
        description: 'Country, status, and languages.',
    },
    {
        id: 3,
        title: 'Contact & media',
        short: 'Email & photo',
        description:
            'Contact email and optional profile image (JPEG, PNG, WebP, or GIF).',
    },
    {
        id: 4,
        title: 'Public profile',
        short: 'Bio & sections',
        description: 'Biography, social links, and expertise sections.',
    },
];

const TOTAL_STEPS = STEPS.length;

export default function AdminExpertsEdit({ expert, statuses = [] }) {
    const [step, setStep] = useState(1);
    const [stepError, setStepError] = useState('');

    const { data, setData, errors, setError, clearErrors } = useForm({
        name: expert.name ?? { en: '', fr: '', ar: '' },
        title: expert.title ?? { en: '', fr: '', ar: '' },
        country: expert.country ?? 'Morocco',
        region_scope: expert.region_scope ?? '',
        industriesStr: (expert.industries ?? []).join(', '),
        languagesStr: (expert.languages ?? []).join(', '),
        status: expert.status ?? 'draft',
        email: expert.email ?? '',
        profile_image: null,
        remove_image: false,
        details: normalizeDetails(expert.details),
    });

    const [processing, setProcessing] = useState(false);

    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
    const avatarBlobRef = useRef(null);
    const avatarFileInputRef = useRef(null);

    useEffect(
        () => () => {
            if (avatarBlobRef.current) {
                URL.revokeObjectURL(avatarBlobRef.current);
                avatarBlobRef.current = null;
            }
        },
        [],
    );

    const handleAvatarFileChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setData('remove_image', false);
        }
        if (avatarBlobRef.current) {
            URL.revokeObjectURL(avatarBlobRef.current);
            avatarBlobRef.current = null;
        }
        setData('profile_image', file);
        if (file) {
            avatarBlobRef.current = URL.createObjectURL(file);
            setAvatarPreviewUrl(avatarBlobRef.current);
        } else {
            setAvatarPreviewUrl(null);
        }
    };

    const clearAvatarFile = () => {
        if (avatarFileInputRef.current) {
            avatarFileInputRef.current.value = '';
        }
        if (avatarBlobRef.current) {
            URL.revokeObjectURL(avatarBlobRef.current);
            avatarBlobRef.current = null;
        }
        setData('profile_image', null);
        setAvatarPreviewUrl(null);
    };

    const displayAvatarSrc =
        data.profile_image instanceof File
            ? avatarPreviewUrl
            : data.remove_image
              ? null
              : (expert.image_url ?? null);

    const validateStep = (currentStep) => {
        if (currentStep === 1) {
            if (!data.name.en?.trim()) {
                return 'English name is required.';
            }
            if (!data.title.en?.trim()) {
                return 'English title is required.';
            }
        }
        if (currentStep === 2) {
            if (!data.country?.trim()) {
                return 'Country is required.';
            }
        }
        return null;
    };

    const goNext = () => {
        setStepError('');
        const err = validateStep(step);
        if (err) {
            setStepError(err);
            return;
        }
        setStep((s) => Math.min(TOTAL_STEPS, s + 1));
    };

    const goBack = () => {
        setStepError('');
        setStep((s) => Math.max(1, s - 1));
    };

    const goToStep = (target) => {
        if (target < 1 || target > TOTAL_STEPS) {
            return;
        }
        setStepError('');
        if (target > step) {
            const err = validateStep(step);
            if (err) {
                setStepError(err);
                return;
            }
        }
        setStep(target);
    };

    const submit = (e) => {
        e.preventDefault();
        const err = validateStep(1);
        const err2 = validateStep(2);
        if (err || err2) {
            setStepError(err || err2);
            setStep(err ? 1 : 2);
            return;
        }
        clearErrors();
        router.post(
            update.url({ expert: expert.id }),
            { ...buildExpertPayload(data), _method: 'put' },
            {
                preserveScroll: true,
                forceFormData: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onError: (serverErrors) => {
                    setError(serverErrors);
                    const keys = Object.keys(serverErrors ?? {});
                    const has = (prefix) =>
                        keys.some(
                            (k) => k === prefix || k.startsWith(`${prefix}.`),
                        );

                    const step1 = has('name') || has('title') || has('tags');
                    const step2 =
                        has('country') || has('status') || has('languages');
                    const step3 =
                        has('email') ||
                        has('profile_image') ||
                        has('remove_image');

                    setStep(step1 ? 1 : step2 ? 2 : step3 ? 3 : 4);
                    setStepError('Please fix the highlighted fields.');
                },
            },
        );
    };

    const current = STEPS[step - 1];

    return (
        <>
            <Head title={`Edit ${expert.name?.en ?? 'expert'}`} />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Experts Directory
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Edit expert
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            {expert.name?.en} — work through each step. You can
                            go back anytime.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {expert.status === 'published' ? (
                            <Button asChild variant="outline">
                                <Link href={`/experts/${expert.id}`}>
                                    View public profile
                                </Link>
                            </Button>
                        ) : null}
                        <Button asChild variant="outline">
                            <Link href="/admin/experts">Back to list</Link>
                        </Button>
                    </div>
                </div>

                <nav aria-label="Steps" className="w-full">
                    <ol className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
                        {STEPS.map((s, index) => {
                            const isActive = step === s.id;
                            const isDone = step > s.id;
                            return (
                                <li
                                    key={s.id}
                                    className="flex min-w-0 flex-1 items-center gap-2"
                                >
                                    {index > 0 ? (
                                        <div
                                            className="mx-1 hidden h-px w-4 shrink-0 bg-border sm:block"
                                            aria-hidden
                                        />
                                    ) : null}
                                    <button
                                        type="button"
                                        onClick={() => goToStep(s.id)}
                                        className={cn(
                                            'flex min-w-0 flex-1 items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors sm:min-w-[140px]',
                                            isActive &&
                                                'border-beta-blue bg-beta-blue/10 ring-2 ring-beta-blue/30',
                                            !isActive &&
                                                !isDone &&
                                                'border-border bg-card hover:bg-muted/60',
                                            isDone &&
                                                !isActive &&
                                                'border-alpha-green/40 bg-beta-green/30 hover:bg-beta-green/50',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                                                isActive &&
                                                    'bg-beta-blue text-twhite',
                                                isDone &&
                                                    !isActive &&
                                                    'bg-alpha-green text-twhite',
                                                !isActive &&
                                                    !isDone &&
                                                    'bg-muted text-muted-foreground',
                                            )}
                                        >
                                            {isDone ? '✓' : s.id}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-semibold text-tblack">
                                                {s.title}
                                            </span>
                                            <span className="block truncate text-xs text-tgray">
                                                {s.short}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                <form onSubmit={submit} className="space-y-6">
                    {step < 4 ? (
                        <Card>
                            <CardHeader className="px-5 sm:px-8">
                                <p className="mb-1 text-xs font-semibold tracking-wide text-beta-blue uppercase">
                                    Step {step} of {TOTAL_STEPS}
                                </p>
                                <CardTitle>{current.title}</CardTitle>
                                <CardDescription>
                                    {current.description}
                                </CardDescription>
                            </CardHeader>

                            {step === 1 ? (
                                <CardContent className="space-y-4 px-5 sm:px-8">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {['en', 'fr', 'ar'].map((lang) => (
                                            <div
                                                key={lang}
                                                className="space-y-2"
                                            >
                                                <Label htmlFor={`name-${lang}`}>
                                                    Name ({lang.toUpperCase()})
                                                    {lang === 'en' ? ' *' : ''}
                                                </Label>
                                                <Input
                                                    id={`name-${lang}`}
                                                    value={data.name[lang]}
                                                    onChange={(e) =>
                                                        setData('name', {
                                                            ...data.name,
                                                            [lang]: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[`name.${lang}`]
                                                    }
                                                />
                                            </div>
                                        ))}
                                        {['en', 'fr', 'ar'].map((lang) => (
                                            <div
                                                key={lang}
                                                className="space-y-2"
                                            >
                                                <Label
                                                    htmlFor={`title-${lang}`}
                                                >
                                                    Title ({lang.toUpperCase()})
                                                    {lang === 'en' ? ' *' : ''}
                                                </Label>
                                                <Input
                                                    id={`title-${lang}`}
                                                    value={data.title[lang]}
                                                    onChange={(e) =>
                                                        setData('title', {
                                                            ...data.title,
                                                            [lang]: e.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[`title.${lang}`]
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            ) : null}

                            {step === 2 ? (
                                <CardContent className="space-y-4 px-5 sm:px-8">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="country">
                                                Country
                                            </Label>
                                            <Input
                                                id="country"
                                                value={data.country}
                                                onChange={(e) =>
                                                    setData(
                                                        'country',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Morocco"
                                                maxLength={255}
                                            />
                                            <InputError
                                                message={errors.country}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="region_scope">
                                                Catalog region
                                            </Label>
                                            <select
                                                id="region_scope"
                                                value={data.region_scope}
                                                onChange={(e) =>
                                                    setData(
                                                        'region_scope',
                                                        e.target.value,
                                                    )
                                                }
                                                className={cn(
                                                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                                )}
                                            >
                                                <option value="">
                                                    Auto / unspecified
                                                </option>
                                                <option value="morocco">
                                                    Morocco
                                                </option>
                                                <option value="africa">
                                                    Africa
                                                </option>
                                                <option value="diaspora">
                                                    Diaspora
                                                </option>
                                                <option value="other">
                                                    Other
                                                </option>
                                            </select>
                                            <InputError
                                                message={errors.region_scope}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">
                                                Status
                                            </Label>
                                            <select
                                                id="status"
                                                value={data.status}
                                                onChange={(e) =>
                                                    setData(
                                                        'status',
                                                        e.target.value,
                                                    )
                                                }
                                                className={cn(
                                                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                                )}
                                            >
                                                {statuses.map((st) => (
                                                    <option key={st} value={st}>
                                                        {st}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.status}
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="languagesStr">
                                                Languages (comma-separated)
                                            </Label>
                                            <Input
                                                id="languagesStr"
                                                value={data.languagesStr}
                                                onChange={(e) =>
                                                    setData(
                                                        'languagesStr',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="en, fr, ar"
                                            />
                                            <InputError
                                                message={errors.languages}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            ) : null}

                            {step === 3 ? (
                                <CardContent className="space-y-4 px-5 sm:px-8">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="profile_image">
                                                Profile image
                                            </Label>
                                            <div className="flex flex-wrap items-start gap-4">
                                                {displayAvatarSrc ? (
                                                    <div className="relative size-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                                                        <img
                                                            src={
                                                                displayAvatarSrc
                                                            }
                                                            alt=""
                                                            className="size-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex size-24 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs text-muted-foreground">
                                                        No image
                                                    </div>
                                                )}
                                                <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                    <input
                                                        ref={avatarFileInputRef}
                                                        id="profile_image"
                                                        name="profile_image"
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                                        className={cn(
                                                            'flex h-10 w-full max-w-md cursor-pointer rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs ring-offset-background file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                                        )}
                                                        onChange={
                                                            handleAvatarFileChange
                                                        }
                                                    />
                                                    {expert.image_url ? (
                                                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                className="size-4 rounded border-input"
                                                                checked={
                                                                    data.remove_image
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const checked =
                                                                        e.target
                                                                            .checked;
                                                                    setData(
                                                                        'remove_image',
                                                                        checked,
                                                                    );
                                                                    if (
                                                                        checked
                                                                    ) {
                                                                        if (
                                                                            avatarFileInputRef.current
                                                                        ) {
                                                                            avatarFileInputRef.current.value =
                                                                                '';
                                                                        }
                                                                        if (
                                                                            avatarBlobRef.current
                                                                        ) {
                                                                            URL.revokeObjectURL(
                                                                                avatarBlobRef.current,
                                                                            );
                                                                            avatarBlobRef.current =
                                                                                null;
                                                                        }
                                                                        setData(
                                                                            'profile_image',
                                                                            null,
                                                                        );
                                                                        setAvatarPreviewUrl(
                                                                            null,
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                            Remove current
                                                            profile photo
                                                        </label>
                                                    ) : null}
                                                    {data.profile_image instanceof
                                                    File ? (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-fit"
                                                            onClick={
                                                                clearAvatarFile
                                                            }
                                                        >
                                                            Clear new image
                                                        </Button>
                                                    ) : null}
                                                    <p className="text-xs text-muted-foreground">
                                                        Max 5&nbsp;MB. JPEG,
                                                        PNG, WebP, or GIF.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors.profile_image
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            ) : null}
                        </Card>
                    ) : (
                        <ExpertPublicProfileDetails
                            details={data.details}
                            onChange={(next) => setData('details', next)}
                        />
                    )}

                    {stepError ? (
                        <p
                            className="text-sm font-medium text-destructive"
                            role="alert"
                        >
                            {stepError}
                        </p>
                    ) : null}

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6">
                        <Button asChild variant="outline" type="button">
                            <Link href="/admin/experts">Cancel</Link>
                        </Button>
                        <div className="flex flex-wrap items-center gap-2">
                            {step > 1 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={goBack}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="size-4" />
                                    Back
                                </Button>
                            ) : null}
                            {step < TOTAL_STEPS ? (
                                <Button
                                    type="button"
                                    onClick={goNext}
                                    className="gap-1 bg-beta-blue text-twhite hover:bg-beta-blue/90"
                                >
                                    Next
                                    <ChevronRight className="size-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-beta-blue text-twhite hover:bg-beta-blue/90"
                                >
                                    {processing ? 'Saving…' : 'Save changes'}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminExpertsEdit.layout = (page) => <AppLayout>{page}</AppLayout>;
