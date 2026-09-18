import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Award, Lightbulb, Users, Bookmark, MessageSquare, Flame, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AppLayout } from '../../Components/Layout/AppLayout';
import { ProblemCard } from '../../Components/Problems/ProblemCard';
import { SolutionCard } from '../../Components/Solutions/SolutionCard';
import { mockProblems, mockSolutions, mockCurrentUser } from '../../data/mockData';

export default function ProfileShow() {
    const [activeTab, setActiveTab] = useState<'problems' | 'solutions' | 'saved'>('problems');

    const userProblems = mockProblems.slice(0, 2);
    const userSolutions = mockSolutions.slice(0, 2);
    const savedProblems = mockProblems.slice(2, 4);

    return (
        <AppLayout>
            <Head title={`${mockCurrentUser.name} (@${mockCurrentUser.name.toLowerCase().replace(' ', '')}) — Profile`} />

            {/* Profile Header Banner */}
            <div className="bg-white border-b border-slate-200/80 pt-10 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-50 border-2 border-indigo-100 overflow-hidden shadow-xs shrink-0">
                            <img src={mockCurrentUser.avatar} alt={mockCurrentUser.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {mockCurrentUser.name}
                                </h1>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                    <Award className="w-3.5 h-3.5" />
                                    {mockCurrentUser.reputation} Reputation
                                </span>
                            </div>

                            <p className="text-sm font-medium text-slate-600">
                                {mockCurrentUser.role}
                            </p>

                            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                                Passionate about solving real-world friction in education, small business logistics, and workflow automation. Active contributor since 2026.
                            </p>

                            {/* Community Badges */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    🏆 Top Solver
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                                    💡 Idea Contributor
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    🛡️ Problem Hunter
                                </span>
                            </div>
                        </div>

                        {/* Metric Counter Card */}
                        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center text-xs self-stretch sm:self-auto shrink-0">
                            <div className="px-2">
                                <div className="text-lg font-black text-slate-900">4</div>
                                <div className="text-[10px] text-slate-400">Problems</div>
                            </div>
                            <div className="px-2 border-l border-slate-200">
                                <div className="text-lg font-black text-indigo-600">9</div>
                                <div className="text-[10px] text-slate-400">Solutions</div>
                            </div>
                            <div className="px-2 border-l border-slate-200">
                                <div className="text-lg font-black text-emerald-600">280</div>
                                <div className="text-[10px] text-slate-400">Helpful</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-6 mt-8 border-t border-slate-100 pt-3 text-sm font-semibold">
                        <button
                            onClick={() => setActiveTab('problems')}
                            className={`pb-3 border-b-2 transition-colors ${
                                activeTab === 'problems'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Submitted Problems ({userProblems.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('solutions')}
                            className={`pb-3 border-b-2 transition-colors ${
                                activeTab === 'solutions'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Proposed Solutions ({userSolutions.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`pb-3 border-b-2 transition-colors ${
                                activeTab === 'saved'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Saved Problems ({savedProblems.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Contents */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {activeTab === 'problems' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userProblems.map(p => (
                            <ProblemCard key={p.id} problem={p} />
                        ))}
                    </div>
                )}

                {activeTab === 'solutions' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userSolutions.map(s => (
                            <SolutionCard key={s.id} solution={s} />
                        ))}
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedProblems.map(p => (
                            <ProblemCard key={p.id} problem={p} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
