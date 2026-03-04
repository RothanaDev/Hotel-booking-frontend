"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export type StepKey = "select" | "checkout" | "payment" | "confirm";

interface StepperProps {
    current: StepKey;
}

export function Stepper({ current }: StepperProps) {
    const steps: { key: StepKey; label: string }[] = [
        { key: "select", label: "Select" },
        { key: "checkout", label: "Checkout" },
        { key: "payment", label: "Payment" },
        { key: "confirm", label: "Confirm" },
    ];

    const currentIndex = steps.findIndex((s) => s.key === current);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between gap-3">
                {steps.map((s, idx) => {
                    const done = idx < currentIndex;
                    const active = idx === currentIndex;

                    return (
                        <div key={s.key} className="flex-1">
                            <div className="flex items-center gap-3">
                                <div
                                    className={[
                                        "h-9 w-9 rounded-full flex items-center justify-center border transition-all duration-300",
                                        done
                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                            : active
                                                ? "bg-white border-slate-900 text-slate-900 ring-4 ring-slate-100"
                                                : "bg-white border-slate-200 text-slate-400",
                                    ].join(" ")}
                                >
                                    {done ? <CheckCircle2 size={18} /> :
                                        active ? <Circle size={18} className="animate-pulse" /> :
                                            <Circle size={18} />}
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className={[
                                            "text-sm font-bold truncate",
                                            active
                                                ? "text-slate-900"
                                                : done
                                                    ? "text-emerald-600"
                                                    : "text-slate-400",
                                        ].join(" ")}
                                    >
                                        {s.label}
                                    </p>
                                    <div
                                        className={[
                                            "h-1 rounded-full mt-1 transition-all duration-500",
                                            done
                                                ? "bg-emerald-500 w-full"
                                                : active
                                                    ? "bg-slate-900 w-full"
                                                    : "bg-slate-200 w-0",
                                        ].join(" ")}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
