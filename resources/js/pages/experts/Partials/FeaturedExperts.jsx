import TransText from '@/components/TransText';
import ExpertCard from '@/pages/experts/Partials/ExpertCard';

export default function FeaturedExperts({ experts = [] }) {
    if (!experts.length) {
        return null;
    }

    return (
        <section className="bg-beta-white pb-12">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 rounded-3xl border border-border/70 bg-card px-6 py-8 shadow-sm sm:px-10">
                    <div className="flex flex-col">
                        <TransText
                            tag="h2"
                            className="text-xl font-extrabold tracking-tight text-tblack sm:text-2xl"
                            en="Featured Experts"
                            fr="Expertes a la une"
                            ar="خبيرات في الواجهة"
                        />
                        <TransText
                            tag="p"
                            className="max-w-2xl text-sm text-muted-foreground"
                            en="Featured profiles highlighted by the Tilila team."
                            fr="Des profils mis en avant par l'equipe Tilila."
                            ar="ملفات مميزة يسلط عليها فريق تيليلا الضوء."
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {experts.map((expert) => (
                            <ExpertCard
                                key={expert.id}
                                expert={expert}
                                view="grid"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
