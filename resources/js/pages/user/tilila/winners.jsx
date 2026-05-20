import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import TransText from '@/components/TransText';
import TililaPeopleGrid from '@/components/TililaPeopleGrid';

export default function TililaEditionWinners() {
    const { edition } = usePage().props;
    const winners = Array.isArray(edition?.winners) ? edition.winners : [];

    return (
        <>
            <Head title={`Tilila Winners ${edition?.year ?? ''}`} />

            <section className="mx-auto max-w-7xl px-4 py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-xs font-semibold tracking-widest text-tgray">
                            <TransText
                                en="TROPHÉE TILILA"
                                fr="TROPHÉE TILILA"
                                ar="جائزة تيليلا"
                            />
                        </div>
                        <h1 className="mt-3 text-2xl font-semibold text-tblack sm:text-3xl">
                            <TransText
                                en={`Winners — ${edition?.year ?? ''}`}
                                fr={`Lauréats — ${edition?.year ?? ''}`}
                                ar={`الفائزون — ${edition?.year ?? ''}`}
                            />
                        </h1>
                        <p className="mt-2 text-sm text-tgray">
                            <TransText
                                en={edition?.edition_label?.en ?? ''}
                                fr={edition?.edition_label?.fr ?? ''}
                                ar={edition?.edition_label?.ar ?? ''}
                            />
                        </p>
                    </div>

                    <Link
                        href="/tilila#archive"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-tblack hover:bg-secondary"
                    >
                        <ChevronLeft className="size-4 text-tgray" />
                        <TransText
                            en="Back to archive"
                            fr="Retour aux archives"
                            ar="العودة للأرشيف"
                        />
                    </Link>
                </div>

                <TililaPeopleGrid
                    title={
                        <TransText en="Winners" fr="Lauréats" ar="الفائزون" />
                    }
                    people={winners}
                    showTrophy
                />
            </section>
        </>
    );
}

TililaEditionWinners.layout = (page) => <AppLayout>{page}</AppLayout>;
