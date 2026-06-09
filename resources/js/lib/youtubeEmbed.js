/**
 * @param {unknown} raw
 * @returns {string|null}
 */
export function getYoutubeEmbedUrl(raw) {
    if (raw == null || typeof raw !== 'string') {
        return null;
    }

    const url = raw.trim();

    if (url === '') {
        return null;
    }

    let m = url.match(
        /(?:youtube(?:-nocookie)?\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    );

    if (m) {
        return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`;
    }

    m = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/(?:shorts|live)\/)([a-zA-Z0-9_-]+)/,
    );

    if (m) {
        return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`;
    }

    return null;
}

/**
 * @param {string|null} embedUrl
 * @returns {string|null}
 */
export function withYoutubeAutoplay(embedUrl) {
    if (!embedUrl) {
        return null;
    }

    try {
        const url = new URL(embedUrl);
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('mute', '1');

        return url.toString();
    } catch {
        const separator = embedUrl.includes('?') ? '&' : '?';

        return `${embedUrl}${separator}autoplay=1&mute=1`;
    }
}
