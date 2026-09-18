import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Flame, TrendingUp, Users, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { AppLayout } from '../Components/Layout/AppLayout';
import { ProblemCard } from '../Components/Problems/ProblemCard';
import { mockProblems } from '../data/mockData';

export default function Trending() {
    const trendingProblems = mockProblems.filter(p => p.isTrending);

    return (
        <AppLayout>
            <Head title="Trending Problems — High Community Velocity Pain Points" />

            <div className="bg-white border-b border-slate-200/80 pt-10 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/70 mb-3">
                            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Community Velocity Tracker</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Trending Problems
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed">
                            Discover real-world issues experiencing rapid surges in practitioner validation, new comments, and proposed solutions over the last 48 hours.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200/60">
                        <span>Showing <strong>{trendingProblems.length}</strong> trending issues</span>
                        <span className="italic">* Ranked by velocity algorithm based on community signals</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trendingProblems.map((problem) => (
                            <ProblemCard key={problem.id} problem={problem} featured={true} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
