import { getYoutubeEmbedUrl } from '@/lib/youtubeEmbed';
import { TILILAB_EDITIONS_HISTORY } from '@/pages/user/tililab/data/tililab-editions-history';

export const TILILAB_DEFAULT_EDITION_BANNER =
    '/assets/tililab/tililab-banner.png';

export function archiveUploadedVideoSrc(path) {
    if (!path) {
        return '';
    }

    return `/storage/${path}`;
}

export function editionHasArchiveVideo(edition) {
    if (!edition) {
        return false;
    }

    if (edition.ceremony_video_path) {
        return true;
    }

    return Boolean(getYoutubeEmbedUrl(edition.ceremony_video_url ?? ''));
}

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
        ceremony_video_url: raw.ceremony_video_url ?? null,
        ceremony_video_path: raw.ceremony_video_path ?? null,
        has_archive_video: editionHasArchiveVideo(raw),
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
        cover_image_src: entry.posterSrc || TILILAB_DEFAULT_EDITION_BANNER,
        ceremony_video_url: entry.videoUrl ?? null,
        ceremony_video_path: null,
        has_archive_video: editionHasArchiveVideo({
            ceremony_video_url: entry.videoUrl ?? null,
            ceremony_video_path: null,
        }),
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
