import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TransText from '@/components/TransText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/contexts/TranslationContext';

const LABELS = {
    interview: {
        en: 'Interview request',
        fr: 'Demande d’interview',
        ar: 'طلب مقابلة',
    },
    speaker_panel: {
        en: 'Speaker / panel',
        fr: 'Speaker / panel',
        ar: 'متحدثة / نقاش',
    },
    network: {
        en: 'Network / collaboration',
        fr: 'Réseau / collaboration',
        ar: 'شبكة / تعاون',
    },
};

export default function ExpertsConnect({ requestTypes = [] }) {
    const { locale } = useTranslation();

    const labelForType = (t) => {
        const L = LABELS[t];
        if (!L) {
            return t;
        }
        if (locale === 'ar') {
            return L.ar;
        }
        if (locale === 'fr') {
            return L.fr;
        }
        return L.en;
    };
    const { data, setData, post, processing, errors } = useForm({
        request_type: requestTypes[0] ?? 'interview',
        full_name: '',
        email: '',
        phone: '',
        organization: '',
        message: '',
        locale,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/experts/connect');
    };

    return (
        <>
            <Head title="Tilila Connect" />

            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                <nav className="text-xs text-muted-foreground">
                    <Link href="/experts" className="hover:underline">
                        <TransText en="Experts" fr="Expertes" ar="الخبيرات" />
                    </Link>
                    <span className="mx-2">›</span>
                    <span className="font-semibold text-foreground">
                        Tilila Connect
                    </span>
                </nav>

                <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
                    <TransText
                        en="Tilila Connect"
                        fr="Tilila Connect"
                        ar="تيليلا كونكت"
                    />
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    <TransText
                        en="Journalists, organizers, and peers can reach the expert network through structured requests."
                        fr="Journalistes, organisatrices et pairs peuvent solliciter le réseau via ce formulaire."
                        ar="يمكن للصحفيين والمنظمين والأقران التواصل مع شبكة الخبيرات عبر هذا النموذج."
                    />
                </p>

                <form onSubmit={submit} className="mt-10 space-y-6">
                    <div className="space-y-2">
                        <Label>
                            <TransText
                                en="Request type"
                                fr="Type de demande"
                                ar="نوع الطلب"
                            />
                        </Label>
                        <Select
                            value={data.request_type}
                            onValueChange={(v) => setData('request_type', v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {requestTypes.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {labelForType(t)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.request_type ? (
                            <p className="text-xs text-destructive">
                                {errors.request_type}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">
                                <TransText
                                    en="Full name"
                                    fr="Nom complet"
                                    ar="الاسم الكامل"
                                />
                            </Label>
                            <Input
                                id="full_name"
                                value={data.full_name}
                                onChange={(e) =>
                                    setData('full_name', e.target.value)
                                }
                            />
                            {errors.full_name ? (
                                <p className="text-xs text-destructive">
                                    {errors.full_name}
                                </p>
                            ) : null}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            {errors.email ? (
                                <p className="text-xs text-destructive">
                                    {errors.email}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                <TransText
                                    en="Phone"
                                    fr="Téléphone"
                                    ar="الهاتف"
                                />
                            </Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="organization">
                                <TransText
                                    en="Organization"
                                    fr="Organisation"
                                    ar="الجهة"
                                />
                            </Label>
                            <Input
                                id="organization"
                                value={data.organization}
                                onChange={(e) =>
                                    setData('organization', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">
                            <TransText en="Message" fr="Message" ar="الرسالة" />
                        </Label>
                        <textarea
                            id="message"
                            rows={6}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        {errors.message ? (
                            <p className="text-xs text-destructive">
                                {errors.message}
                            </p>
                        ) : null}
                    </div>

                    <Button type="submit" disabled={processing}>
                        <TransText en="Submit" fr="Envoyer" ar="إرسال" />
                    </Button>
                </form>
            </div>
        </>
    );
}

ExpertsConnect.layout = (page) => <AppLayout>{page}</AppLayout>;
