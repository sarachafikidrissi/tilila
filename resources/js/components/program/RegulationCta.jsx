import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';

export default function RegulationCta({ href, className = '' }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center justify-center rounded-full border border-beta-blue bg-beta-blue/5 px-5 py-2.5 text-sm font-semibold text-beta-blue transition hover:bg-beta-blue hover:text-twhite ${className}`}
        >
            <TransText
                en="Download full regulations"
                fr="Télécharger le règlement intégral"
                ar="تحميل النظام الكامل"
            />
        </Link>
    );
}
