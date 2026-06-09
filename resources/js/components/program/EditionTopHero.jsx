import { useState } from 'react';

import { withYoutubeAutoplay } from '@/lib/youtubeEmbed';

const mediaFrameClass =
    'relative aspect-video overflow-hidden sm:aspect-21/9 lg:aspect-[2.4/1]';

function EditionBanner({ bannerSrc, shellClass, id }) {
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

export default function EditionTopHero({
    uploadSrc = '',
    embedUrl = null,
    bannerSrc = '',
    fallbackBannerSrc = '',
    id = 'edition-hero',
}) {
    const [uploadFailed, setUploadFailed] = useState(false);
    const shellClass =
        'overflow-hidden rounded-3xl border border-border shadow-md';
    const fallback = fallbackBannerSrc || bannerSrc;

    if (uploadSrc && !uploadFailed) {
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
                        onError={() => setUploadFailed(true)}
                    >
                        <source src={uploadSrc} />
                    </video>
                </div>
            </div>
        );
    }

    if (uploadFailed && fallback) {
        return (
            <EditionBanner
                bannerSrc={fallback}
                shellClass={shellClass}
                id={id}
            />
        );
    }

    if (embedUrl) {
        return (
            <div id={id} className={shellClass}>
                <div className={mediaFrameClass}>
                    <iframe
                        src={withYoutubeAutoplay(embedUrl)}
                        title="Edition video"
                        className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 border-0 sm:h-[131.25%] lg:h-[135%]"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            </div>
        );
    }

    if (bannerSrc) {
        return (
            <EditionBanner
                bannerSrc={bannerSrc}
                shellClass={shellClass}
                id={id}
            />
        );
    }

    return null;
}
