import { Head, router, setLayoutProps, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    buildCountryOptions,
    buildLanguageOptions,
} from '@/components/helpers/expert-form-options';
import ExpertDomainsPicker from '@/components/expert/ExpertDomainsPicker';

function FieldError({ error }) {
    if (!error) return null;
    return <p className="mt-1 text-xs text-alpha-danger">{error}</p>;
}

function TriLangField({
    idPrefix,
    label,
    values,
    setValues,
    errors,
    as = 'input',
    requiredLang = 'fr',
}) {
    const requiredMark = <span className="text-alpha-danger">*</span>;

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {['en', 'fr', 'ar'].map((lang) => (
                <div key={`${idPrefix}-${lang}`} className="space-y-1.5">
                    <Label htmlFor={`${idPrefix}-${lang}`}>
                        {label} ({lang.toUpperCase()}){' '}
                        {lang === requiredLang ? requiredMark : null}
                    </Label>
                    {as === 'textarea' ? (
                        <textarea
                            id={`${idPrefix}-${lang}`}
                            className={cn(
                                'flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                            )}
                            value={values?.[lang] ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    [lang]: e.target.value,
                                })
                            }
                        />
                    ) : (
                        <Input
                            id={`${idPrefix}-${lang}`}
                            value={values?.[lang] ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    [lang]: e.target.value,
                                })
                            }
                        />
                    )}
                    <FieldError error={errors?.[`${idPrefix}.${lang}`]} />
                </div>
            ))}
        </div>
    );
}

export default function ExpertProfileEdit({ expert }) {
    const { locale } = useTranslation();
    const [languageQuery, setLanguageQuery] = useState('');

    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: '/expert/dashboard' },
            { title: 'My Profile', href: '#' },
        ],
        title: 'Edit My Information',
        description:
            'Update your profile using the same required fields as the expert application.',
    });

    const { data, setData, processing, errors, setError, clearErrors } =
        useForm({
            email: expert?.email ?? '',
            phone: expert?.phone ?? '',
            name: expert?.name ?? { en: '', fr: '', ar: '' },
            title: expert?.title ?? { en: '', fr: '', ar: '' },
            expertise_domains: expert?.expertise_domains ?? [],
            bio: expert?.bio ?? { en: '', fr: '', ar: '' },
            country: expert?.country ?? 'Morocco',
            city: expert?.city ?? { en: '', fr: '', ar: '' },
            languages: expert?.languages ?? [],
            linkedin_url: expert?.linkedin_url ?? '',
            portfolio_url: expert?.portfolio_url ?? '',
            instagram_url: expert?.instagram_url ?? '',
            twitter_url: expert?.twitter_url ?? '',
            profile_image: null,
            cv: null,
        });

    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
    const avatarBlobRef = useRef(null);

    useEffect(
        () => () => {
            if (avatarBlobRef.current) {
                URL.revokeObjectURL(avatarBlobRef.current);
                avatarBlobRef.current = null;
            }
        },
        [],
    );

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0] ?? null;
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

    const displayAvatarSrc =
        data.profile_image instanceof File
            ? avatarPreviewUrl
            : (expert?.image_url ?? null);

    const countryOptions = useMemo(() => buildCountryOptions(locale), [locale]);
    const languageOptions = useMemo(
        () => buildLanguageOptions(locale),
        [locale],
    );
    const filteredLanguageOptions = useMemo(() => {
        const query = languageQuery.trim().toLowerCase();
        if (!query) {
            return languageOptions;
        }

        return languageOptions.filter((language) =>
            language.searchText.includes(query),
        );
    }, [languageOptions, languageQuery]);

    const submit = (e) => {
        e.preventDefault();

        if ((data.expertise_domains?.length ?? 0) === 0) {
            return;
        }

        clearErrors();
        router.post(
            '/expert/profile',
            { ...data, _method: 'patch' },
            {
                preserveScroll: true,
                forceFormData: true,
                onError: (serverErrors) => setError(serverErrors),
            },
        );
    };

    return (
        <>
            <Head title="Edit Expert Profile" />

            <div className="mx-auto flex w-full max-w-[min(100%,70rem)] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Required expert profile fields
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    <FieldError error={errors.email} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone">Phone number</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                    />
                                    <FieldError error={errors.phone} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profile_image">
                                    Profile image
                                </Label>
                                <div className="flex flex-wrap items-center gap-4">
                                    {displayAvatarSrc ? (
                                        <img
                                            src={displayAvatarSrc}
                                            alt=""
                                            className="h-20 w-20 rounded-full border border-border object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-muted text-xs text-muted-foreground">
                                            No image
                                        </div>
                                    )}
                                    <input
                                        id="profile_image"
                                        name="profile_image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        className="flex h-10 w-full max-w-md cursor-pointer rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs ring-offset-background file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                                <FieldError error={errors.profile_image} />
                            </div>

                            <TriLangField
                                idPrefix="name"
                                label="Name"
                                values={data.name}
                                setValues={(value) => setData('name', value)}
                                errors={errors}
                            />
                            <TriLangField
                                idPrefix="title"
                                label="Title"
                                values={data.title}
                                setValues={(value) => setData('title', value)}
                                errors={errors}
                            />
                            <ExpertDomainsPicker
                                locale={locale}
                                value={data.expertise_domains}
                                onChange={(value) =>
                                    setData('expertise_domains', value)
                                }
                                errors={errors}
                            />
                            <TriLangField
                                idPrefix="bio"
                                label="Bio"
                                values={data.bio}
                                setValues={(value) => setData('bio', value)}
                                errors={errors}
                                as="textarea"
                            />

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="country">Country</Label>
                                    <select
                                        id="country"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                        value={data.country}
                                        onChange={(e) =>
                                            setData('country', e.target.value)
                                        }
                                    >
                                        {countryOptions.map((country) => (
                                            <option
                                                key={country.value}
                                                value={country.value}
                                            >
                                                {country.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FieldError error={errors.country} />
                                </div>
                                <div className="sm:col-span-2">
                                    <TriLangField
                                        idPrefix="city"
                                        label="City"
                                        values={data.city}
                                        setValues={(value) =>
                                            setData('city', value)
                                        }
                                        errors={errors}
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-3">
                                    <Label htmlFor="language-search">
                                        Languages
                                    </Label>
                                    <Input
                                        id="language-search"
                                        value={languageQuery}
                                        onChange={(e) =>
                                            setLanguageQuery(e.target.value)
                                        }
                                        placeholder="Search language"
                                    />
                                    <div className="max-h-56 overflow-y-auto rounded-md border border-input bg-background p-3">
                                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                            {filteredLanguageOptions.map(
                                                (language) => {
                                                    const checked =
                                                        data.languages.includes(
                                                            language.value,
                                                        );

                                                    return (
                                                        <label
                                                            key={language.value}
                                                            className={cn(
                                                                'flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm',
                                                                checked
                                                                    ? 'border-beta-blue bg-beta-blue/10'
                                                                    : 'border-border bg-card',
                                                            )}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    checked
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    setData(
                                                                        'languages',
                                                                        e.target
                                                                            .checked
                                                                            ? [
                                                                                  ...data.languages,
                                                                                  language.value,
                                                                              ]
                                                                            : data.languages.filter(
                                                                                  (
                                                                                      item,
                                                                                  ) =>
                                                                                      item !==
                                                                                      language.value,
                                                                              ),
                                                                    );
                                                                }}
                                                            />
                                                            <span>
                                                                {language.label}
                                                            </span>
                                                        </label>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Selected: {data.languages.length}
                                    </p>
                                    <FieldError error={errors.languages} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="linkedin_url">
                                        LinkedIn URL
                                    </Label>
                                    <Input
                                        id="linkedin_url"
                                        value={data.linkedin_url}
                                        onChange={(e) =>
                                            setData(
                                                'linkedin_url',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <FieldError error={errors.linkedin_url} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="portfolio_url">
                                        Portfolio URL
                                    </Label>
                                    <Input
                                        id="portfolio_url"
                                        value={data.portfolio_url}
                                        onChange={(e) =>
                                            setData(
                                                'portfolio_url',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <FieldError error={errors.portfolio_url} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="instagram_url">
                                        Instagram URL
                                    </Label>
                                    <Input
                                        id="instagram_url"
                                        value={data.instagram_url}
                                        onChange={(e) =>
                                            setData(
                                                'instagram_url',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <FieldError error={errors.instagram_url} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="twitter_url">
                                        Twitter/X URL
                                    </Label>
                                    <Input
                                        id="twitter_url"
                                        value={data.twitter_url}
                                        onChange={(e) =>
                                            setData(
                                                'twitter_url',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <FieldError error={errors.twitter_url} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="cv">
                                    CV (PDF/DOC, max 5 MB)
                                </Label>
                                <input
                                    id="cv"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs ring-offset-background file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                    onChange={(e) =>
                                        setData(
                                            'cv',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                                {expert?.cv_url ? (
                                    <a
                                        href={expert.cv_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex text-sm font-medium text-beta-blue hover:underline"
                                    >
                                        View current CV
                                    </a>
                                ) : null}
                                <FieldError error={errors.cv} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
