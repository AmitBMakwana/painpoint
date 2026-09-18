import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    Users, 
    Lightbulb, 
    MessageSquare, 
    Flame, 
    ArrowUpRight, 
    CheckCircle2, 
    Eye,
    TrendingUp
} from 'lucide-react';
import { Problem } from '../../types';
import { Badge } from '../UI/Badge';

interface ProblemCardProps {
    problem: Problem;
    featured?: boolean;
}

export function ProblemCard({ problem, featured = false }: ProblemCardProps) {
    const validationPct = problem.validation.percentage || 0;

    const getStatusBadge = (status: Problem['status']) => {
        switch (status) {
            case 'Community Validated':
                return <Badge variant="emerald">Validated</Badge>;
            case 'Active Discussion':
                return <Badge variant="indigo">Active Discussion</Badge>;
            case 'Solution Rich':
                return <Badge variant="indigo">Solution Rich</Badge>;
            case 'High Interest':
                return <Badge variant="amber">High Interest</Badge>;
            case 'Validating':
                return <Badge variant="neutral">Validating</Badge>;
            default:
                return <Badge variant="neutral">{status}</Badge>;
        }
    };

    return (
        <article className={`group relative flex flex-col justify-between bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${
            featured ? 'ring-1 ring-indigo-500/20 bg-gradient-to-b from-indigo-50/20 via-white to-white' : ''
        }`}>
            <div>
                {/* Header: Category, Status & Trending Flag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link 
                            href={`/domains/${problem.domain.slug}`}
                            className="text-xs font-semibold uppercase tracking-wider text-indigo-600 hover:text-indigo-800"
                        >
                            {problem.domain.name}
                        </Link>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-medium">
                            {problem.category}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        {problem.isTrending && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 animate-pulse">
                                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                                Trending
                            </span>
                        )}
                        {getStatusBadge(problem.status)}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-2 mb-2">
                    <Link href={`/problems/${problem.slug}`} className="focus:outline-none">
                        {problem.title}
                        <span className="absolute inset-0" aria-hidden="true" />
                    </Link>
                </h3>

                {/* Summary */}
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {problem.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
                    {problem.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md"
                        >
                            #{tag}
                        </span>
                    ))}
                    {problem.tags.length > 3 && (
                        <span className="text-[11px] text-slate-400 self-center">
                            +{problem.tags.length - 3}
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom Metrics & Validation Section */}
            <div className="pt-4 border-t border-slate-100 mt-auto">
                {/* Community Validation Meter */}
                <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Validation
                        </span>
                        <span className="font-semibold text-slate-900">{validationPct}% agree</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                                validationPct >= 75 ? 'bg-emerald-500' : validationPct >= 50 ? 'bg-indigo-500' : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.max(validationPct, 4)}%` }}
                        />
                    </div>
                </div>

                {/* Activity Counters */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="flex items-center gap-1 hover:text-slate-800" title={`${problem.affectedCount} people experiencing this`}>
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{problem.affectedCount}</span>
                        </span>

                        <span className="flex items-center gap-1 hover:text-slate-800" title={`${problem.solutionsCount} proposed solutions`}>
                            <Lightbulb className="w-3.5 h-3.5 text-slate-400" />
                            <span>{problem.solutionsCount}</span>
                        </span>

                        <span className="flex items-center gap-1 hover:text-slate-800" title={`${problem.discussionsCount} comments & discussions`}>
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                            <span>{problem.discussionsCount}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>
        </article>
    );
}
