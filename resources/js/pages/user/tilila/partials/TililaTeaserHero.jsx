export default function TililaTeaserHero({ videoUrl }) {
    if (!videoUrl) {
        return null;
    }

    return (
        <section
            id="hero"
            className="bg-background py-8 sm:py-10"
            aria-label="Tilila Awards teaser"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-2xl border border-border bg-tblack shadow-md">
                    <div className="aspect-video">
                        <video
                            className="h-full w-full object-contain"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            controls
                        >
                            <source src={videoUrl} type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
}
