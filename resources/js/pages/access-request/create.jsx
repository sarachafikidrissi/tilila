import { Head, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TransText from '@/components/TransText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/contexts/TranslationContext';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

const inputClass =
    'border-border bg-twhite text-tblack placeholder:text-tgray focus-visible:border-beta-blue focus-visible:ring-beta-blue/25';

const textareaClass = cn(
    'flex min-h-[120px] w-full rounded-md border border-border bg-twhite px-3 py-2 text-sm text-tblack shadow-sm outline-none placeholder:text-tgray',
    'focus-visible:border-beta-blue focus-visible:ring-2 focus-visible:ring-beta-blue/25 focus-visible:ring-offset-2',
);

const submitButtonClass =
    'w-full rounded-full bg-beta-blue text-sm font-semibold text-twhite shadow-sm transition hover:bg-beta-blue/90 focus-visible:ring-2 focus-visible:ring-beta-blue/40 focus-visible:ring-offset-2';

export default function AccessRequestCreate({
    prefill = null,
    isReapplication = false,
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        reason: prefill?.reason ?? '',
        organization: prefill?.organization ?? '',
        profession: prefill?.profession ?? '',
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post('/access-request', { preserveScroll: true });
    };

    return (
        <>
            <Head title={t('accessRequest.create.headTitle')} />

            <section className="bg-[radial-gradient(circle_at_top_left,#dff2ff_0%,#ffffff_45%,#f5fbff_100%)] py-10 sm:py-14">
                <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
                    <div className="mb-6 rounded-2xl border border-beta-blue/20 bg-card/80 p-6 text-center shadow-sm backdrop-blur sm:p-8">
                        <p className="text-xs font-semibold tracking-[0.3em] text-tgray uppercase">
                            <TransText
                                en="Expert profiles"
                                fr="Profils d’expertes"
                                ar="ملفات الخبراء"
                            />
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-tblack sm:text-3xl">
                            {isReapplication
                                ? t('accessRequest.create.reapplyTitle')
                                : t('accessRequest.create.title')}
                        </h1>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-tgray sm:text-base">
                            {isReapplication
                                ? t('accessRequest.create.reapplySubtitle')
                                : t('accessRequest.create.subtitle')}
                        </p>
                    </div>

                    <form
                        onSubmit={onSubmit}
                        className="space-y-6 rounded-2xl border border-beta-blue/20 bg-card/90 p-6 shadow-sm backdrop-blur sm:p-8"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-tblack">
                                {t('accessRequest.create.reasonLabel')}
                            </Label>
                            <textarea
                                id="reason"
                                required
                                rows={5}
                                className={textareaClass}
                                value={data.reason}
                                onChange={(e) =>
                                    setData('reason', e.target.value)
                                }
                                placeholder={t(
                                    'accessRequest.create.reasonPlaceholder',
                                )}
                            />
                            <InputError message={errors.reason} />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="organization"
                                className="text-tblack"
                            >
                                {t('accessRequest.create.organizationLabel')}
                            </Label>
                            <Input
                                id="organization"
                                className={inputClass}
                                value={data.organization}
                                onChange={(e) =>
                                    setData('organization', e.target.value)
                                }
                                placeholder={t(
                                    'accessRequest.create.organizationPlaceholder',
                                )}
                            />
                            <InputError message={errors.organization} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profession" className="text-tblack">
                                {t('accessRequest.create.professionLabel')}
                            </Label>
                            <Input
                                id="profession"
                                required
                                className={inputClass}
                                value={data.profession}
                                onChange={(e) =>
                                    setData('profession', e.target.value)
                                }
                                placeholder={t(
                                    'accessRequest.create.professionPlaceholder',
                                )}
                            />
                            <InputError message={errors.profession} />
                        </div>

                        <Button
                            type="submit"
                            className={submitButtonClass}
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            {processing
                                ? t('accessRequest.create.submitting')
                                : isReapplication
                                  ? t('accessRequest.create.reapplySubmit')
                                  : t('accessRequest.create.submit')}
                        </Button>
                    </form>
                </div>
            </section>
        </>
    );
}

AccessRequestCreate.layout = (page) => <AppLayout>{page}</AppLayout>;
