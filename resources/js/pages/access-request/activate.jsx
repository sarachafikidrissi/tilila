import { Head, useForm, setLayoutProps } from '@inertiajs/react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TransText from '@/components/TransText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/contexts/TranslationContext';

const fieldClassName =
    'border-border bg-twhite text-tblack placeholder:text-tgray focus-visible:border-beta-blue focus-visible:ring-beta-blue/25';

export default function AccessRequestActivate({ token, email, name }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    setLayoutProps({
        title: t('accessRequest.activate.layoutTitle'),
        description: t('accessRequest.activate.layoutDescription'),
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/access-request/activate/${token}`);
    };

    return (
        <>
            <Head title={t('accessRequest.activate.headTitle')} />

            <form onSubmit={submit} className="flex flex-col gap-6 text-tblack">
                <p className="text-sm text-tgray">
                    <TransText
                        en={`Welcome, ${name}. Choose a password to activate your account.`}
                        fr={`Bienvenue, ${name}. Choisissez un mot de passe pour activer votre compte.`}
                        ar={`مرحبًا ${name}. اختاري كلمة مرور لتفعيل حسابك.`}
                    />
                </p>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        readOnly
                        className={fieldClassName}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">
                        {t('auth.common.passwordLabel')}
                    </Label>
                    <PasswordInput
                        id="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        required
                        className={fieldClassName}
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">
                        {t('auth.common.confirmPasswordLabel')}
                    </Label>
                    <PasswordInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        autoComplete="new-password"
                        required
                        className={fieldClassName}
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-full bg-beta-blue text-sm font-semibold text-twhite"
                >
                    {processing && <Spinner />}
                    {t('accessRequest.activate.submit')}
                </Button>
            </form>
        </>
    );
}
