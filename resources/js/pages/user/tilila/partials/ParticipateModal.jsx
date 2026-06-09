import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function ParticipateModal({ open, onOpenChange }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        <TransText
                            en="Apply to Tilila Awards"
                            fr="Candidater aux Tilila Awards"
                            ar="الترشح لتيليلا أووردز"
                        />
                    </DialogTitle>
                    <DialogDescription>
                        <TransText
                            en="Complete the full application form with your campaign details and supporting files."
                            fr="Complétez le formulaire de candidature avec les informations de votre campagne et les fichiers requis."
                            ar="أكمل استمارة الترشح بتفاصيل حملتك والملفات المطلوبة."
                        />
                    </DialogDescription>
                </DialogHeader>
                <Link
                    href="/tilila/participate"
                    onClick={() => onOpenChange?.(false)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-beta-blue px-5 py-2.5 text-sm font-semibold text-twhite hover:opacity-90"
                >
                    <TransText
                        en="Open application form"
                        fr="Ouvrir le formulaire"
                        ar="فتح الاستمارة"
                    />
                </Link>
            </DialogContent>
        </Dialog>
    );
}
