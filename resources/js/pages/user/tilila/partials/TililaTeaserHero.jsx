export default function TililaTeaserHero({ videoUrl }) {
    if (!videoUrl) {
        return null;
    }

    return (
        <section
            id="hero"
            className="bg-background py-8 sm:py-1"
            aria-label="Tilila Awards teaser"
        >
            <div className="mx-auto flex justify-center px-4 sm:px-6 lg:px-8">
                <div className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl border border-border bg-tblack shadow-md">
                    <video
                        className="absolute inset-0 h-full w-full object-contain"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                </div>
            </div>
        </section>
    );
}
