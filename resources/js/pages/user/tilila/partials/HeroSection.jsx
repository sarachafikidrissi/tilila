import { ArrowRight } from 'lucide-react';
import TransText from '@/components/TransText';

const stats = [
    {
        enLabel: 'Impact on Advertising',
        frLabel: 'Impact sur la publicité',
        arLabel: 'الأثر على الإعلانات',
        enDescription:
            'Measuring how the Trophée Tilila has shifted the narrative in Moroccan media over the years.',
        frDescription:
            'Mesurer comment le Trophée Tilila a fait évoluer le récit dans les médias marocains au fil des années.',
        arDescription:
            'قياس كيف غيّرت جائزة تيليلا السردية في الإعلام المغربي عبر السنوات.',
    },
    {
        value: '+45%',
        enLabel: 'ADS WITH GENDER PARITY',
        frLabel: 'PUBS AVEC PARITÉ',
        arLabel: 'إعلانات مع تكافؤ',
    },
    {
        value: '300+',
        enLabel: 'CAMPAIGNS REVIEWED',
        frLabel: 'CAMPAGNES ÉVALUÉES',
        arLabel: 'حملات تمت مراجعتها',
    },
    {
        value: '7',
        enLabel: 'EDITIONS CELEBRATED',
        frLabel: 'ÉDITIONS CÉLÉBRÉES',
        arLabel: 'دورات مُحتفى بها',
    },
];

const HERO_POSTER_SRC = '/assets/tilila/hero-7eme-edition.png';

export default function HeroSection({ onParticipate }) {
    return (
        <section className="relative w-full pb-10 sm:pb-28">
            {/* ── Dark hero panel ── */}
            <div
                className="relative min-h-[85vh] overflow-hidden sm:h-[85vh]"
                style={{
                    background:
                        'linear-gradient(135deg, var(--color-tblack) 0%, #111827 60%, #1a2035 100%)',
                }}
            >
                {/* Gold glow blob */}
                <div
                    className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(194,157,87,0.12) 0%, transparent 70%)',
                    }}
                />

                <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-10 sm:px-10 sm:pt-14 sm:pb-32 lg:grid-cols-12 lg:items-center">
                    {/* ── Left: text ── */}
                    <div className="lg:col-span-7">
                        {/* Badge */}
                        <div
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-widest"
                            style={{
                                background: 'rgba(194,157,87,0.18)',
                                border: '0.5px solid rgba(194,157,87,0.35)',
                                color: 'var(--color-gold)',
                            }}
                        >
                            <span style={{ fontSize: 9 }}>✦</span>
                            <TransText
                                en="Since 2018"
                                fr="Depuis 2018"
                                ar="منذ 2018"
                            />
                        </div>

                        {/* Heading */}
                        <h1
                            className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                color: 'var(--color-twhite)',
                                lineHeight: 1.05,
                            }}
                        >
                            Trophée
                            <br />
                            <span style={{ color: 'var(--color-gold)' }}>
                                Tilila
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className="mt-5 max-w-xl text-base leading-7 sm:text-lg"
                            style={{ color: 'rgba(255,255,255,0.62)' }}
                        >
                            <TransText
                                en="Honoring the advertising campaigns that break stereotypes and champion gender equality. A celebration of creativity committed to diversity in Morocco and Africa."
                                fr="Célébrer les campagnes publicitaires qui brisent les stéréotypes et défendent l’égalité des genres. Une célébration de la créativité engagée pour la diversité au Maroc et en Afrique."
                                ar="تكريم الحملات الإعلانية التي تكسر القوالب النمطية وتدعم المساواة بين الجنسين. احتفاء بالإبداع الملتزم بالتنوع في المغرب وإفريقيا."
                            />
                        </p>

                        {/* CTA buttons */}
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                            <button
                                className="inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 sm:w-auto"
                                style={{
                                    background: 'var(--color-gold)',
                                    color: 'var(--color-tblack)',
                                }}
                            >
                                <TransText
                                    en="Discover last year's Winners"
                                    fr="Découvrir les lauréats de l'année dernière"
                                    ar="اكتشف فائزات العام الماضي"
                                />
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                            <button
                                className="inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-colors sm:w-auto"
                                style={{
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '0.5px solid rgba(255,255,255,0.22)',
                                    color: 'var(--color-twhite)',
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        'rgba(255,255,255,0.13)')
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        'rgba(255,255,255,0.07)')
                                }
                                type="button"
                                onClick={() => onParticipate?.()}
                            >
                                <TransText
                                    en="Participate"
                                    fr="Participer"
                                    ar="شارك"
                                />
                            </button>
                        </div>
                    </div>

                    {/* ── Right: trophy card ── */}
                    <div className="lg:col-span-5">
                        <div
                            className="rounded-3xl p-3"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                            <div
                                className="overflow-hidden rounded-2xl"
                                style={{
                                    border: '0.5px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.25)',
                                }}
                            >
                                <div className="bg-white">
                                    <img
                                        src={HERO_POSTER_SRC}
                                        alt=""
                                        className="w-full object-contain object-center"
                                        width={1200}
                                        height={800}
                                        fetchPriority="high"
                                        decoding="async"
                                    />
                                    <p className="sr-only">
                                        <TransText
                                            en="7th edition of Trophée Tilila — awards ceremony 16 October. Organized by 2M."
                                            fr="7e édition du Trophée Tilila — remise des prix le 16 octobre. Organisé par 2M."
                                            ar="الدورة السابعة لتروفي تيليلا — حفل التتويج 16 أكتوبر. تنظيم 2M."
                                        />
                                    </p>
                                </div>

                                {/* Card footer */}
                                <div className="relative p-5">
                                    {/* Dot indicators */}
                                    <div className="mb-3 flex items-center gap-1.5">
                                        {[0.6, 0.38, 0.22, 0.12].map(
                                            (opacity, i) => (
                                                <span
                                                    key={i}
                                                    className="block h-2 w-2 rounded-full"
                                                    style={{
                                                        background: `rgba(255,255,255,${opacity})`,
                                                    }}
                                                />
                                            ),
                                        )}
                                    </div>

                                    <p
                                        className="text-xs font-bold tracking-widest"
                                        style={{
                                            color: 'var(--color-gold)',
                                            marginBottom: 6,
                                        }}
                                    >
                                        <TransText
                                            en="THE MISSION"
                                            fr="LA MISSION"
                                            ar="الرسالة"
                                        />
                                    </p>
                                    <p
                                        className="text-sm leading-relaxed font-medium italic"
                                        style={{
                                            color: 'rgba(255,255,255,0.80)',
                                        }}
                                    >
                                        <TransText
                                            en="“Advertising has the power to shape minds. Let's make sure it shapes a world of equality.”"
                                            fr="« La publicité a le pouvoir de façonner les esprits. Assurons-nous qu’elle façonne un monde d’égalité. »"
                                            ar="« للإعلان قوة في تشكيل العقول. فلنحرص أن يُسهم في تشكيل عالم من المساواة. »"
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats bar — floats over the bottom edge ── */}
            <div className="pointer-events-none relative mt-8 sm:absolute sm:inset-x-0 sm:bottom-6 sm:mt-0">
                <div className="pointer-events-auto mx-auto max-w-7xl px-4 sm:px-10">
                    <div
                        className="rounded-2xl shadow-xl"
                        style={{
                            background: 'var(--color-twhite)',
                            border: '0.5px solid #e5e7eb',
                        }}
                    >
                        <div className="grid gap-6 p-6 lg:grid-cols-12 lg:items-center lg:gap-0">
                            {/* Label + description */}
                            <div className="lg:col-span-5 lg:pr-6">
                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: 'var(--color-tblack)' }}
                                >
                                    <TransText
                                        en={stats[0].enLabel}
                                        fr={stats[0].frLabel}
                                        ar={stats[0].arLabel}
                                    />
                                </p>
                                <p
                                    className="mt-1.5 text-xs leading-6"
                                    style={{ color: 'var(--color-tgray)' }}
                                >
                                    <TransText
                                        en={stats[0].enDescription}
                                        fr={stats[0].frDescription}
                                        ar={stats[0].arDescription}
                                    />
                                </p>
                            </div>

                            {/* Metrics */}
                            <div className="grid gap-6 sm:grid-cols-3 lg:col-span-7 lg:border-l lg:border-border lg:pl-6">
                                {stats.slice(1).map((item, i) => (
                                    <div
                                        key={`${item.value}-${item.enLabel}`}
                                        className={[
                                            'text-center sm:text-left lg:px-6',
                                            i < 2
                                                ? 'lg:border-r lg:border-border'
                                                : '',
                                        ].join(' ')}
                                    >
                                        <div
                                            className="text-3xl font-bold tracking-tight sm:text-4xl"
                                            style={{
                                                color: 'var(--color-beta-blue)',
                                            }}
                                        >
                                            {item.value}
                                        </div>
                                        <div
                                            className="mt-1 text-[0.65rem] font-semibold tracking-widest"
                                            style={{
                                                color: 'var(--color-tgray)',
                                            }}
                                        >
                                            <TransText
                                                en={item.enLabel}
                                                fr={item.frLabel}
                                                ar={item.arLabel}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
