import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../Components/UI/Button';

export default function AdminLogin({ errors = {} }: { errors?: Record<string, string> }) {
    const [email, setEmail] = useState('admin@painpoint.com');
    const [password, setPassword] = useState('password123');
    const [remember, setRemember] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/admin/login', {
            email,
            password,
            remember,
        }, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <Head title="Administrative Console Access — PainPoint Moderation" />

            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/20">
                        P
                    </div>
                </div>
                <h2 className="mt-4 text-center text-2xl font-extrabold text-white tracking-tight">
                    PainPoint Admin Console
                </h2>
                <p className="mt-1 text-center text-xs text-slate-400">
                    Restricted Area • Problem Moderation & Taxonomy Review
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
                <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
                    
                    {/* Error Display */}
                    {errors.email && (
                        <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>{errors.email}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Administrator Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                    placeholder="admin@painpoint.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 pointer-events-none" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
                                />
                                <span>Remember session</span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={isSubmitting}
                            className="w-full py-2.5 text-sm font-bold shadow-lg shadow-indigo-600/30"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-1.5">
                                    Enter Admin Dashboard <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Pre-seeded demo credentials hint */}
                    <div className="p-3 bg-indigo-950/40 border border-indigo-900/60 rounded-2xl text-[11px] text-indigo-300 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                            Default Platform Credentials:
                        </div>
                        <p className="font-mono text-slate-300">
                            Email: <strong className="text-white">admin@painpoint.com</strong> • Password: <strong className="text-white">password123</strong>
                        </p>
                    </div>

                    <div className="text-center">
                        <a href="/" className="text-xs text-slate-500 hover:text-slate-400">
                            ← Return to Public Site
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
