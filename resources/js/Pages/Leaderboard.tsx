import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '../Components/Layout/AppLayout';
import { 
    Trophy, 
    Medal, 
    Sparkles, 
    Heart, 
    Lightbulb, 
    CheckCircle2, 
    Star, 
    TrendingUp, 
    Users, 
    Pin, 
    ArrowUpRight, 
    Shield, 
    Flame 
} from 'lucide-react';
import { Button } from '../Components/UI/Button';

interface RankedUser {
    rank: number;
    id: number;
    name: string;
    username: string;
    role: string;
    avatar_url?: string;
    badge: string;
    points: number;
    reputation: number;
    problems_count: number;
    solutions_count: number;
    joined_at: string;
}

interface TopProblem {
    id: number;
    public_id: string;
    slug: string;
    title: string;
    category_name: string;
    support_count: number;
    contribution_count: number;
    is_pinned: boolean;
    pin_order: number;
}

interface LeaderboardProps {
    rankedUsers: RankedUser[];
    topProblems: TopProblem[];
    timeframe: string;
    communityStats: {
        totalMembers: number;
        totalProblems: number;
        totalSolutions: number;
    };
}

export default function Leaderboard({
    rankedUsers = [],
    topProblems = [],
    timeframe = 'all_time',
    communityStats = { totalMembers: 5200, totalProblems: 430, totalSolutions: 1140 },
}: LeaderboardProps) {
    const [activeTab, setActiveTab] = useState(timeframe);

    const topThree = rankedUsers.slice(0, 3);
    const restUsers = rankedUsers.slice(3);

    return (
        <AppLayout>
            <Head title="Community Leaderboard & Top 3 Problems — PainPoint" />

            <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen py-10 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    
                    {/* Header Banner */}
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3 shadow-2xs">
                            <Trophy className="w-3.5 h-3.5 text-amber-600" />
                            Community Merits & Architecture Champions
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                            Contributor Leaderboard
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600">
                            Recognizing researchers, architects, and problem solvers turning friction into validated community solutions.
                        </p>
                    </div>

                    {/* TOP 3 PINNED PROBLEMS SPOTLIGHT SECTION */}
                    {topProblems.length > 0 && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Pin className="w-4 h-4 text-amber-600 fill-amber-500" />
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                            Top 3 Community-Pinned Problems
                                        </h2>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-0.5">
                                        Vetted and pinned by platform curators for urgent cross-domain problem solving.
                                    </p>
                                </div>
                                <Link
                                    href="/explore"
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                >
                                    Browse All Problems <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {topProblems.map((prob, idx) => (
                                    <div
                                        key={prob.id}
                                        className="relative p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between group shadow-2xs"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                                    idx === 0 
                                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                        : idx === 1 
                                                        ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                                        : 'bg-orange-100 text-orange-800 border border-orange-300'
                                                }`}>
                                                    {idx === 0 ? '🥇 #1 Priority' : idx === 1 ? '🥈 #2 Priority' : '🥉 #3 Priority'}
                                                </span>
                                                <span className="text-[11px] font-mono text-slate-600">
                                                    {prob.public_id}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {prob.title}
                                            </h3>

                                            <span className="inline-block text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                                {prob.category_name}
                                            </span>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <span className="flex items-center gap-1 font-semibold text-rose-600">
                                                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                                                    {prob.support_count}
                                                </span>
                                                <span className="flex items-center gap-1 font-semibold text-indigo-600">
                                                    <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                                                    {prob.contribution_count} solutions
                                                </span>
                                            </div>

                                            <Link
                                                href={`/problems/${prob.slug}`}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5"
                                            >
                                                Solve <ArrowUpRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PODIUM: TOP 3 CONTRIBUTORS */}
                    {topThree.length >= 3 && (
                        <div>
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Hall of Fame Architects</h2>
                                <p className="text-xs text-slate-600">Highest rated contributors across problems discovered and solutions proposed</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
                                
                                {/* 2nd Place: Silver */}
                                <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm text-center order-2 md:order-1 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-slate-300" />
                                    <div className="text-2xl mb-2">🥈</div>
                                    <img
                                        src={topThree[1].avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[1].name)}&background=e2e8f0&color=334155`}
                                        alt={topThree[1].name}
                                        className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-slate-200 mb-3"
                                    />
                                    <h3 className="font-bold text-slate-900 text-base">{topThree[1].name}</h3>
                                    <p className="text-xs text-slate-600">@{topThree[1].username}</p>
                                    <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                        {topThree[1].badge}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-around text-xs">
                                        <div>
                                            <p className="text-slate-600 text-[10px]">Points</p>
                                            <p className="font-extrabold text-slate-900">{topThree[1].points}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-600 text-[10px]">Solutions</p>
                                            <p className="font-extrabold text-slate-900">{topThree[1].solutions_count}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 1st Place: Gold (Elevated) */}
                                <div className="bg-white rounded-3xl p-7 border-2 border-amber-300 shadow-xl shadow-amber-500/10 text-center order-1 md:order-2 md:-translate-y-4 relative overflow-hidden ring-4 ring-amber-400/20">
                                    <div className="absolute top-0 left-0 right-0 h-2.5 bg-amber-400" />
                                    <div className="text-3xl mb-2 animate-bounce">👑 🥇</div>
                                    <img
                                        src={topThree[0].avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[0].name)}&background=fef3c7&color=b45309`}
                                        alt={topThree[0].name}
                                        className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-amber-300 mb-3 shadow-md"
                                    />
                                    <h3 className="font-extrabold text-slate-900 text-lg">{topThree[0].name}</h3>
                                    <p className="text-xs text-slate-600">@{topThree[0].username}</p>
                                    <div className="mt-2 inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs shadow-2xs">
                                        {topThree[0].badge}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-amber-100 flex justify-around text-xs">
                                        <div>
                                            <p className="text-slate-600 text-[10px]">Points</p>
                                            <p className="font-extrabold text-amber-700 text-base">{topThree[0].points}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-600 text-[10px]">Solutions</p>
                                            <p className="font-extrabold text-slate-900 text-base">{topThree[0].solutions_count}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3rd Place: Bronze */}
                                <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-sm text-center order-3 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-orange-300" />
                                    <div className="text-2xl mb-2">🥉</div>
                                    <img
                                        src={topThree[2].avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[2].name)}&background=ffedd5&color=9a3412`}
                                        alt={topThree[2].name}
                                        className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-orange-200 mb-3"
                                    />
                                    <h3 className="font-bold text-slate-900 text-base">{topThree[2].name}</h3>
                                    <p className="text-xs text-slate-600">@{topThree[2].username}</p>
                                    <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 font-semibold text-[11px]">
                                        {topThree[2].badge}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-around text-xs">
                                        <div>
                                            <p className="text-slate-600 text-[10px]">Points</p>
                                            <p className="font-extrabold text-slate-900">{topThree[2].points}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-600 text-[10px]">Solutions</p>
                                            <p className="font-extrabold text-slate-900">{topThree[2].solutions_count}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* TABLE: COMPLETE CONTRIBUTOR RANKINGS */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Full Contributor Rankings</h3>
                                <p className="text-xs text-slate-600">Points earned for submitted problems, verified answers, and upvoted evidence.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-600">Filter:</span>
                                <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('all_time')}
                                        className={`px-3 py-1 rounded-lg transition-all ${
                                            activeTab === 'all_time' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        All Time
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('month')}
                                        className={`px-3 py-1 rounded-lg transition-all ${
                                            activeTab === 'month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        This Month
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                                        <th className="py-3 px-4 sm:px-6 w-16">Rank</th>
                                        <th className="py-3 px-4">Contributor</th>
                                        <th className="py-3 px-4">Role / Title</th>
                                        <th className="py-3 px-4 text-center">Problems</th>
                                        <th className="py-3 px-4 text-center">Solutions</th>
                                        <th className="py-3 px-4 sm:px-6 text-right">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rankedUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-700">
                                                {u.rank === 1 ? '🥇 1' : u.rank === 2 ? '🥈 2' : u.rank === 3 ? '🥉 3' : `#${u.rank}`}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=e2e8f0&color=334155`}
                                                        alt={u.name}
                                                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                            {u.name}
                                                            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                                                {u.badge}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-slate-600">@{u.username} • Joined {u.joined_at}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-xs text-slate-600">
                                                {u.role}
                                            </td>
                                            <td className="py-4 px-4 text-center font-medium text-slate-700">
                                                {u.problems_count}
                                            </td>
                                            <td className="py-4 px-4 text-center font-medium text-indigo-600 font-semibold">
                                                {u.solutions_count}
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 text-right font-extrabold text-slate-900 font-mono">
                                                {u.points} pts
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* How points work callout */}
                    <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-3xl p-6 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-700">
                        <div className="space-y-1">
                            <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                                How do you climb the Leaderboard?
                            </h4>
                            <p className="text-slate-600">
                                Earn +25 pts for submitting real problems, +50 pts when your proposed solution is accepted by the community, and +10 pts for verified evidence and datasets.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => window.location.href = '/submit-problem'}
                            className="shrink-0"
                        >
                            Submit a Problem Now
                        </Button>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
