import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Flame, 
    Users, 
    Lightbulb, 
    MessageSquare, 
    Eye, 
    Bookmark, 
    Share2, 
    Bell, 
    CheckCircle2, 
    Sparkles, 
    ThumbsUp, 
    Plus, 
    Award, 
    AlertCircle,
    ArrowUpRight,
    CornerDownRight,
    Send,
    HelpCircle,
    Copy,
    Check
} from 'lucide-react';
import { AppLayout, useAuthModal } from '../../Components/Layout/AppLayout';
import { ValidationCard } from '../../Components/Validation/ValidationCard';
import { TopSolutionCard } from '../../Components/Solutions/TopSolutionCard';
import { SolutionCard } from '../../Components/Solutions/SolutionCard';
import { ProblemCard } from '../../Components/Problems/ProblemCard';
import { Button } from '../../Components/UI/Button';
import { Badge } from '../../Components/UI/Badge';
import { mockProblems, mockSolutions, mockComments } from '../../data/mockData';
import { Problem, Solution, Comment } from '../../types';

interface ProblemShowProps {
    slug?: string;
}

export default function ProblemShow({ slug = 'how-can-schools-reduce-the-amount-of-manual-work-teachers-do-every-day' }: ProblemShowProps) {
    const { openAuth } = useAuthModal();

    // Find problem by slug or default to first
    const problem: Problem = mockProblems.find((p) => p.slug === slug) || mockProblems[0];

    // Local state for solutions and comments
    const [solutions, setSolutions] = useState<Solution[]>(
        mockSolutions.filter((s) => s.problemId === problem.id)
    );
    const [comments, setComments] = useState<Comment[]>(mockComments);
    const [newCommentText, setNewCommentText] = useState('');
    const [replyingToId, setReplyingToId] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);
    const [solutionTypeFilter, setSolutionTypeFilter] = useState<string>('all');
    const [showSolutionModal, setShowSolutionModal] = useState(false);

    // New solution form state
    const [solutionTitle, setSolutionTitle] = useState('');
    const [solutionSummary, setSolutionSummary] = useState('');
    const [solutionType, setSolutionType] = useState<Solution['solutionType']>('SaaS');
    const [solutionDifficulty, setSolutionDifficulty] = useState<Solution['implementationDifficulty']>('Moderate');
    const [solutionCost, setSolutionCost] = useState('');

    const topThreeSolutions = solutions.filter(s => s.rank && s.rank <= 3);

    const filteredSolutions = solutions.filter(s => {
        if (solutionTypeFilter !== 'all' && s.solutionType !== solutionTypeFilter) return false;
        return true;
    });

    const handleSolutionVote = (id: number) => {
        setSolutions(prev => prev.map(s => {
            if (s.id === id) {
                const nextVoted = !s.hasVoted;
                return {
                    ...s,
                    hasVoted: nextVoted,
                    votesCount: nextVoted ? s.votesCount + 1 : s.votesCount - 1,
                };
            }
            return s;
        }));
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        const newComment: Comment = {
            id: Date.now(),
            problemId: problem.id,
            author: {
                id: 999,
                name: 'Alex Mercer',
                role: 'Community Member',
                reputation: 420,
            },
            content: newCommentText.trim(),
            createdAt: 'Just now',
            helpfulVotes: 0,
            hasVotedHelpful: false,
            replies: [],
        };

        setComments([newComment, ...comments]);
        setNewCommentText('');
    };

    const handleReplySubmit = (parentId: number) => {
        if (!replyText.trim()) return;

        const newReply: Comment = {
            id: Date.now(),
            problemId: problem.id,
            author: {
                id: 999,
                name: 'Alex Mercer',
                role: 'Community Member',
                reputation: 420,
            },
            content: replyText.trim(),
            createdAt: 'Just now',
            helpfulVotes: 0,
            parentId: parentId,
        };

        setComments(prev => prev.map(c => {
            if (c.id === parentId) {
                return {
                    ...c,
                    replies: [...(c.replies || []), newReply],
                };
            }
            return c;
        }));

        setReplyingToId(null);
        setReplyText('');
    };

    const handleHelpfulVote = (commentId: number) => {
        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                const nextVal = !c.hasVotedHelpful;
                return {
                    ...c,
                    hasVotedHelpful: nextVal,
                    helpfulVotes: nextVal ? c.helpfulVotes + 1 : c.helpfulVotes - 1,
                };
            }
            return c;
        }));
    };

    const handleCreateSolution = (e: React.FormEvent) => {
        e.preventDefault();
        if (!solutionTitle.trim() || !solutionSummary.trim()) return;

        const newSol: Solution = {
            id: Date.now(),
            problemId: problem.id,
            slug: solutionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: solutionTitle.trim(),
            summary: solutionSummary.trim(),
            solutionType: solutionType,
            implementationDifficulty: solutionDifficulty,
            estimatedCost: solutionCost || 'Free / Open Source',
            author: {
                id: 999,
                name: 'Alex Mercer',
                role: 'Community Solver',
                reputation: 420,
            },
            tags: ['community-proposed', solutionType.toLowerCase()],
            votesCount: 1,
            hasVoted: true,
            helpfulVotesCount: 0,
            commentsCount: 0,
            createdAt: 'Just now',
            aiFitScore: 88,
            aiFitAnalysis: 'Newly proposed community solution aligned with problem statement.',
        };

        setSolutions([newSol, ...solutions]);
        setShowSolutionModal(false);
        setSolutionTitle('');
        setSolutionSummary('');
        setSolutionCost('');
    };

    const handleCopyShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
    };

    const relatedProblems = mockProblems.filter(p => p.id !== problem.id).slice(0, 3);

    return (
        <AppLayout>
            <Head title={`${problem.title} — PainPoint Problem Discovery`} />

            {/* Top Breadcrumb & Actions Bar */}
            <div className="bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Link href="/explore" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                                <span>Back to Explore</span>
                            </Link>
                            <span>/</span>
                            <Link href={`/domains/${problem.domain.slug}`} className="hover:text-indigo-600 transition-colors">
                                {problem.domain.name}
                            </Link>
                            <span>/</span>
                            <span className="text-slate-800 font-semibold truncate max-w-[240px]">
                                {problem.category}
                            </span>
                        </div>

                        {/* Action Buttons: Follow, Save, Share */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                                onClick={() => setIsFollowing(!isFollowing)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                    isFollowing 
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                            >
                                <Bell className={`w-3.5 h-3.5 ${isFollowing ? 'fill-current' : ''}`} />
                                <span>{isFollowing ? 'Following' : 'Follow'}</span>
                            </button>

                            <button
                                onClick={() => setIsSaved(!isSaved)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                    isSaved 
                                        ? 'bg-amber-50 border-amber-200 text-amber-700' 
                                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                            >
                                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                                <span>{isSaved ? 'Saved' : 'Save'}</span>
                            </button>

                            <button
                                onClick={handleCopyShare}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-700 transition-all shadow-xs"
                            >
                                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                                <span>{copiedShare ? 'Copied Link' : 'Share'}</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Problem Main Hero Header */}
            <div className="bg-white border-b border-slate-200/80 pt-8 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl">
                        
                        {/* Category & Status badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                                {problem.domain.name}
                            </span>
                            <Badge variant="neutral">{problem.category}</Badge>
                            {problem.isTrending && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80">
                                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                    Trending Problem
                                </span>
                            )}
                            <Badge variant="emerald">{problem.status}</Badge>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
                            {problem.title}
                        </h1>

                        {/* Summary */}
                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                            {problem.summary}
                        </p>

                        {/* Author & Publication Details */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-6 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 overflow-hidden">
                                    {problem.author.avatar ? (
                                        <img src={problem.author.avatar} alt={problem.author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        problem.author.name[0]
                                    )}
                                </div>
                                <span className="font-semibold text-slate-800">{problem.author.name}</span>
                                {problem.author.role && (
                                    <span className="text-slate-400">({problem.author.role})</span>
                                )}
                            </div>

                            <span>•</span>
                            <span>★ {problem.author.reputation} reputation</span>
                            <span>•</span>
                            <span>Submitted {problem.createdAt}</span>
                        </div>

                        {/* Metrics Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-900 leading-tight">
                                        {problem.affectedCount.toLocaleString()}
                                    </div>
                                    <div className="text-[11px] text-slate-500">People Affected</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-900 leading-tight">
                                        {problem.solutionsCount}
                                    </div>
                                    <div className="text-[11px] text-slate-500">Proposed Solutions</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-900 leading-tight">
                                        {problem.discussionsCount}
                                    </div>
                                    <div className="text-[11px] text-slate-500">Discussions</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                    <Eye className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-900 leading-tight">
                                        {problem.viewsCount.toLocaleString()}
                                    </div>
                                    <div className="text-[11px] text-slate-500">Views</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Problem Body Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    
                    {/* Left 2 Columns: Details, Top 3, Solutions, Conversation */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* 1. Deep Problem Description & Context */}
                        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                Problem Details & Root Causes
                            </h2>

                            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                                {problem.description || problem.summary}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="font-bold text-slate-900 block mb-1">Target Audience</span>
                                    <span className="text-slate-600">{problem.targetAudience || 'Educators, administrators, and department heads'}</span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="font-bold text-slate-900 block mb-1">Observed Frequency</span>
                                    <span className="text-slate-600">{problem.frequency || 'Daily recurring bottleneck'}</span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="font-bold text-slate-900 block mb-1">Current Alternatives & Workarounds</span>
                                    <span className="text-slate-600">{problem.currentAlternatives || 'Manual spreadsheets and paper forms'}</span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="font-bold text-slate-900 block mb-1">Why It Matters</span>
                                    <span className="text-slate-600">{problem.whyItMatters || 'Chronic burnout and turnover in mission-critical roles'}</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {problem.tags.map(tag => (
                                    <span key={tag} className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* 2. 🏆 TOP 3 SOLUTIONS (The Core Feature!) */}
                        <section className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
                                        <Award className="w-4 h-4 text-amber-500" />
                                        <span>Pinned Validation</span>
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                        🏆 Top 3 Community Solutions
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Identified deterministically via community votes, helpful ratings, and verified practitioner feedback.
                                    </p>
                                </div>

                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setShowSolutionModal(true)}
                                    className="shrink-0"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>+ Share a Solution</span>
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {topThreeSolutions.map((solution, idx) => (
                                    <TopSolutionCard
                                        key={solution.id}
                                        solution={solution}
                                        rank={(idx + 1) as 1 | 2 | 3}
                                        onVote={handleSolutionVote}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* 3. ALL COMMUNITY SOLUTIONS */}
                        <section className="space-y-6 pt-6 border-t border-slate-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                        All Community Solutions ({solutions.length})
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Browse all innovative proposals submitted by builders and domain solvers.
                                    </p>
                                </div>

                                {/* Solution Type Filters */}
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                                    {['all', 'SaaS', 'Mobile App', 'AI', 'Process'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setSolutionTypeFilter(type)}
                                            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                                                solutionTypeFilter === type
                                                    ? 'bg-indigo-600 text-white font-semibold'
                                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {type === 'all' ? 'All Types' : type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {filteredSolutions.map(solution => (
                                    <SolutionCard
                                        key={solution.id}
                                        solution={solution}
                                        onVote={handleSolutionVote}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* 4. COMMUNITY CONVERSATION */}
                        <section className="space-y-6 pt-6 border-t border-slate-200">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                    Community Conversation ({comments.length})
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Join the discussion, share personal anecdotes, and refine the problem definition.
                                </p>
                            </div>

                            {/* Comment Composer */}
                            <form onSubmit={handleCommentSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                                <textarea
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    placeholder="Share your experience or ask a clarifying question..."
                                    rows={3}
                                    className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none outline-none resize-none focus:ring-0 p-1"
                                />
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-[11px] text-slate-400">
                                        Formatting supported • Be respectful and constructive
                                    </span>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="sm"
                                        disabled={!newCommentText.trim()}
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Post Comment</span>
                                    </Button>
                                </div>
                            </form>

                            {/* Comments List with Nested Replies */}
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                                                    {comment.author.name[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-900">{comment.author.name}</span>
                                                        {comment.author.role && (
                                                            <span className="text-[10px] text-slate-400">({comment.author.role})</span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleHelpfulVote(comment.id)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                                    comment.hasVotedHelpful 
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                <ThumbsUp className="w-3 h-3" />
                                                <span>Helpful ({comment.helpfulVotes})</span>
                                            </button>
                                        </div>

                                        <p className="text-sm text-slate-700 leading-relaxed pl-9">
                                            {comment.content}
                                        </p>

                                        {/* Reply Trigger */}
                                        <div className="pl-9 pt-1 flex items-center gap-4 text-xs">
                                            <button
                                                onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                                                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                                            >
                                                <CornerDownRight className="w-3.5 h-3.5" />
                                                Reply
                                            </button>
                                        </div>

                                        {/* Reply Composer */}
                                        {replyingToId === comment.id && (
                                            <div className="ml-9 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Write your reply..."
                                                    rows={2}
                                                    className="w-full text-xs text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setReplyingToId(null)}
                                                        className="text-xs"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleReplySubmit(comment.id)}
                                                        className="text-xs"
                                                    >
                                                        Reply
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Nested Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="ml-9 pt-3 space-y-3 border-t border-slate-100">
                                                {comment.replies.map(reply => (
                                                    <div key={reply.id} className="bg-slate-50/60 rounded-xl p-3 border border-slate-100 space-y-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-900">{reply.author.name}</span>
                                                            <span className="text-[10px] text-slate-400">• {reply.createdAt}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-700 leading-relaxed">
                                                            {reply.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Right 1 Column: Interactive Validation Card, AI Signal & Related */}
                    <div className="space-y-6 lg:sticky lg:top-24">
                        
                        {/* 1. Validation Card */}
                        <ValidationCard
                            problemId={problem.id}
                            initialValidation={problem.validation}
                        />

                        {/* 2. AI-Assisted Problem Analysis Box */}
                        {problem.aiAnalysis && (
                            <div className="bg-gradient-to-b from-indigo-50/60 to-white border border-indigo-100 rounded-2xl p-5 shadow-xs space-y-3">
                                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs tracking-wider uppercase">
                                    <Sparkles className="w-4 h-4" />
                                    <span>AI Analysis Signal</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {problem.aiAnalysis.summary}
                                </p>
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-100/60 text-[11px]">
                                    <div>
                                        <span className="text-slate-400 block">Fit Confidence</span>
                                        <span className="font-bold text-indigo-700">{problem.aiAnalysis.problemFitScore}%</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block">Impact Potential</span>
                                        <span className="font-bold text-emerald-700">{problem.aiAnalysis.potentialImpact}</span>
                                    </div>
                                </div>
                                <span className="block text-[10px] text-slate-400 italic">
                                    * Supporting AI classification signal. Does not replace community validation.
                                </span>
                            </div>
                        )}

                        {/* 3. Related Problems in this Domain */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                                <span>Related in {problem.domain.name}</span>
                                <Link href={`/domains/${problem.domain.slug}`} className="text-xs text-indigo-600 hover:underline">
                                    View all
                                </Link>
                            </h4>

                            <div className="space-y-3">
                                {relatedProblems.map(rel => (
                                    <Link
                                        key={rel.id}
                                        href={`/problems/${rel.slug}`}
                                        className="block group p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                                    >
                                        <h5 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
                                            {rel.title}
                                        </h5>
                                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                            <span>👥 {rel.affectedCount} affected</span>
                                            <span>💡 {rel.solutionsCount} solutions</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Modal: Share a Solution */}
            {showSolutionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                            Share a Community Solution
                        </h3>
                        <p className="text-xs text-slate-500 mb-6">
                            Propose a software product, script, manual process, or service that solves this problem.
                        </p>

                        <form onSubmit={handleCreateSolution} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Solution Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={solutionTitle}
                                    onChange={(e) => setSolutionTitle(e.target.value)}
                                    placeholder="e.g., Automated AI Rubric Sync for Google Classroom"
                                    className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Solution Type
                                    </label>
                                    <select
                                        value={solutionType}
                                        onChange={(e) => setSolutionType(e.target.value as any)}
                                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                    >
                                        <option value="SaaS">SaaS</option>
                                        <option value="Mobile App">Mobile App</option>
                                        <option value="AI">AI Tool</option>
                                        <option value="Process">Process / Framework</option>
                                        <option value="Service">Agency / Service</option>
                                        <option value="Hardware">Hardware</option>
                                        <option value="Marketplace">Marketplace</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Difficulty
                                    </label>
                                    <select
                                        value={solutionDifficulty}
                                        onChange={(e) => setSolutionDifficulty(e.target.value as any)}
                                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Challenging">Challenging</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Explain Your Solution & How It Solves The Root Cause
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={solutionSummary}
                                    onChange={(e) => setSolutionSummary(e.target.value)}
                                    placeholder="Describe the workflow, target user, and why this works better than current alternatives..."
                                    className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Estimated Cost to End User (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={solutionCost}
                                    onChange={(e) => setSolutionCost(e.target.value)}
                                    placeholder="e.g. $10/mo, Free / Open Source"
                                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="md"
                                    onClick={() => setShowSolutionModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                >
                                    Publish Solution
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
