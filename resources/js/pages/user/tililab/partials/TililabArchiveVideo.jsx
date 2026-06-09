import TransText from '@/components/TransText';
import EventReplay from '@/pages/events/Partials/Details/EventReplay';
import { getYoutubeEmbedUrl } from '@/lib/youtubeEmbed';
import {
    archiveUploadedVideoSrc,
    editionHasArchiveVideo,
} from '@/pages/user/tililab/utils/editions';

export { editionHasArchiveVideo };

export default function TililabArchiveVideo({ edition, className = 'mt-10' }) {
    const uploadSrc = archiveUploadedVideoSrc(edition?.ceremony_video_path);
    const embedUrl = uploadSrc
        ? null
        : getYoutubeEmbedUrl(edition?.ceremony_video_url);

    if (!uploadSrc && !embedUrl) {
        return null;
    }

    const title = (
        <TransText
            en="Edition replay"
            fr="Replay de l’édition"
            ar="إعادة الدورة"
        />
    );

    const videoTitle = edition?.edition_label?.en
        ? `${edition.edition_label.en} — Tililab`
        : 'Tililab edition replay';

    if (uploadSrc) {
        return (
            <div id="ceremony" className={className}>
                <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-alpha-blue text-beta-blue ring-1 ring-border">
                        ▶
                    </span>
                    {title}
                </div>
                <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border">
                    <div className="relative aspect-video bg-tblack">
                        <video
                            className="h-full w-full object-contain"
                            controls
                            playsInline
                            preload="metadata"
                        >
                            <source src={uploadSrc} />
                        </video>
                    </div>
                    <div className="px-5 py-4">
                        <div className="text-sm font-extrabold text-foreground">
                            {videoTitle}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                            <TransText
                                en="Uploaded archive video for this edition."
                                fr="Vidéo d’archive importée pour cette édition."
                                ar="فيديو أرشيف مرفوع لهذه الدورة."
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="ceremony" className={className}>
            <EventReplay
                title={title}
                videoTitle={videoTitle}
                embedUrl={embedUrl}
                mode="replay"
            />
        </div>
    );
}
