import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Sparkles, AlertCircle, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { Button } from '../../Components/UI/Button';

interface RegisterProps {
    errors?: Record<string, string>;
}

export default function Register({ errors = {} }: RegisterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/register', {
            name,
            email,
            password,
        }, {
            onError: () => setIsSubmitting(false),
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Create Free Community Account — PainPoint" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex items-center justify-center gap-2.5 mb-6 group">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:bg-indigo-700 transition-colors">
                        P
                    </div>
                    <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
                        PainPoint
                    </span>
                </Link>

                <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Join the community
                </h2>
                <p className="mt-2 text-center text-xs sm:text-sm text-slate-600">
                    Validate everyday friction, propose solutions, and climb the contributor leaderboard.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-sm border border-slate-200/80 space-y-6">
                    
                    {/* Error Display */}
                    {Object.keys(errors).length > 0 && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            <div>
                                {Object.values(errors).map((err, i) => (
                                    <p key={i}>{err}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Your Full Name
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Elena Rostova"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Work or Personal Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Password (min. 8 characters)
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                className="w-full py-2.5 text-sm font-bold shadow-md shadow-indigo-600/20"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-1.5">
                                        Create Free Account <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-xs text-slate-600">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
                                Sign in
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
