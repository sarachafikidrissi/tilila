import { getYoutubeEmbedUrl } from '@/lib/youtubeEmbed';

function normalizeBannerSrc(bannerSrc) {
    return typeof bannerSrc === 'string' ? bannerSrc.trim() : '';
}

function normalizeVideoUrl(url) {
    return typeof url === 'string' ? url.trim() : '';
}

function normalizeVideoPath(path) {
    return typeof path === 'string' ? path.trim() : '';
}

/** Tilila: YouTube link only. No URL → edition banner. */
export function resolveTililaHeroMedia({ ceremonyVideoUrl, bannerSrc = '' }) {
    const url = normalizeVideoUrl(ceremonyVideoUrl);
    const embedUrl = url ? getYoutubeEmbedUrl(url) : null;

    if (embedUrl) {
        return {
            uploadSrc: '',
            embedUrl,
            bannerSrc: '',
            fallbackBannerSrc: normalizeBannerSrc(bannerSrc),
        };
    }

    return {
        uploadSrc: '',
        embedUrl: null,
        bannerSrc: normalizeBannerSrc(bannerSrc),
        fallbackBannerSrc: '',
    };
}

/** Tililab: uploaded file or YouTube link. Neither in DB → edition banner. */
export function resolveTililabHeroMedia({
    ceremonyVideoPath,
    ceremonyVideoUrl,
    bannerSrc = '',
}) {
    const path = normalizeVideoPath(ceremonyVideoPath);
    const url = normalizeVideoUrl(ceremonyVideoUrl);
    const banner = normalizeBannerSrc(bannerSrc);

    if (path) {
        return {
            uploadSrc: `/storage/${path}`,
            embedUrl: null,
            bannerSrc: '',
            fallbackBannerSrc: banner,
        };
    }

    const embedUrl = url ? getYoutubeEmbedUrl(url) : null;

    if (embedUrl) {
        return {
            uploadSrc: '',
            embedUrl,
            bannerSrc: '',
            fallbackBannerSrc: banner,
        };
    }

    return {
        uploadSrc: '',
        embedUrl: null,
        bannerSrc: banner,
        fallbackBannerSrc: '',
    };
}
