import { useForm } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

function audienceCount(stats, locale) {
    if (!stats) {
        return 0;
    }

    switch (locale) {
        case 'en':
            return stats.en ?? 0;
        case 'fr':
            return stats.fr ?? 0;
        case 'ar':
            return stats.ar ?? 0;
        default:
            return stats.total ?? 0;
    }
}

export default function NewsletterComposeForm({
    localeOptions = [],
    stats = {},
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        body: '',
        locale: 'all',
    });

    const audienceLabel =
        localeOptions.find((o) => o.value === data.locale)?.label ??
        'All subscribers';

    const submitSend = () => {
        post('/admin/newsletter/send', {
            preserveScroll: true,
            onSuccess: () => {
                reset('subject', 'body');
                setData('locale', 'all');
                setConfirmOpen(false);
            },
        });
    };

    return (
        <>
            <Card className="border-border/70 shadow-sm">
                <CardHeader className="border-b border-border/60 pb-4">
                    <CardTitle className="text-lg text-tblack">
                        Compose newsletter
                    </CardTitle>
                    <p className="text-sm font-normal text-tgray">
                        Write your message and choose who receives it.
                    </p>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="newsletter-subject">Subject</Label>
                        <Input
                            id="newsletter-subject"
                            value={data.subject}
                            onChange={(e) =>
                                setData('subject', e.target.value)
                            }
                            placeholder="e.g. This week on TILILA"
                        />
                        <InputError message={errors.subject} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newsletter-body">Message</Label>
                        <textarea
                            id="newsletter-body"
                            rows={10}
                            className={cn(
                                'flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground',
                                'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                            )}
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="Write the newsletter content. Line breaks are preserved in the email."
                        />
                        <InputError message={errors.body} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newsletter-locale">Audience</Label>
                        <Select
                            value={data.locale}
                            onValueChange={(value) =>
                                setData('locale', value)
                            }
                        >
                            <SelectTrigger id="newsletter-locale">
                                <SelectValue placeholder="Select audience" />
                            </SelectTrigger>
                            <SelectContent>
                                {localeOptions.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.locale} />
                        <p className="text-xs text-tgray">
                            {audienceCount(stats, data.locale) > 0
                                ? `${audienceCount(stats, data.locale)} recipient(s) for this audience.`
                                : 'No subscribers for this audience yet.'}
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="w-full gap-2 bg-beta-blue text-twhite hover:bg-beta-blue/90 sm:w-auto"
                        disabled={
                            processing ||
                            !data.subject.trim() ||
                            !data.body.trim()
                        }
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Send className="size-4" />
                        Send newsletter
                    </Button>
                </CardContent>
            </Card>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Send this newsletter?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to email &ldquo;{audienceLabel}
                            &rdquo; with subject &ldquo;{data.subject}&rdquo;.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel type="button">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            type="button"
                            className="bg-beta-blue text-twhite hover:bg-beta-blue/90"
                            disabled={processing}
                            onClick={submitSend}
                        >
                            {processing ? 'Sending…' : 'Confirm send'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
