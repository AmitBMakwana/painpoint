import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '../../../Layouts/AdminLayout';
import { 
    Lightbulb, 
    Search, 
    CheckCircle2, 
    Trash2, 
    ExternalLink, 
    User, 
    ThumbsUp, 
    ShieldCheck, 
    FileText,
    Star,
    Sparkles,
    Check
} from 'lucide-react';
import { Button } from '../../../Components/UI/Button';

interface SolutionItem {
    id: number;
    title: string;
    content: string;
    type: string;
    contributor_name: string;
    contributor_role?: string;
    helpful_count: number;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        points: number;
    };
    problem?: {
        id: number;
        public_id: string;
        title: string;
        slug: string;
        category_name: string;
    };
}

interface SolutionsIndexProps {
    solutions: {
        data: SolutionItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: any[];
    };
    filters: {
        type: string;
        search: string;
    };
    metrics: {
        total_solutions: number;
    };
}

export default function AdminSolutionsIndex({
    solutions,
    filters,
    metrics,
}: SolutionsIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/solutions', {
            search: searchQuery,
            type: typeFilter,
        }, { preserveState: true });
    };

    const handleTypeFilter = (type: string) => {
        setTypeFilter(type);
        router.get('/admin/solutions', {
            search: searchQuery,
            type,
        }, { preserveState: true });
    };

    const handleAccept = (id: number) => {
        router.post(`/admin/solutions/${id}/accept`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to remove solution "${title}"?`)) {
            router.delete(`/admin/solutions/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout
            title="Community Solution Proposals & Validation"
            subtitle={`Auditing ${solutions.total} crowd-sourced workarounds, engineering specs, and commercial products.`}
        >
            <Head title="Solution Moderation — PainPoint Admin" />

            {/* Metrics KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Proposals</div>
                        <div className="text-2xl font-black text-slate-900">{metrics.total_solutions}</div>
                        <div className="text-[10px] text-slate-400">All submitted solutions</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Verification Reward</div>
                        <div className="text-2xl font-black text-slate-900">+50 pts</div>
                        <div className="text-[10px] text-slate-400">Awarded to author on verification</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quality Standard</div>
                        <div className="text-2xl font-black text-slate-900">Deterministic</div>
                        <div className="text-[10px] text-slate-400">Ranks based on community upvotes</div>
                    </div>
                </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                    {['all', 'workaround', 'product', 'concept'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => handleTypeFilter(type)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                                typeFilter === type
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {type === 'all' ? 'All Types' : type}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="relative sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search solution, author, content..."
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-900 outline-none focus:border-indigo-500 shadow-2xs placeholder-slate-400"
                    />
                </form>
            </div>

            {/* Solutions List */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="divide-y divide-slate-100">
                    {solutions.data.length > 0 ? (
                        solutions.data.map((sol) => (
                            <div key={sol.id} className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors space-y-3">
                                
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                                                sol.type === 'workaround'
                                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                                    : sol.type === 'product'
                                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                            }`}>
                                                {sol.type}
                                            </span>

                                            {sol.problem && (
                                                <Link
                                                    href={`/problems/${sol.problem.slug}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1 font-mono text-indigo-600 font-bold hover:underline"
                                                >
                                                    {sol.problem.public_id} • {sol.problem.title} <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                                            {sol.title}
                                        </h3>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleAccept(sol.id)}
                                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                                            title="Mark as verified and award author +50 points"
                                        >
                                            <Check className="w-3.5 h-3.5" /> Verify (+50 pts)
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(sol.id, sol.title)}
                                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors"
                                            title="Remove spam or inappropriate solution"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                                    {sol.content}
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                                            <User className="w-3.5 h-3.5 text-indigo-500" />
                                            {sol.contributor_name} {sol.contributor_role && `• ${sol.contributor_role}`}
                                        </span>
                                        {sol.user && (
                                            <span className="text-[11px] text-amber-600 font-extrabold flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                                {sol.user.points} pts
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 text-[11px]">
                                        <span className="flex items-center gap-1 text-slate-700 font-bold">
                                            <ThumbsUp className="w-3.5 h-3.5 text-indigo-600" />
                                            {sol.helpful_count} helpful votes
                                        </span>
                                        <span>Submitted {new Date(sol.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-slate-500 font-medium">
                            No solution proposals found matching the search criteria.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {solutions.links && solutions.links.length > 3 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                            Showing page {solutions.current_page} of {solutions.last_page} ({solutions.total} solutions)
                        </div>
                        <div className="flex items-center gap-1">
                            {solutions.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : link.url
                                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                            : 'text-slate-400 cursor-not-allowed opacity-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </AdminLayout>
    );
}
