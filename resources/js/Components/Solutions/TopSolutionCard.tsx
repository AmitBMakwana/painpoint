import React from 'react';
import { 
    Award, 
    ThumbsUp, 
    CheckCircle2, 
    Sparkles, 
    MessageSquare, 
    ExternalLink,
    TrendingUp
} from 'lucide-react';
import { Solution } from '../../types';
import { Button } from '../UI/Button';

interface TopSolutionCardProps {
    solution: Solution;
    rank: 1 | 2 | 3;
    onVote?: (id: number) => void;
    onSelect?: (solution: Solution) => void;
}

export function TopSolutionCard({ solution, rank, onVote, onSelect }: TopSolutionCardProps) {
    const medalConfig = {
        1: {
            icon: '🥇',
            label: '#1 Top Community Pick',
            accentBg: 'bg-amber-500 text-white',
            border: 'border-amber-200/90 hover:border-amber-300',
            glow: 'shadow-[0_8px_30px_rgb(245,158,11,0.08)] bg-gradient-to-b from-amber-50/25 to-white',
        },
        2: {
            icon: '🥈',
            label: '#2 Runner Up',
            accentBg: 'bg-slate-400 text-white',
            border: 'border-slate-300/90 hover:border-slate-400',
            glow: 'shadow-[0_8px_30px_rgb(148,163,184,0.08)] bg-gradient-to-b from-slate-50/40 to-white',
        },
        3: {
            icon: '🥉',
            label: '#3 Strong Contender',
            accentBg: 'bg-amber-700 text-white',
            border: 'border-orange-200/90 hover:border-orange-300',
            glow: 'shadow-[0_8px_30px_rgb(180,83,9,0.08)] bg-gradient-to-b from-orange-50/20 to-white',
        },
    }[rank];

    return (
        <div className={`relative rounded-2xl border p-5 sm:p-6 transition-all duration-200 ${medalConfig.border} ${medalConfig.glow}`}>
            {/* Rank Badge Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl select-none">{medalConfig.icon}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        {medalConfig.label}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {solution.solutionType}
                    </span>
                </div>
            </div>

            {/* Title */}
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2 leading-snug">
                {solution.title}
            </h4>

            {/* Author */}
            <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">by {solution.author.name}</span>
                <span>•</span>
                <span>★ {solution.author.reputation} rep</span>
                <span>•</span>
                <span>{solution.createdAt}</span>
            </div>

            {/* Explanation */}
            <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {solution.summary}
            </p>

            {/* AI Problem-Fit Signal */}
            {solution.aiFitScore && (
                <div className="bg-white/80 border border-indigo-100 rounded-xl p-3 mb-4 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-semibold text-slate-800">AI Problem-Fit Signal</span>
                    </div>
                    <span className="font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-md">
                        {solution.aiFitScore}% match
                    </span>
                </div>
            )}

            {/* Metric counters & actions */}
            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <button
                        type="button"
                        onClick={() => onVote && onVote(solution.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                            solution.hasVoted 
                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                    >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{solution.votesCount} votes</span>
                    </button>

                    <span className="hidden sm:inline-flex items-center gap-1 text-slate-500 font-normal">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {solution.commentsCount}
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect && onSelect(solution)}
                    className="text-xs"
                >
                    <span>View Solution</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </Button>
            </div>
        </div>
    );
}
