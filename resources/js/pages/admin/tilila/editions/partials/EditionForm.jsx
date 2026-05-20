import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';

function TriInputs({ label, value, onChange, errors, placeholderBase }) {
    return (
        <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground">{label}</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                    <div className="text-xs font-semibold text-muted-foreground">
                        EN
                    </div>
                    <Input
                        value={value?.en ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, en: e.target.value })
                        }
                        placeholder={`${placeholderBase} (EN)`}
                    />
                    {errors?.en ? (
                        <div className="mt-1 text-xs text-alpha-danger">
                            {errors.en}
                        </div>
                    ) : null}
                </div>
                <div>
                    <div className="text-xs font-semibold text-muted-foreground">
                        FR
                    </div>
                    <Input
                        value={value?.fr ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, fr: e.target.value })
                        }
                        placeholder={`${placeholderBase} (FR)`}
                    />
                    {errors?.fr ? (
                        <div className="mt-1 text-xs text-alpha-danger">
                            {errors.fr}
                        </div>
                    ) : null}
                </div>
                <div>
                    <div className="text-xs font-semibold text-muted-foreground">
                        AR
                    </div>
                    <Input
                        value={value?.ar ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, ar: e.target.value })
                        }
                        placeholder={`${placeholderBase} (AR)`}
                    />
                    {errors?.ar ? (
                        <div className="mt-1 text-xs text-alpha-danger">
                            {errors.ar}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function TriTextareas({ label, value, onChange, placeholderBase }) {
    return (
        <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground">{label}</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {['en', 'fr', 'ar'].map((lang) => (
                    <div key={lang}>
                        <div className="text-xs font-semibold text-muted-foreground">
                            {lang.toUpperCase()}
                        </div>
                        <textarea
                            className={cn(
                                'mt-2 flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground',
                                'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                            )}
                            value={value?.[lang] ?? ''}
                            onChange={(e) =>
                                onChange({ ...value, [lang]: e.target.value })
                            }
                            placeholder={`${placeholderBase} (${lang.toUpperCase()})`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function useFilePreview(file) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (!(file instanceof File)) {
            setUrl('');
            return;
        }

        const next = URL.createObjectURL(file);
        setUrl(next);
        return () => URL.revokeObjectURL(next);
    }, [file]);

    return url;
}

function PersonRow({
    peopleKey,
    idx,
    person,
    updateRow,
    removeRow,
    showTrophyCategory = false,
}) {
    const existingSrc = person?.photo_path
        ? `/storage/${person.photo_path}`
        : '';
    const previewUrl = useFilePreview(person?.photo ?? null);
    const src = previewUrl || existingSrc || '';

    return (
        <div
            key={`${peopleKey}-${idx}`}
            className="rounded-xl border border-border bg-background p-4"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                    <div className="size-16 overflow-hidden rounded-lg border border-border bg-muted">
                        {src ? (
                            <img
                                src={src}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-foreground">
                            Full name
                        </div>
                        <Input
                            className="mt-2"
                            value={person?.full_name ?? ''}
                            onChange={(e) =>
                                updateRow(idx, { full_name: e.target.value })
                            }
                            placeholder="Full name"
                        />

                        {showTrophyCategory ? (
                            <div className="mt-4">
                                <TriInputs
                                    label="Trophy / category won"
                                    value={
                                        person?.trophy ?? {
                                            en: '',
                                            fr: '',
                                            ar: '',
                                        }
                                    }
                                    onChange={(v) =>
                                        updateRow(idx, { trophy: v })
                                    }
                                    placeholderBase="Grand Prize"
                                />
                                <p className="mt-2 text-xs text-muted-foreground">
                                    e.g. Grand Prize, Jury Prize, 1st Prize,
                                    Special Mention…
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-4 text-sm font-semibold text-foreground">
                            Photo
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-2 block w-full text-sm"
                            onChange={(e) =>
                                updateRow(idx, {
                                    photo: e.target.files?.[0] ?? null,
                                })
                            }
                        />
                        <input
                            type="hidden"
                            value={person?.photo_path ?? ''}
                            readOnly
                        />
                    </div>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    className="text-alpha-danger"
                    onClick={() => removeRow(idx)}
                >
                    Remove
                </Button>
            </div>

            <div className="mt-5">
                <TriTextareas
                    label="Mini bio"
                    value={person?.bio ?? { en: '', fr: '', ar: '' }}
                    onChange={(v) => updateRow(idx, { bio: v })}
                    placeholderBase="Short bio"
                />
            </div>
        </div>
    );
}

function PeopleSection({ title, peopleKey, data, setData, maxItems }) {
    const rows = Array.isArray(data?.[peopleKey]) ? data[peopleKey] : [];

    const addRow = () => {
        if (typeof maxItems === 'number' && rows.length >= maxItems) return;
        const row = {
            full_name: '',
            bio: { en: '', fr: '', ar: '' },
            photo: null,
            photo_path: null,
        };
        if (peopleKey === 'winners') {
            row.trophy = { en: '', fr: '', ar: '' };
        }
        setData(peopleKey, [...rows, row]);
    };

    const updateRow = (idx, patch) => {
        const next = rows.map((r, i) => (i === idx ? { ...r, ...patch } : r));
        setData(peopleKey, next);
    };

    const removeRow = (idx) => {
        setData(
            peopleKey,
            rows.filter((_, i) => i !== idx),
        );
    };

    return (
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <div className="text-sm font-bold text-foreground">
                        {title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                        {peopleKey === 'winners'
                            ? 'Add name, trophy category, photo, and a short bio.'
                            : 'Add name, photo, and a short bio.'}
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={addRow}
                    disabled={
                        typeof maxItems === 'number' && rows.length >= maxItems
                    }
                >
                    Add
                </Button>
            </div>

            {rows.length === 0 ? (
                <div className="mt-4 text-sm text-muted-foreground">
                    No items yet.
                </div>
            ) : (
                <div className="mt-5 space-y-4">
                    {rows.map((p, idx) => (
                        <PersonRow
                            key={`${peopleKey}-${idx}`}
                            peopleKey={peopleKey}
                            idx={idx}
                            person={p}
                            updateRow={updateRow}
                            removeRow={removeRow}
                            showTrophyCategory={peopleKey === 'winners'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function GalleryFileThumb({ file, onRemove }) {
    const url = useFilePreview(file);
    const label = useMemo(
        () => (file instanceof File ? file.name : ''),
        [file],
    );

    if (!(file instanceof File)) return null;

    return (
        <div className="relative overflow-hidden rounded-lg border border-border bg-background shadow-sm">
            <div className="aspect-4/3 bg-muted">
                {url ? (
                    <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                ) : null}
            </div>
            <div className="truncate px-2 py-1 text-[11px] text-muted-foreground">
                {label}
            </div>
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold text-alpha-danger shadow-sm hover:bg-background"
            >
                Remove
            </button>
        </div>
    );
}

export default function EditionForm({
    data,
    setData,
    errors,
    mode,
    onSubmit,
    processing,
}) {
    const coverExistingSrc = data?.cover_image_path
        ? `/storage/${data.cover_image_path}`
        : '';
    const coverPreviewUrl = useFilePreview(data?.cover_image ?? null);
    const coverSrc = coverPreviewUrl || coverExistingSrc || '';

    const selectedGalleryFiles = Array.isArray(data?.gallery_images_files)
        ? data.gallery_images_files.filter((f) => f instanceof File)
        : [];

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
            <div className="space-y-6 lg:col-span-8">
                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <div className="text-sm font-semibold text-foreground">
                                Year
                            </div>
                            <div className="mt-2">
                                <Input
                                    value={data.year}
                                    onChange={(e) =>
                                        setData('year', e.target.value)
                                    }
                                    placeholder="2023"
                                />
                                {errors?.year ? (
                                    <div className="mt-1 text-xs text-alpha-danger">
                                        {errors.year}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex items-end gap-3">
                            <label className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.has_gallery)}
                                    onChange={(e) =>
                                        setData('has_gallery', e.target.checked)
                                    }
                                    className="size-4 rounded border-border"
                                />
                                Has gallery
                            </label>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="text-sm font-semibold text-foreground">
                            Cover image (used in archive carousel)
                        </div>
                        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-[220px_1fr] sm:items-start">
                            <div className="overflow-hidden rounded-xl border border-border bg-muted">
                                <div className="aspect-4/3">
                                    {coverSrc ? (
                                        <img
                                            src={coverSrc}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                                            No cover image
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-sm"
                                    onChange={(e) =>
                                        setData(
                                            'cover_image',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                                <input
                                    type="hidden"
                                    value={data?.cover_image_path ?? ''}
                                    readOnly
                                />
                                {errors?.cover_image ? (
                                    <div className="mt-2 text-xs text-alpha-danger">
                                        {errors.cover_image}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-6">
                        <TriInputs
                            label="Edition label"
                            value={data.edition_label}
                            onChange={(v) => setData('edition_label', v)}
                            errors={errors?.edition_label}
                            placeholderBase="5th Edition"
                        />

                        <TriInputs
                            label="Theme"
                            value={data.theme}
                            onChange={(v) => setData('theme', v)}
                            errors={errors?.theme}
                            placeholderBase="Digital Inclusion"
                        />
                    </div>

                    <div className="mt-6 space-y-2 rounded-xl border border-border/70 bg-muted/20 p-4">
                        <div className="text-sm font-semibold text-foreground">
                            Ceremony video (YouTube)
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Optional link to the awards ceremony replay. Shown on
                            the public edition page.
                        </p>
                        <Input
                            id="ceremony_video_url"
                            type="url"
                            value={data.ceremony_video_url ?? ''}
                            onChange={(e) =>
                                setData('ceremony_video_url', e.target.value)
                            }
                            placeholder="https://www.youtube.com/watch?v=… or /live/…"
                        />
                        {errors?.ceremony_video_url ? (
                            <div className="text-xs text-alpha-danger">
                                {errors.ceremony_video_url}
                            </div>
                        ) : null}
                    </div>
                </div>

                <PeopleSection
                    title="Winners"
                    peopleKey="winners"
                    data={data}
                    setData={setData}
                />
                <PeopleSection
                    title="Jury"
                    peopleKey="jury"
                    data={data}
                    setData={setData}
                />

                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <div className="text-sm font-bold text-foreground">
                                Gallery images
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                                Upload multiple images. Existing images can be
                                removed below.
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                                setData(
                                    'gallery_images_files',
                                    Array.from(e.target.files ?? []),
                                )
                            }
                            className="block w-full text-sm"
                        />
                        {errors?.gallery_images_files ? (
                            <div className="mt-2 text-xs text-alpha-danger">
                                {errors.gallery_images_files}
                            </div>
                        ) : null}
                    </div>

                    {selectedGalleryFiles.length > 0 ? (
                        <div className="mt-5">
                            <div className="text-xs font-semibold text-muted-foreground">
                                Selected (not saved yet)
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {selectedGalleryFiles.map((file, idx) => (
                                    <GalleryFileThumb
                                        key={`${file.name}-${file.size}-${idx}`}
                                        file={file}
                                        onRemove={() => {
                                            const next =
                                                selectedGalleryFiles.filter(
                                                    (_, i) => i !== idx,
                                                );
                                            setData(
                                                'gallery_images_files',
                                                next,
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {Array.isArray(data.gallery_images) &&
                    data.gallery_images.length > 0 ? (
                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {data.gallery_images.map((path) => {
                                const src = path ? `/storage/${path}` : '';
                                const removeList = Array.isArray(
                                    data.remove_gallery_images,
                                )
                                    ? data.remove_gallery_images
                                    : [];
                                const isMarked = removeList.includes(path);

                                return (
                                    <button
                                        type="button"
                                        key={path}
                                        onClick={() => {
                                            const next = isMarked
                                                ? removeList.filter(
                                                      (p) => p !== path,
                                                  )
                                                : [...removeList, path];
                                            setData(
                                                'remove_gallery_images',
                                                next,
                                            );
                                        }}
                                        className={[
                                            'relative overflow-hidden rounded-lg border bg-background text-left shadow-sm',
                                            isMarked
                                                ? 'border-alpha-danger opacity-60 ring-2 ring-alpha-danger/40'
                                                : 'border-border hover:ring-2 hover:ring-border/60',
                                        ].join(' ')}
                                        title={
                                            isMarked
                                                ? 'Click to keep'
                                                : 'Click to remove'
                                        }
                                    >
                                        <div className="aspect-4/3 bg-muted">
                                            {src ? (
                                                <img
                                                    src={src}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            ) : null}
                                        </div>
                                        <div className="truncate px-2 py-1 text-[11px] text-muted-foreground">
                                            {path}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="lg:col-span-4">
                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                    <div className="text-sm font-bold text-foreground">
                        Save
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                        Winners, jury, and gallery pages are generated
                        automatically.
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? mode === 'create'
                                    ? 'Creating…'
                                    : 'Saving…'
                                : mode === 'create'
                                  ? 'Create edition'
                                  : 'Save changes'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
