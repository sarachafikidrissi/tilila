import TransText from '@/components/TransText';
import { PartnerLogoTile } from '@/components/PartnerSection';
import { TILILA_AWARDS_PARTNERS } from '@/data/tilila-awards-partners';

function SectionShell({ id, title, subtitle, children, className = '' }) {
    return (
        <section
            id={id}
            className={`mx-auto max-w-7xl px-4 py-10 ${className}`}
        >
            <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-tblack sm:text-3xl">
                    {title}
                </h2>
                {subtitle ? (
                    <p className="mt-3 text-sm leading-relaxed text-tgray sm:text-base">
                        {subtitle}
                    </p>
                ) : null}
            </div>
            <div className="mt-8">{children}</div>
        </section>
    );
}

export default function TililaPartnersSection() {
    return (
        <SectionShell
            id="partners"
            title={<TransText en="Partners" fr="Partenaires" ar="الشركاء" />}
            subtitle={
                <TransText
                    en="A dedicated space for institutional, media and technical partners associated with Tilila Awards."
                    fr="Espace dédié aux partenaires institutionnels, médias et techniques associés aux Tilila Awards."
                    ar="فضاء مخصص للشركاء المؤسساتيين والإعلاميين والتقنيين المرتبطين بتيليلا أووردز."
                />
            }
            className="bg-twhite"
        >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {TILILA_AWARDS_PARTNERS.map((partner) => (
                    <PartnerLogoTile
                        key={partner.id}
                        name={partner.name}
                        logoUrl={partner.logoUrl}
                        tall
                        subtitle={
                            partner.subtitle ? (
                                <TransText
                                    en={partner.subtitle.en}
                                    fr={partner.subtitle.fr}
                                    ar={partner.subtitle.ar}
                                />
                            ) : null
                        }
                    />
                ))}
            </div>
        </SectionShell>
    );
}
