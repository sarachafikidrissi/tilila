import { CalendarDays } from 'lucide-react';
import TransText from '@/components/TransText';

function formatDeadline(iso) {
    if (!iso) {
        return null;
    }

    try {
        return new Date(iso).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return null;
    }
}

const keyDates = [
    {
        date: 'PHASE 1',
        enTitle: 'Applications open',
        frTitle: 'Ouverture des candidatures',
        arTitle: 'فتح باب التقديم',
        enDescription:
            'Submit your application via the online form before the edition deadline.',
        frDescription:
            'Déposez votre candidature via le formulaire en ligne avant la date limite de l’édition.',
        arDescription:
            'قدّموا ترشحكم عبر الاستمارة الإلكترونية قبل الموعد النهائي للدورة.',
    },
    {
        date: 'PHASE 2',
        enTitle: 'Pre-selection',
        frTitle: 'Pré-sélection',
        arTitle: 'الفرز الأولي',
        enDescription:
            'Up to six candidates are shortlisted for the masterclass and residency.',
        frDescription:
            'Jusqu’à six candidat·e·s sont présélectionné·e·s pour la masterclass et la résidence.',
        arDescription: 'يتم اختيار ما يصل إلى ستة مرشحين للماستركلاس والإقامة.',
    },
    {
        date: 'PHASE 3',
        enTitle: 'Masterclass + 48h residency',
        frTitle: 'Masterclass + résidence 48h',
        arTitle: 'ماستركلاس + إقامة 48 ساعة',
        enDescription:
            'One-day masterclass followed by an intensive 48-hour creative residency.',
        frDescription:
            'Masterclass d’une journée suivie d’une résidence créative intensive de 48 heures.',
        arDescription:
            'ماستركلاس ليوم واحد يليه إقامة إبداعية مكثفة لمدة 48 ساعة.',
    },
    {
        date: 'PHASE 4',
        enTitle: 'Jury & ceremony',
        frTitle: 'Jury & cérémonie',
        arTitle: 'لجنة التحكيم والحفل',
        enDescription:
            'The jury evaluates produced works; the winner is announced at the Tilila Awards ceremony.',
        frDescription:
            'Le jury évalue les œuvres produites ; le·la lauréat·e est annoncé·e lors de la cérémonie Tilila Awards.',
        arDescription:
            'تقيّم لجنة التحكيم الأعمال المنتجة؛ يُعلَن الفائز في حفل تيليلا أووردز.',
    },
];

export default function KeyDatesSection({ edition = null }) {
    const deadline = formatDeadline(edition?.applications_close_at);

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-tblack">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-alpha-blue text-beta-blue">
                        <CalendarDays className="size-4" />
                    </span>
                    <span>
                        <TransText
                            en="Key dates"
                            fr="Dates clés"
                            ar="التواريخ الرئيسية"
                        />
                    </span>
                </div>

                {deadline ? (
                    <p className="mt-4 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-tgray">
                        <TransText
                            en={`Application deadline: ${deadline}`}
                            fr={`Date limite de candidature : ${deadline}`}
                            ar={`الموعد النهائي للترشح: ${deadline}`}
                        />
                    </p>
                ) : (
                    <p className="mt-4 text-sm text-tgray">
                        <TransText
                            en="Application deadline will be announced for the current edition."
                            fr="La date limite de candidature sera annoncée pour l’édition en cours."
                            ar="سيُعلَن الموعد النهائي للترشح للدورة الحالية."
                        />
                    </p>
                )}

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {keyDates.map((item) => (
                        <div
                            key={item.enTitle}
                            className="rounded-xl border border-border bg-card p-4"
                        >
                            <div className="text-xs font-bold tracking-widest text-beta-blue">
                                {item.date}
                            </div>
                            <h3 className="mt-2 text-sm font-semibold text-tblack">
                                <TransText
                                    en={item.enTitle}
                                    fr={item.frTitle}
                                    ar={item.arTitle}
                                />
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-tgray">
                                <TransText
                                    en={item.enDescription}
                                    fr={item.frDescription}
                                    ar={item.arDescription}
                                />
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
