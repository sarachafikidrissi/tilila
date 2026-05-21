/**
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
    if (!html?.trim()) {
        return '';
    }

    if (typeof document !== 'undefined') {
        const node = document.createElement('div');
        node.innerHTML = html;

        return (node.textContent || '').replace(/\s+/g, ' ').trim();
    }

    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * @param {string} html
 * @param {number} maxLength
 * @returns {string}
 */
export function excerptFromHtml(html, maxLength = 200) {
    const text = stripHtml(html);

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trim()}…`;
}

/**
 * @param {string} html
 * @returns {boolean}
 */
export function isHtmlEmpty(html) {
    return stripHtml(html) === '';
}
