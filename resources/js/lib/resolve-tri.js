/**
 * @param {Record<string, string>|null|undefined} value
 * @param {'en'|'fr'|'ar'} locale
 * @returns {string}
 */
export function resolveTri(value, locale) {
    if (!value || typeof value !== 'object') {
        return '';
    }

    const preferred =
        locale === 'ar' ? value.ar : locale === 'fr' ? value.fr : value.en;

    return (
        preferred ||
        value.fr ||
        value.en ||
        value.ar ||
        ''
    );
}
