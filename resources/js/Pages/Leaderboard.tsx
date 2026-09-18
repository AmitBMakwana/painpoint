import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '../Components/Layout/AppLayout';
import { 
    Trophy, 
    Heart, 
    Lightbulb, 
    Users, 
    Star, 
    Flame, 
    ArrowUpRight, 
    MapPin, 
    Sparkles, 
    Filter, 
    Eye, 
    Check, 
    MessageSquare,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { Button } from '../Components/UI/Button';

interface ProblemRanked {
    rank: number;
    id: number;
    public_id: string;
    slug: string;
    title: string;
    description: string;
    category_slug: string;
    category_name: string;
    urgency: string;
    scale: string;
    frequency: string;
    country?: string;
    state?: string;
    city?: string;
    support_count: number;
    contribution_count: number;
    comment_count: number;
    views_count: number;
    interaction_score: number;
    is_pinned: boolean;
    pin_order?: number;
    badge?: string;
    created_at: string;
}

interface RankedUser {
    rank: number;
    id: number;
    name: string;
    username: string;
    role: string;
    avatar_url?: string;
    points: number;
    reputation: number;
    problems_count: number;
    solutions_count: number;
}

interface LeaderboardProps {
    rankedProblems: ProblemRanked[];
    rankedUsers: RankedUser[];
    currentSort: string;
    currentCategory: string;
    categories: { slug: string; name: string }[];
    communityStats: {
        totalInteractions: number;
        totalSolutions: number;
        totalProblems: number;
    };
}

export default function Leaderboard({
    rankedProblems = [],
    rankedUsers = [],
    currentSort = 'interactions',
    currentCategory = 'all',
    categories = [],
    communityStats = { totalInteractions: 3500, totalSolutions: 120, totalProblems: 45 },
}: LeaderboardProps) {
    const [viewMode, setViewMode] = useState<'problems' | 'users'>('problems');
    const [supportedMap, setSupportedMap] = useState<Record<number, boolean>>({});
    const [supportCountMap, setSupportCountMap] = useState<Record<number, number>>(() => {
        const map: Record<number, number> = {};
        rankedProblems.forEach((p) => {
            map[p.id] = p.support_count;
        });
        return map;
    });

    const handleSortChange = (sort: string) => {
        router.get('/leaderboard', {
            sort,
            category: currentCategory,
        }, { preserveState: true });
    };

    const handleCategoryChange = (category: string) => {
        router.get('/leaderboard', {
            sort: currentSort,
            category,
        }, { preserveState: true });
    };

    // Instant support / star / like action directly in list
    const handleSupportProblem = async (problemId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (supportedMap[problemId]) return;

        setSupportedMap((prev) => ({ ...prev, [problemId]: true }));
        setSupportCountMap((prev) => ({ ...prev, [problemId]: (prev[problemId] || 0) + 1 }));

        try {
            await fetch(`/api/problems/${problemId}/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                },
            });
        } catch (err) {
            console.error('Support error', err);
        }
    };

    const topThreeProblems = rankedProblems.slice(0, 3);
    const remainingProblems = rankedProblems.slice(3);

    return (
        <AppLayout>
            <Head title="Problem Leaderboard — Ranked by People Interacted & Contributions" />

            <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen py-10 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    
                    {/* Header Banner */}
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-2xs">
                            <Flame className="w-3.5 h-3.5 text-rose-500" />
                            Live Problem Leaderboard • Community Validation Ranking
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                            Most Impacted Real-World Problems
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600">
                            Ranked on top by the number of interacting people who confirmed they experience this friction and the community solutions contributed.
                        </p>
                    </div>

                    {/* Community Stats Quick Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-extrabold text-slate-900">{communityStats.totalInteractions.toLocaleString()}</div>
                                <div className="text-xs text-slate-500">People Interacted & Supported</div>
                            </div>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <Lightbulb className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-extrabold text-slate-900">{communityStats.totalSolutions.toLocaleString()}</div>
                                <div className="text-xs text-slate-500">Community Solutions Contributed</div>
                            </div>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-extrabold text-slate-900">{communityStats.totalProblems.toLocaleString()}</div>
                                <div className="text-xs text-slate-500">Validated Problems on Board</div>
                            </div>
                        </div>
                    </div>

                    {/* TOP 3 PROBLEMS PODIUM SPOTLIGHT */}
                    {topThreeProblems.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-500" />
                                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                        Top 3 Most Impacted Problems Podium
                                    </h2>
                                </div>
                                <span className="text-xs text-slate-500 hidden sm:inline">
                                    Determined deterministically by people affected + solution velocity
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                                
                                {/* #2 Second Most Impacted */}
                                {topThreeProblems[1] && (
                                    <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col justify-between order-2 md:order-1 relative overflow-hidden group hover:border-slate-300 transition-all">
                                        <div className="absolute top-0 left-0 right-0 h-2 bg-slate-300" />
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 flex items-center gap-1.5">
                                                    🥈 Rank #2 Problem
                                                </span>
                                                <span className="text-[11px] font-mono text-slate-400">
                                                    {topThreeProblems[1].public_id}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {topThreeProblems[1].title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                                                    {topThreeProblems[1].category_name}
                                                </span>
                                                {topThreeProblems[1].city && (
                                                    <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                                                        <MapPin className="w-3 h-3 text-indigo-500" /> {topThreeProblems[1].city}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="text-[10px] text-slate-500 font-medium uppercase">Interacting People</div>
                                                <div className="text-base font-extrabold text-rose-600 flex items-center gap-1">
                                                    <Heart className="w-4 h-4 fill-rose-500" />
                                                    {supportCountMap[topThreeProblems[1].id] ?? topThreeProblems[1].support_count}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleSupportProblem(topThreeProblems[1].id, e)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                                                        supportedMap[topThreeProblems[1].id]
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                                    }`}
                                                >
                                                    <Heart className={`w-3.5 h-3.5 ${supportedMap[topThreeProblems[1].id] ? 'fill-emerald-600 text-emerald-600' : 'fill-rose-500 text-rose-500'}`} />
                                                    {supportedMap[topThreeProblems[1].id] ? 'Supported' : 'Support'}
                                                </button>
                                                <Link
                                                    href={`/problems/${topThreeProblems[1].slug}`}
                                                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                                                    title="View Solutions"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* #1 MOST IMPACTED PROBLEM (ELEVATED GOLD PODIUM) */}
                                {topThreeProblems[0] && (
                                    <div className="bg-white rounded-3xl p-7 border-2 border-amber-300 shadow-xl shadow-amber-500/10 flex flex-col justify-between order-1 md:order-2 md:-translate-y-3 relative overflow-hidden ring-4 ring-amber-400/20 group">
                                        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-amber-400 to-amber-500" />
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-extrabold px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                                                    👑 🥇 #1 TOP PROBLEM
                                                </span>
                                                <span className="text-[11px] font-mono text-slate-400">
                                                    {topThreeProblems[0].public_id}
                                                </span>
                                            </div>

                                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                                                {topThreeProblems[0].title}
                                            </h3>

                                            <p className="text-xs text-slate-600 line-clamp-2">
                                                {topThreeProblems[0].description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                                                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-100">
                                                    {topThreeProblems[0].category_name}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px] uppercase border border-rose-100">
                                                    {topThreeProblems[0].urgency} Urgency
                                                </span>
                                                {topThreeProblems[0].city && (
                                                    <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                                                        <MapPin className="w-3 h-3 text-indigo-500" /> {topThreeProblems[0].city}, {topThreeProblems[0].country}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-5 mt-5 border-t border-amber-100 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <div className="text-[10px] text-slate-500 font-medium uppercase">People Affected</div>
                                                    <div className="text-lg font-extrabold text-rose-600 flex items-center gap-1">
                                                        <Heart className="w-4 h-4 fill-rose-500" />
                                                        {supportCountMap[topThreeProblems[0].id] ?? topThreeProblems[0].support_count}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-slate-500 font-medium uppercase">Solutions</div>
                                                    <div className="text-lg font-extrabold text-indigo-600 flex items-center gap-1">
                                                        <Lightbulb className="w-4 h-4" />
                                                        {topThreeProblems[0].contribution_count}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleSupportProblem(topThreeProblems[0].id, e)}
                                                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm ${
                                                        supportedMap[topThreeProblems[0].id]
                                                            ? 'bg-emerald-600 text-white'
                                                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                                                    }`}
                                                >
                                                    <Heart className="w-3.5 h-3.5 fill-white" />
                                                    {supportedMap[topThreeProblems[0].id] ? 'Supported' : 'Support / Star'}
                                                </button>
                                                <Link
                                                    href={`/problems/${topThreeProblems[0].slug}`}
                                                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                                                    title="Deep Dive Problem"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* #3 Third Most Impacted */}
                                {topThreeProblems[2] && (
                                    <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-sm flex flex-col justify-between order-3 relative overflow-hidden group hover:border-orange-300 transition-all">
                                        <div className="absolute top-0 left-0 right-0 h-2 bg-orange-300" />
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200 flex items-center gap-1.5">
                                                    🥉 Rank #3 Problem
                                                </span>
                                                <span className="text-[11px] font-mono text-slate-400">
                                                    {topThreeProblems[2].public_id}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {topThreeProblems[2].title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                                                    {topThreeProblems[2].category_name}
                                                </span>
                                                {topThreeProblems[2].city && (
                                                    <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                                                        <MapPin className="w-3 h-3 text-indigo-500" /> {topThreeProblems[2].city}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="text-[10px] text-slate-500 font-medium uppercase">Interacting People</div>
                                                <div className="text-base font-extrabold text-rose-600 flex items-center gap-1">
                                                    <Heart className="w-4 h-4 fill-rose-500" />
                                                    {supportCountMap[topThreeProblems[2].id] ?? topThreeProblems[2].support_count}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleSupportProblem(topThreeProblems[2].id, e)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                                                        supportedMap[topThreeProblems[2].id]
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                                    }`}
                                                >
                                                    <Heart className={`w-3.5 h-3.5 ${supportedMap[topThreeProblems[2].id] ? 'fill-emerald-600 text-emerald-600' : 'fill-rose-500 text-rose-500'}`} />
                                                    {supportedMap[topThreeProblems[2].id] ? 'Supported' : 'Support'}
                                                </button>
                                                <Link
                                                    href={`/problems/${topThreeProblems[2].slug}`}
                                                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                                                    title="View Solutions"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                    {/* FILTER CONTROLS BAR */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        
                        {/* Tab Switcher: Problem Leaderboard vs Contributor Solvers */}
                        <div className="inline-flex p-1 bg-slate-100 rounded-2xl text-xs font-bold self-start">
                            <button
                                type="button"
                                onClick={() => setViewMode('problems')}
                                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                                    viewMode === 'problems'
                                        ? 'bg-white text-indigo-700 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Flame className="w-4 h-4 text-rose-500" />
                                Problem Leaderboard ({rankedProblems.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('users')}
                                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                                    viewMode === 'users'
                                        ? 'bg-white text-indigo-700 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Users className="w-4 h-4 text-indigo-600" />
                                Top Solvers & Architects ({rankedUsers.length})
                            </button>
                        </div>

                        {/* Sort & Domain Filters (when in problems mode) */}
                        {viewMode === 'problems' && (
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs">
                                    <span className="text-slate-500 font-semibold">Sort by:</span>
                                    <select
                                        value={currentSort}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 outline-none cursor-pointer focus:border-indigo-500"
                                    >
                                        <option value="interactions">🔥 Most Interacted & Contributed</option>
                                        <option value="supports">❤️ Most People Affected (Supports)</option>
                                        <option value="contributions">💡 Most Solutions Contributed</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs">
                                    <span className="text-slate-500 font-semibold">Domain:</span>
                                    <select
                                        value={currentCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 outline-none cursor-pointer focus:border-indigo-500"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.slug} value={c.slug}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* MAIN PROBLEM LEADERBOARD LIST */}
                    {viewMode === 'problems' ? (
                        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                            <th className="py-4 px-4 sm:px-6 w-20">Rank</th>
                                            <th className="py-4 px-4">Problem Statement</th>
                                            <th className="py-4 px-4">Domain</th>
                                            <th className="py-4 px-4 text-center">
                                                <span className="inline-flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5 text-rose-500" />
                                                    People Interacted
                                                </span>
                                            </th>
                                            <th className="py-4 px-4 text-center">
                                                <span className="inline-flex items-center gap-1">
                                                    <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
                                                    Solutions
                                                </span>
                                            </th>
                                            <th className="py-4 px-4 text-center">Urgency</th>
                                            <th className="py-4 px-4 sm:px-6 text-right">Support / Star</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {rankedProblems.map((p) => {
                                            const currentSupports = supportCountMap[p.id] ?? p.support_count;
                                            const isSupported = supportedMap[p.id];

                                            return (
                                                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="py-4 px-4 sm:px-6 font-mono font-bold">
                                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs ${
                                                            p.rank === 1 ? 'bg-amber-100 text-amber-900 font-extrabold border border-amber-300' :
                                                            p.rank === 2 ? 'bg-slate-200 text-slate-800 font-extrabold border border-slate-300' :
                                                            p.rank === 3 ? 'bg-orange-100 text-orange-900 font-extrabold border border-orange-300' :
                                                            'bg-slate-100 text-slate-700'
                                                        }`}>
                                                            {p.rank <= 3 ? (p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : '🥉') : `#${p.rank}`}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 max-w-md">
                                                        <Link
                                                            href={`/problems/${p.slug}`}
                                                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block text-sm sm:text-base leading-snug"
                                                        >
                                                            {p.title}
                                                        </Link>
                                                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                                            {p.description}
                                                        </p>
                                                        {p.city && (
                                                            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                                                                <MapPin className="w-3 h-3 text-indigo-500" />
                                                                {p.city}, {p.country}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                                                            {p.category_name}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className="font-extrabold text-rose-600 text-base font-mono inline-flex items-center gap-1">
                                                            <Heart className="w-3.5 h-3.5 fill-rose-500" />
                                                            {currentSupports.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className="font-bold text-indigo-600 text-sm inline-flex items-center gap-1">
                                                            <Lightbulb className="w-3.5 h-3.5" />
                                                            {p.contribution_count}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                                            p.urgency === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                            p.urgency === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                            'bg-slate-100 text-slate-700'
                                                        }`}>
                                                            {p.urgency}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleSupportProblem(p.id, e)}
                                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                                                    isSupported
                                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                                                }`}
                                                                title="Confirm you experience this problem too"
                                                            >
                                                                <Heart className={`w-3.5 h-3.5 ${isSupported ? 'fill-emerald-600 text-emerald-600' : 'fill-rose-500 text-rose-500'}`} />
                                                                <span>{isSupported ? 'Supported' : 'Support'}</span>
                                                            </button>

                                                            <Link
                                                                href={`/problems/${p.slug}`}
                                                                className="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                                                                title="View Details & Community Solutions"
                                                            >
                                                                <ChevronRight className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        // SECONDARY TAB: CONTRIBUTORS RANKING
                        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900">Top Problem Solvers & Architects</h3>
                                <p className="text-xs text-slate-500">Ranked by community reputation points earned for proposing accepted solutions.</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                            <th className="py-3 px-4 sm:px-6 w-16">Rank</th>
                                            <th className="py-3 px-4">Contributor</th>
                                            <th className="py-3 px-4">Role</th>
                                            <th className="py-3 px-4 text-center">Problems Submitted</th>
                                            <th className="py-3 px-4 text-center">Solutions Contributed</th>
                                            <th className="py-3 px-4 sm:px-6 text-right">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {rankedUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-700">
                                                    #{u.rank}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=e2e8f0&color=334155`}
                                                            alt={u.name}
                                                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                                                        />
                                                        <div>
                                                            <div className="font-bold text-slate-900">{u.name}</div>
                                                            <div className="text-xs text-slate-500">@{u.username}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-xs text-slate-600">{u.role}</td>
                                                <td className="py-4 px-4 text-center font-semibold text-slate-700">{u.problems_count}</td>
                                                <td className="py-4 px-4 text-center font-semibold text-indigo-600">{u.solutions_count}</td>
                                                <td className="py-4 px-4 sm:px-6 text-right font-extrabold text-slate-900 font-mono">
                                                    {u.points} pts
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Bottom Action CTA */}
                    <div className="p-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="space-y-1.5 max-w-xl text-center sm:text-left">
                            <h3 className="text-xl font-extrabold">Do you experience an unsolved real-world friction?</h3>
                            <p className="text-xs text-slate-300">
                                Put your problem on the community leaderboard. Builders and researchers actively inspect the top ranked problems every day.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => window.location.href = '/submit-problem'}
                            className="bg-white text-indigo-950 hover:bg-slate-100 font-bold shrink-0 shadow-md"
                        >
                            Report a Problem (Public)
                        </Button>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
