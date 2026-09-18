import React from 'react';
import { 
    ThumbsUp, 
    MessageSquare, 
    Sparkles, 
    Award, 
    ArrowRight, 
    Zap, 
    DollarSign,
    Check
} from 'lucide-react';
import { Solution } from '../../types';
import { Badge } from '../UI/Badge';

interface SolutionCardProps {
    solution: Solution;
    onVote?: (solutionId: number) => void;
}

export function SolutionCard({ solution, onVote }: SolutionCardProps) {
    const isTopThree = solution.rank && solution.rank <= 3;

    return (
        <div className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all duration-200 ${
            isTopThree 
                ? 'border-indigo-200/80 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.08)] ring-1 ring-indigo-500/10' 
                : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
        }`}>
            <div className="flex items-start justify-between gap-4 mb-3">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                        {solution.author.avatar ? (
                            <img src={solution.author.avatar} alt={solution.author.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            solution.author.name.substring(0, 2).toUpperCase()
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{solution.author.name}</span>
                            {solution.author.role && (
                                <span className="text-[11px] text-slate-400">({solution.author.role})</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>★ {solution.author.reputation} rep</span>
                            <span>•</span>
                            <span>{solution.createdAt}</span>
                        </div>
                    </div>
                </div>

                {/* Badges: Type & Top Rank */}
                <div className="flex items-center gap-2">
                    <Badge variant="indigo">{solution.solutionType}</Badge>
                    {isTopThree && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100/80 text-amber-800 border border-amber-200">
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            #{solution.rank} Top Solution
                        </span>
                    )}
                </div>
            </div>

            {/* Solution Title */}
            <h4 className="text-lg font-bold text-slate-900 mb-2">
                {solution.title}
            </h4>

            {/* Summary */}
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {solution.summary}
            </p>

            {/* AI Problem-Fit Signal (if available) */}
            {solution.aiFitScore !== undefined && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-4 flex items-start gap-2.5 text-xs text-slate-700">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold text-indigo-900">AI Problem-Fit Signal ({solution.aiFitScore}%):</span>{' '}
                        <span className="text-slate-600">{solution.aiFitAnalysis || 'High alignment with user-reported root causes.'}</span>
                    </div>
                </div>
            )}

            {/* Meta attributes (Difficulty & Cost) */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                {solution.implementationDifficulty && (
                    <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Difficulty: <strong className="text-slate-700 font-semibold">{solution.implementationDifficulty}</strong>
                    </span>
                )}
                {solution.estimatedCost && (
                    <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        Cost: <strong className="text-slate-700 font-semibold">{solution.estimatedCost}</strong>
                    </span>
                )}
            </div>

            {/* Footer Actions: Vote & Comments */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => onVote && onVote(solution.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        solution.hasVoted 
                            ? 'bg-indigo-600 text-white shadow-xs' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                >
                    <ThumbsUp className={`w-3.5 h-3.5 ${solution.hasVoted ? 'fill-current' : ''}`} />
                    <span>Upvote</span>
                    <span className="ml-1 px-1.5 py-0.2 rounded bg-black/10 text-[11px]">
                        {solution.votesCount}
                    </span>
                </button>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {solution.commentsCount} comments
                    </span>
                    <span className="text-emerald-700 font-medium">
                        {solution.helpfulVotesCount} found helpful
                    </span>
                </div>
            </div>
        </div>
    );
}
