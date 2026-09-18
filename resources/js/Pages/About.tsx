import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Sparkles, Heart, ShieldCheck, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AppLayout } from '../Components/Layout/AppLayout';
import { Button } from '../Components/UI/Button';

export default function About() {
    return (
        <AppLayout>
            <Head title="About PainPoint — Product Vision & Community Philosophy" />

            <div className="bg-white border-b border-slate-200/80 pt-12 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-3 inline-block">
                        Product Vision
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        "Real Problems. Real People. Better Solutions."
                    </h1>
                    <p className="text-base sm:text-lg text-slate-500 mt-4 leading-relaxed max-w-2xl mx-auto">
                        Too many founders spend months building software that nobody needs. We built PainPoint to reverse the cycle: start with verified human friction, then build solutions with pre-existing market pull.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
                {/* Core Philosophy Section */}
                <section className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-xs space-y-6">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        The Core Philosophy
                    </h2>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-900 space-y-1">
                        <div>PROBLEM</div>
                        <div className="text-slate-400">↓</div>
                        <div>PEOPLE WHO EXPERIENCE IT</div>
                        <div className="text-slate-400">↓</div>
                        <div>CONVERSATION</div>
                        <div className="text-slate-400">↓</div>
                        <div>COMMUNITY SOLUTIONS</div>
                        <div className="text-slate-400">↓</div>
                        <div>VALIDATION</div>
                        <div className="text-slate-400">↓</div>
                        <div className="font-bold text-indigo-600">TOP 3 SOLUTIONS</div>
                        <div className="text-slate-400">↓</div>
                        <div>OPPORTUNITY</div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                        PainPoint is not another generic discussion board. It is a structured discovery and validation protocol. Every problem page acts as a mini-community where practitioners testify to their real experience, quantify their recurring pain, and evaluate proposed solutions.
                    </p>
                </section>

                {/* AI Supporting Role Principle */}
                <section className="bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100 rounded-2xl p-8 sm:p-10 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Philosophy</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                        AI as an Assistant, Never the Judge
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        On PainPoint, artificial intelligence does not decide which solutions win. Instead, AI classifies domains, detects duplicates, and summarizes problem-fit signals. Final Top 3 rankings are computed deterministically using community signals: practitioner validation votes, helpful feedback ratios, and real user consensus.
                    </p>
                </section>

                {/* CTA */}
                <div className="text-center py-8">
                    <Link href="/explore">
                        <Button variant="primary" size="lg">
                            <span>Explore Real Problems Now</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
