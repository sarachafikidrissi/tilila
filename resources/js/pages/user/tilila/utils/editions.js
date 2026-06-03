export function coverImageSrc(coverPath, galleryImages) {
    if (coverPath) {
        if (
            coverPath.startsWith('assets/') ||
            coverPath.startsWith('/assets/')
        ) {
            return coverPath.startsWith('/') ? coverPath : `/${coverPath}`;
        }

        return `/storage/${coverPath}`;
    }

    if (Array.isArray(galleryImages) && galleryImages[0]) {
        return `/storage/${galleryImages[0]}`;
    }

    return '';
}

/**
 * Normalise Tilila edition payloads from the API for archive / carousel UIs.
 */
export function normalizeEdition(raw) {
    if (!raw) {
        return null;
    }

    const coverPath = raw.cover_image_path ?? null;
    const galleryImages = Array.isArray(raw.gallery_images)
        ? raw.gallery_images
        : [];

    return {
        id: raw.id ?? `${raw.year ?? ''}-${raw.sort ?? ''}`,
        year: String(raw.year ?? ''),
        edition_label: raw.edition_label ?? { en: '', fr: '', ar: '' },
        theme: raw.theme ?? { en: '', fr: '', ar: '' },
        cover_image_path: coverPath,
        cover_image_src: coverImageSrc(coverPath, galleryImages),
        details_url: raw.id ? `/tilila/editions/${raw.id}` : '/tilila',
        winners_url:
            raw.winners_url ??
            (raw.id ? `/tilila/editions/${raw.id}/winners` : '/tilila'),
        jury_url:
            raw.jury_url ??
            (raw.id ? `/tilila/editions/${raw.id}/jury` : '/tilila'),
        gallery_url:
            raw.gallery_url ??
            (raw.id ? `/tilila/editions/${raw.id}/gallery` : '/tilila'),
        gallery_images: Array.isArray(raw.gallery_images)
            ? raw.gallery_images
            : [],
        has_gallery:
            Boolean(raw.has_gallery) ||
            (Array.isArray(raw.gallery_images) &&
                raw.gallery_images.length > 0),
        is_current: Boolean(raw.is_current),
    };
}

/** Fallback row for carousel when API returns no editions (uses static history). */
export function editionRowFromHistory(entry) {
    return {
        id: `hist-${entry.year}`,
        year: String(entry.year),
        edition_label: entry.title,
        theme: entry.focus ?? { en: '', fr: '', ar: '' },
        cover_image_path: null,
        cover_image_src: entry.posterSrc || '',
        details_url: '/tilila#past-editions',
        winners_url: '/tilila#past-editions',
        jury_url: '/tilila#past-editions',
        gallery_url: '/tilila#past-editions',
        gallery_images: [],
        has_gallery: false,
    };
}
