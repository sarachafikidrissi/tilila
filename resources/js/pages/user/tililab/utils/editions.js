import { TILILAB_EDITIONS_HISTORY } from '@/pages/user/tililab/data/tililab-editions-history';

export const TILILAB_DEFAULT_EDITION_BANNER =
    '/assets/tililab/tililab-banner.png';

function resolveStorageOrAssetPath(path) {
    if (!path) {
        return '';
    }

    if (path.startsWith('assets/') || path.startsWith('/assets/')) {
        return path.startsWith('/') ? path : `/${path}`;
    }

    return `/storage/${path}`;
}

export function coverImageSrc(coverPath, galleryImages, winners) {
    const fromCover = resolveStorageOrAssetPath(coverPath);
    if (fromCover) {
        return fromCover;
    }

    if (Array.isArray(galleryImages) && galleryImages[0]) {
        return `/storage/${galleryImages[0]}`;
    }

    const rows = Array.isArray(winners) ? winners : [];
    const primaryWinner = rows[0] ?? null;

    if (primaryWinner?.photo_path) {
        return `/storage/${primaryWinner.photo_path}`;
    }

    return TILILAB_DEFAULT_EDITION_BANNER;
}

export function normalizeEdition(raw) {
    if (!raw) {
        return null;
    }

    const galleryImages = Array.isArray(raw.gallery_images)
        ? raw.gallery_images
        : [];
    const winners = Array.isArray(raw.winners) ? raw.winners : [];
    const coverPath = raw.cover_image_path ?? null;

    return {
        id: raw.id ?? `tililab-${raw.year ?? ''}`,
        year: String(raw.year ?? ''),
        edition_label: raw.edition_label ?? { en: '', fr: '', ar: '' },
        theme: raw.theme ?? { en: '', fr: '', ar: '' },
        cover_image_path: coverPath,
        cover_image_src: coverImageSrc(coverPath, galleryImages, winners),
        details_url: raw.id ? `/tililab/editions/${raw.id}` : '/tililab',
        winners_url: raw.id ? `/tililab/editions/${raw.id}` : '/tililab',
        gallery_images: galleryImages,
        has_gallery: Boolean(raw.has_gallery) || galleryImages.length > 0,
        is_current: Boolean(raw.is_current),
    };
}

export function editionRowFromHistory(entry) {
    return {
        id: `hist-${entry.year}`,
        year: String(entry.year),
        edition_label: entry.title,
        theme: entry.focus ?? { en: '', fr: '', ar: '' },
        cover_image_path: null,
        cover_image_src:
            entry.posterSrc || TILILAB_DEFAULT_EDITION_BANNER,
        details_url: '/tililab#past-editions',
        winners_url: '/tililab#past-editions',
        gallery_images: [],
        has_gallery: false,
    };
}

export function getHistoryEditionsSorted() {
    return [...TILILAB_EDITIONS_HISTORY].sort(
        (a, b) => Number(b.year) - Number(a.year),
    );
}
