import { withYoutubeAutoplay } from '@/lib/youtubeEmbed';

const mediaFrameClass =
    'relative aspect-video overflow-hidden sm:aspect-21/9 lg:aspect-[2.4/1]';

export default function EditionTopHero({
    uploadSrc = '',
    embedUrl = null,
    bannerSrc = '',
    id = 'edition-hero',
}) {
    const shellClass =
        'overflow-hidden rounded-3xl border border-border shadow-md';

    if (uploadSrc) {
        return (
            <div id={id} className={shellClass}>
                <div className={mediaFrameClass}>
                    <video
                        className="absolute inset-0 h-full w-full object-cover"
                        autoPlay
                        muted
                        controls
                        playsInline
                        preload="auto"
                    >
                        <source src={uploadSrc} />
                    </video>
                </div>
            </div>
        );
    }

    if (embedUrl) {
        return (
            <div id={id} className={shellClass}>
                <div className={mediaFrameClass}>
                    <iframe
                        src={withYoutubeAutoplay(embedUrl)}
                        title="Edition video"
                        className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 border-0 h-full sm:h-[131.25%] lg:h-[135%]"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            </div>
        );
    }

    if (bannerSrc) {
        return (
            <div id={id} className={shellClass}>
                <img
                    src={bannerSrc}
                    alt=""
                    className="aspect-21/9 w-full object-cover sm:aspect-[2.4/1]"
                    loading="eager"
                    decoding="async"
                />
            </div>
        );
    }

    return null;
}
