import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Lightbulb, Search, Filter, ArrowUpRight, Award, ThumbsUp, Sparkles } from 'lucide-react';
import { AppLayout } from '../../Components/Layout/AppLayout';
import { SolutionCard } from '../../Components/Solutions/SolutionCard';
import { mockSolutions, mockProblems } from '../../data/mockData';
import { Solution } from '../../types';

export default function SolutionsIndex() {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [solutions, setSolutions] = useState<Solution[]>(mockSolutions);

    const filtered = solutions.filter(s => {
        if (search.trim()) {
            const q = search.toLowerCase();
            if (!s.title.toLowerCase().includes(q) && !s.summary.toLowerCase().includes(q)) return false;
        }
        if (selectedType !== 'all' && s.solutionType !== selectedType) return false;
        return true;
    });

    const handleVote = (id: number) => {
        setSolutions(prev => prev.map(s => {
            if (s.id === id) {
                const next = !s.hasVoted;
                return {
                    ...s,
                    hasVoted: next,
                    votesCount: next ? s.votesCount + 1 : s.votesCount - 1,
                };
            }
            return s;
        }));
    };

    return (
        <AppLayout>
            <Head title="Community Solutions Directory — PainPoint" />

            <div className="bg-white border-b border-slate-200/80 pt-10 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 mb-2 inline-block">
                            Innovation Marketplace
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Community Solutions
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500 mt-2">
                            Explore proposals, SaaS MVPs, open-source scripts, and workflows created by builders to solve community-verified problems.
                        </p>
                    </div>

                    {/* Filter & Search Toolbar */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search solutions by name, keywords..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
                            {['all', 'SaaS', 'Mobile App', 'AI', 'Process'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                                        selectedType === type
                                            ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {type === 'all' ? 'All Types' : type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200/60">
                        <span>Showing <strong>{filtered.length}</strong> community solutions</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filtered.map(solution => (
                            <div key={solution.id} className="flex flex-col justify-between">
                                <SolutionCard solution={solution} onVote={handleVote} />
                                {solution.problemId && (
                                    <div className="mt-2 px-2 flex items-center justify-between text-xs text-slate-500">
                                        <span className="truncate">Solves problem:</span>
                                        <Link
                                            href={`/problems/how-can-schools-reduce-the-amount-of-manual-work-teachers-do-every-day`}
                                            className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
                                        >
                                            <span>View Problem Discussion</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
