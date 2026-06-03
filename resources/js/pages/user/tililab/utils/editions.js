import { TILILAB_EDITIONS_HISTORY } from '@/pages/user/tililab/data/tililab-editions-history';

export function coverImageSrc(galleryImages, winners) {
    if (Array.isArray(galleryImages) && galleryImages[0]) {
        return `/storage/${galleryImages[0]}`;
    }

    const rows = Array.isArray(winners) ? winners : [];
    const primaryWinner = rows[0] ?? null;
    if (primaryWinner?.photo_path) {
        return `/storage/${primaryWinner.photo_path}`;
    }

    return '';
}

export function normalizeEdition(raw) {
    if (!raw) {
        return null;
    }

    const galleryImages = Array.isArray(raw.gallery_images)
        ? raw.gallery_images
        : [];
    const winners = Array.isArray(raw.winners) ? raw.winners : [];
    const primaryWinner = winners[0] ?? null;
    const winnerPhoto = primaryWinner?.photo_path
        ? `/storage/${primaryWinner.photo_path}`
        : '';

    const coverFromGallery = coverImageSrc(galleryImages, winners);

    return {
        id: raw.id ?? `tililab-${raw.year ?? ''}`,
        year: String(raw.year ?? ''),
        edition_label: raw.edition_label ?? { en: '', fr: '', ar: '' },
        theme: raw.theme ?? { en: '', fr: '', ar: '' },
        cover_image_src: coverFromGallery || winnerPhoto || '',
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
        cover_image_src: entry.posterSrc || '/assets/tililab/tililab-logo.png',
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
