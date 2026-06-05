import { Head, Link, setLayoutProps } from '@inertiajs/react';

import TransText from '@/components/TransText';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';
import { login } from '@/routes';

export default function AccessRequestSubmitted() {
    const { t } = useTranslation();

    setLayoutProps({
        title: t('accessRequest.submitted.title'),
        description: t('accessRequest.submitted.description'),
    });

    return (
        <>
            <Head title={t('accessRequest.submitted.headTitle')} />

            <div className="space-y-6 text-center text-tblack">
                <p className="text-sm leading-6 text-tgray">
                    {t('accessRequest.submitted.emailNotice')}
                </p>
                <Button
                    asChild
                    className="w-full rounded-full bg-beta-blue text-sm font-semibold text-twhite"
                >
                    <Link href={login()}>
                        <TransText
                            en="Back to login"
                            fr="Retour à la connexion"
                            ar="العودة لتسجيل الدخول"
                        />
                    </Link>
                </Button>
            </div>
        </>
    );
}
