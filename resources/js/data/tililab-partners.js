/**
 * Concours Tililab — partners (roles & edition involvement).
 * Logo paths reuse existing assets under public/assets when available.
 */

export const TILILAB_ORGANISER = {
    id: '2m',
    name: '2M',
    logoUrl: '/assets/organizer-logo.png',
    role: {
        en: 'Organizer — creative bootcamp alongside Trophée Tilila',
        fr: 'Organisateur — bootcamp créatif en marge du Trophée Tilila',
        ar: 'المنظم — معسكر إبداعي إلى جانب تروفي تيليلا',
    },
};

/** @type {Array<{ id: string, name: string, logoUrl?: string | null, role: { en: string, fr: string, ar: string }, edition: { en: string, fr: string, ar: string } }>} */
const TILILAB_PARTNERS_ALL = [
    {
        id: 'lionsgeek',
        name: 'Lionsgeek',
        logoUrl: '/assets/tililab/lionsgeek-logo.png',
        role: {
            en: 'Host of Pre-Bootcamp',
            fr: 'Hôte du pré-bootcamp',
            ar: 'مضيف ما قبل المعسكر',
        },
        edition: {
            en: '5th Edition (2025)',
            fr: '5e édition (2025)',
            ar: 'الدورة الخامسة (2025)',
        },
    },
    {
        id: 'jooj',
        name: 'Jooj',
        logoUrl:
            '/assets/partenairesMedia/JOOJ-MASTERBRAND-STRAWBERRY-91x100.png',
        role: {
            en: 'Incubation program for the winner',
            fr: 'Programme d’incubation pour le lauréat',
            ar: 'برنامج احتضان للفائز',
        },
        edition: {
            en: 'All recent editions',
            fr: 'Toutes les éditions récentes',
            ar: 'جميع الدورات الأخيرة',
        },
    },
    {
        id: 'imperiales',
        name: 'Les Impériales',
        logoUrl:
            '/assets/PartenairesInstitutionnels/Logo-Les-Imperiales-Black-01-300x143.png',
        role: {
            en: 'Media / Communication partner',
            fr: 'Partenaire média / communication',
            ar: 'شريك إعلام / اتصال',
        },
        edition: {
            en: 'Regular',
            fr: 'Régulier',
            ar: 'منتظم',
        },
    },
    {
        id: 'medias24',
        name: 'Médias24',
        logoUrl: '/assets/partenairesMedia/medias24-200x55.png',
        role: {
            en: 'Media partner',
            fr: 'Partenaire média',
            ar: 'شريك إعلامي',
        },
        edition: {
            en: 'Regular',
            fr: 'Régulier',
            ar: 'منتظم',
        },
    },
    {
        id: 'uradio',
        name: 'U Radio',
        logoUrl: '/assets/partenairesMedia/Logo-URadio-def-3-01-1-141x100.png',
        role: {
            en: 'Media partner',
            fr: 'Partenaire média',
            ar: 'شريك إعلامي',
        },
        edition: {
            en: 'Regular',
            fr: 'Régulier',
            ar: 'منتظم',
        },
    },
    {
        id: 'snrt',
        name: 'SNRT',
        logoUrl: '/assets/partenairesMedia/Logo-snrtnews-141x100.png',
        role: {
            en: 'Media partner',
            fr: 'Partenaire média',
            ar: 'شريك إعلامي',
        },
        edition: {
            en: 'Occasional',
            fr: 'Occasionnel',
            ar: 'عرضي',
        },
    },
    {
        id: 'media-marketing',
        name: 'Media Marketing',
        logoUrl: '/assets/partenairesMedia/Logo-Media-Marketing-200x76.png',
        role: {
            en: 'Media partner',
            fr: 'Partenaire média',
            ar: 'شريك إعلامي',
        },
        edition: {
            en: 'Regular',
            fr: 'Régulier',
            ar: 'منتظم',
        },
    },
];

export const TILILAB_PARTNERS = TILILAB_PARTNERS_ALL;

export const TILILAB_PROGRAM_PARTNERS = TILILAB_PARTNERS_ALL.filter((p) =>
    ['lionsgeek', 'jooj'].includes(p.id),
);

export const TILILAB_MEDIA_PARTNERS = TILILAB_PARTNERS_ALL.filter(
    (p) => !['lionsgeek', 'jooj'].includes(p.id),
);
