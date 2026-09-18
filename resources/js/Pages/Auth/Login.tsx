import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../../Components/UI/Button';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            window.location.href = '/explore';
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Sign In — PainPoint" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        P
                    </div>
                    <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                        PainPoint
                    </span>
                </Link>

                <h2 className="text-center text-2xl font-extrabold text-slate-900 tracking-tight">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-xs text-slate-500">
                    Or{' '}
                    <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 underline">
                        create a free community account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-sm border border-slate-200/80">
                    
                    {/* Google OAuth button */}
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = '/explore';
                        }}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all shadow-xs"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-400 font-semibold">Or with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-slate-700">
                                    Password
                                </label>
                                <a href="#" className="text-xs text-indigo-600 hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                            />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
