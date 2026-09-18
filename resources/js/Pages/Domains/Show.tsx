import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Layers, Plus, ArrowRight, Flame } from 'lucide-react';
import { AppLayout } from '../../Components/Layout/AppLayout';
import { ProblemCard } from '../../Components/Problems/ProblemCard';
import { Button } from '../../Components/UI/Button';
import { mockDomains, mockProblems } from '../../data/mockData';

interface DomainShowProps {
    slug?: string;
}

export default function DomainShow({ slug = 'education' }: DomainShowProps) {
    const domain = mockDomains.find(d => d.slug === slug) || mockDomains[0];
    const domainProblems = mockProblems.filter(p => p.domain.slug === domain.slug);

    return (
        <AppLayout>
            <Head title={`${domain.name} Problems — PainPoint Domain`} />

            <div className="bg-white border-b border-slate-200/80 pt-8 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href="/domains" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                            <span>All Domains</span>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                    Domain Focus
                                </span>
                                {domain.isTrending && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/70">
                                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                                        Trending Category
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                {domain.name}
                            </h1>
                            <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed">
                                {domain.description}
                            </p>
                        </div>

                        <Link href="/problems/create">
                            <Button variant="primary" size="md" className="shrink-0 shadow-xs">
                                <Plus className="w-4 h-4" />
                                <span>+ Submit in {domain.name}</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200/60">
                        <span>Showing <strong>{domainProblems.length}</strong> active problems in this space</span>
                        <Link href={`/explore?domain=${domain.slug}`} className="text-indigo-600 hover:underline font-semibold">
                            Advanced Filters →
                        </Link>
                    </div>

                    {domainProblems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {domainProblems.map(problem => (
                                <ProblemCard key={problem.id} problem={problem} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                            <h3 className="text-base font-bold text-slate-900 mb-1">No problems logged here yet</h3>
                            <p className="text-xs text-slate-500 mb-4">Be the first to articulate a pain point in this market domain.</p>
                            <Link href="/problems/create">
                                <Button variant="primary" size="sm">+ Submit a Problem</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
