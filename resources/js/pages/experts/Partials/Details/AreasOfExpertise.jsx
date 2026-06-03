import React from 'react';
import TransText from '@/components/TransText';

export default function AreasOfExpertise({ items = [] }) {
    return (
        <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
            <div className="flex items-center gap-2">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-alpha-blue text-beta-blue">
                    ⓘ
                </div>
                <h2 className="text-base font-extrabold text-foreground">
                    <TransText
                        en="Areas of Expertise"
                        fr="Domaines d’expertise"
                        ar="مجالات الخبرة"
                    />
                </h2>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground md:col-span-2">
                        <TransText
                            en="No areas of expertise have been listed yet."
                            fr="Aucun domaine d’expertise n’a encore été renseigné."
                            ar="لم يتم إدراج مجالات الخبرة بعد."
                        />
                    </p>
                ) : null}
                {items.map((x, i) => (
                    <div
                        key={i}
                        className="rounded-xl bg-background p-4 ring-1 ring-border"
                    >
                        <div className="text-sm font-extrabold text-foreground">
                            <TransText {...x.title} />
                        </div>
                        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            <TransText {...x.description} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
