import React from 'react';
import TransText from '@/components/TransText';

export default function PartnersStrip({ items = [] }) {
    const list = Array.isArray(items) ? items : [];
    if (list.length === 0) return null;

    return (
        <section className="bg-background py-10">
            <div className="mx-auto max-w-7xl px-4">
                <div className="text-center">
                    <div className="text-xs font-semibold tracking-widest text-tgray uppercase">
                        <TransText
                            en="Partners"
                            fr="Partenaires"
                            ar="الشركاء"
                        />
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold text-tblack">
                        <TransText
                            en="They support the programme"
                            fr="Ils soutiennent le programme"
                            ar="يدعمون البرنامج"
                        />
                    </h2>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {list.map((p) => (
                        <div
                            key={p.name}
                            className="rounded-full bg-muted/60 px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-border"
                        >
                            {p.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
