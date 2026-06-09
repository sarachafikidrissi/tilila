import TransText from '@/components/TransText';

export default function TililaBestOfVideo({ videoUrl }) {
    if (!videoUrl) {
        return null;
    }

    return (
        <section
            id="best-of"
            className="border-b border-border bg-linear-to-b from-background via-beta-blue/5 to-background py-12 sm:py-14"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-semibold tracking-tight text-tblack sm:text-3xl">
                        <TransText
                            en="Best Of Tilila Awards"
                            fr="Best Of Tilila Awards"
                            ar="أفضل لحظات تيليلا أووردز"
                        />
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-tgray sm:text-base">
                        <TransText
                            en="Relive the highlights of past Tilila Awards ceremonies — inspiring moments, winners, and the spirit of responsible advertising."
                            fr="Revivez les temps forts des cérémonies des Tilila Awards — moments inspirants, lauréats et l’esprit d’une publicité responsable."
                            ar="استرجعوا أبرز لحظات حفلات تيليلا أووردز — لحظات ملهمة والفائزون وروح الإعلان المسؤول."
                        />
                    </p>
                </div>

                <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="aspect-video bg-tblack">
                        <video
                            className="h-full w-full object-contain"
                            controls
                            playsInline
                            preload="metadata"
                        >
                            <source src={videoUrl} type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
}
