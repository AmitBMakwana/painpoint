import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'emerald' | 'amber' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) {
    const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow shadow-indigo-600/20',
        secondary: 'bg-slate-100 hover:bg-slate-200/80 text-slate-800',
        outline: 'border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-xs',
        ghost: 'hover:bg-slate-100/80 text-slate-600 hover:text-slate-900',
        emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow shadow-emerald-600/20',
        amber: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow shadow-amber-500/20',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20',
    };

    const sizes = {
        sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
        md: 'text-sm px-4 py-2 gap-2 font-medium',
        lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold',
    };

    return (
        <button
            className={twMerge(clsx(base, variants[variant], sizes[size], className))}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}
