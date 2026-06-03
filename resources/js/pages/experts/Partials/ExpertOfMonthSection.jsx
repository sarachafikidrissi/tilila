import TransText from '@/components/TransText';
import ExpertCard from '@/pages/experts/Partials/ExpertCard';

function getYouTubeEmbedUrl(url) {
    if (!url || typeof url !== 'string') {
        return null;
    }

    const trimmed = url.trim();
    const shortMatch = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
    if (shortMatch) {
        return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    const watchMatch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
    if (watchMatch) {
        return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    const embedMatch = trimmed.match(
        /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
    );
    if (embedMatch) {
        return `https://www.youtube.com/embed/${embedMatch[1]}`;
    }

    return null;
}

export default function ExpertOfMonthSection({ entry }) {
    if (!entry || !entry.expert) {
        return null;
    }

    const embedUrl = getYouTubeEmbedUrl(entry.video_url);

    return (
        <section className="bg-beta-white pb-12">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 rounded-3xl border border-border/70 bg-card px-6 py-8 shadow-sm lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] lg:px-10">
                    <div className="flex h-full flex-col">
                        <TransText
                            tag="h2"
                            className="text-xl font-extrabold tracking-tight text-tblack sm:text-2xl"
                            en="Expert of the Month"
                            fr="Experte du mois"
                            ar="خبيرة هذا الشهر"
                        />
                        <TransText
                            tag="p"
                            className="text-sm text-muted-foreground"
                            en="A monthly spotlight with a featured video conversation."
                            fr="Un coup de projecteur mensuel avec une conversation vidéo en vedette."
                            ar="تسليط الضوء الشهري مع محادثة فيديو مميزة"
                        />

                        <div className="mt-6 flex-1">
                            <ExpertCard expert={entry.expert} view="list" />
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-muted">
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                title="Expert of the month video"
                                className="aspect-video w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="flex h-full min-h-60 w-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                                <TransText
                                    en="Failed to load video. Sorry! Please check the URL or try again later."
                                    fr="Échec du chargement de la vidéo. Désolé ! Veuillez vérifier l'URL ou réessayer plus tard."
                                    ar="فشل تحميل الفيديو. عذرًا! يرجى التحقق من الرابط أو المحاولة مرة أخرى لاحقًا."
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
