/**
 * Trophée Tilila partners — logo paths under public/assets (use existing files first).
 * @see resources/js/pages/user/about/partials/PartnersSection.jsx
 */

export const TILILA_ORGANISER_LOGO = '/assets/organizer-logo.png';

/** Core institutional partners (UACC, GAM) */
export const TILILA_INSTITUTIONAL_PARTNERS = [
    {
        id: 'uacc',
        name: 'UACC',
        subtitle: {
            en: 'Union des Agences Conseil en Communication',
            fr: 'Union des Agences Conseil en Communication',
            ar: 'اتحاد وكالات الاستشارة في الاتصال',
        },
        logoUrl: '/assets/PartenairesInstitutionnels/Logo-UACC-01-200x200.png',
    },
    {
        id: 'gam',
        name: 'GAM',
        subtitle: {
            en: 'Groupement des Annonceurs du Maroc',
            fr: 'Groupement des Annonceurs du Maroc',
            ar: 'تجمع المعلنين في المغرب',
        },
        logoUrl: '/assets/PartenairesInstitutionnels/Logo-GAM-01-200x200.png',
    },
];

/**
 * Media & other partners (2025 and recent editions).
 * logoUrl omitted when no asset exists in public/assets.
 */
export const TILILA_MEDIA_PARTNERS = [
    {
        id: 'imperiales',
        name: 'Les Impériales',
        logoUrl:
            '/assets/PartenairesInstitutionnels/Logo-Les-Imperiales-Black-01-300x143.png',
    },
    {
        id: 'radio-2m',
        name: 'MFM Radio / Radio 2M',
        logoUrl: '/assets/partenairesMedia/Logo-radio2M-01-182x100.png',
    },
    {
        id: 'tiqqa',
        name: 'Tiqqa (Tiqqa d’Or)',
        logoUrl:
            '/assets/partenairesMedia/JOOJ-MASTERBRAND-STRAWBERRY-91x100.png',
    },
    {
        id: 'snrt',
        name: 'SNRT',
        logoUrl: '/assets/partenairesMedia/Logo-snrtnews-141x100.png',
    },
    {
        id: 'medias24',
        name: 'Médias24',
        logoUrl: '/assets/partenairesMedia/medias24-200x55.png',
    },
    {
        id: 'lesiteinfo',
        name: 'Le Site Info',
        logoUrl:
            '/assets/partenairesMedia/Lesiteinfo-Logo-Vector_page-0001-200x74.jpg',
    },
    // {
    //     id: 'tswera',
    //     name: 'Tswera',
    //     logoUrl: null,
    // },
    {
        id: 'uradio',
        name: 'U Radio',
        logoUrl: '/assets/partenairesMedia/Logo-URadio-def-3-01-1-141x100.png',
    },
    {
        id: 'media-marketing',
        name: 'Media Marketing Magazine',
        logoUrl: '/assets/partenairesMedia/Logo-Media-Marketing-200x76.png',
    },
];
