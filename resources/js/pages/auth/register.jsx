import { Form, Head, setLayoutProps } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/contexts/TranslationContext';
import { login } from '@/routes';
import { store } from '@/routes/register';

const fieldClassName =
    'border-border bg-twhite text-tblack placeholder:text-tgray focus-visible:border-beta-blue focus-visible:ring-beta-blue/25';

export default function Register() {
    const { t } = useTranslation();

    setLayoutProps({
        title: t('auth.register.layoutTitle'),
        description: t('auth.register.layoutDescription'),
    });

    return (
        <>
            <Head title={t('auth.register.headTitle')} />

            <div className="flex flex-col gap-6 text-tblack">
                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-tblack"
                                    >
                                        {t('auth.register.nameLabel')}
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        placeholder={t(
                                            'auth.register.namePlaceholder',
                                        )}
                                        className={fieldClassName}
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-tblack"
                                    >
                                        {t('auth.register.emailLabel')}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        placeholder={t(
                                            'auth.common.emailPlaceholder',
                                        )}
                                        className={fieldClassName}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-tblack"
                                    >
                                        {t('auth.common.passwordLabel')}
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        placeholder={t(
                                            'auth.common.passwordPlaceholder',
                                        )}
                                        className={fieldClassName}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-tblack"
                                    >
                                        {t('auth.common.confirmPasswordLabel')}
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        placeholder={t(
                                            'auth.common.confirmPasswordPlaceholder',
                                        )}
                                        className={fieldClassName}
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full rounded-full bg-beta-blue text-sm font-semibold text-twhite shadow-sm transition hover:bg-beta-blue/90 focus-visible:ring-2 focus-visible:ring-beta-blue/40 focus-visible:ring-offset-2"
                                    tabIndex={5}
                                    disabled={processing}
                                    data-test="register-user-button"
                                >
                                    {processing && <Spinner />}
                                    {t('auth.register.submit')}
                                </Button>
                            </div>

                            <div className="text-center text-sm text-tgray">
                                {t('auth.register.haveAccount')}{' '}
                                <TextLink
                                    href={login()}
                                    tabIndex={6}
                                    className="font-semibold text-beta-blue decoration-beta-blue/30 hover:text-beta-blue hover:decoration-beta-blue"
                                >
                                    {t('auth.register.loginLink')}
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
