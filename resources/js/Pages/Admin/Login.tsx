import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Shield } from 'lucide-react';
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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-900 antialiased">
            <Head title="Administrative Console Access — PainPoint" />

            {/* Background subtle mesh glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl shadow-md shadow-indigo-500/20 mb-4">
                    P
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    PainPoint Administrator
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Restricted Operations, Moderation & Governance
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
                <div className="bg-white border border-slate-200/80 py-8 px-6 sm:px-10 shadow-xl rounded-3xl space-y-6">
                    
                    {/* Error Display */}
                    {errors.email && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>{errors.email}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Admin Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 text-sm outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                                    placeholder="admin@painpoint.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Security Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 text-sm outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>Keep session active</span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={isSubmitting}
                            className="w-full py-3 text-sm font-bold shadow-md shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating credentials...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-1.5">
                                    Sign In to Operations Console <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Default platform credentials hint */}
                    <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-xs text-indigo-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            Default Platform Credentials:
                        </div>
                        <p className="font-mono text-slate-700 text-[11px]">
                            Email: <strong className="text-indigo-950 font-bold">admin@painpoint.com</strong> • Password: <strong className="text-indigo-950 font-bold">password123</strong>
                        </p>
                    </div>

                    <div className="text-center pt-2">
                        <a href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-900">
                            ← Return to Public Site
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
