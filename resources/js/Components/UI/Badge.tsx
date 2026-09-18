import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'neutral' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'outline';
    size?: 'sm' | 'md';
}

export function Badge({
    children,
    className,
    variant = 'default',
    size = 'sm',
    ...props
}: BadgeProps) {
    const base = 'inline-flex items-center font-medium rounded-md tracking-tight whitespace-nowrap';

    const variants = {
        default: 'bg-slate-100 text-slate-700',
        neutral: 'bg-slate-100/80 text-slate-600 border border-slate-200/60',
        indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
        emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        amber: 'bg-amber-50 text-amber-700 border border-amber-100',
        rose: 'bg-rose-50 text-rose-700 border border-rose-100',
        outline: 'border border-slate-200 text-slate-600 bg-white',
    };

    const sizes = {
        sm: 'text-[11px] px-2 py-0.5 gap-1',
        md: 'text-xs px-2.5 py-1 gap-1.5',
    };

    return (
        <span
            className={twMerge(clsx(base, variants[variant], sizes[size], className))}
            {...props}
        >
            {children}
        </span>
    );
}
