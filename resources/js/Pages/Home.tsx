import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import { 
    Sparkles, 
    ArrowRight, 
    TrendingUp, 
    Flame, 
    Compass, 
    Layers, 
    Lightbulb, 
    CheckCircle2, 
    Users, 
    ShieldCheck, 
    Plus,
    Filter,
    Award
} from 'lucide-react';
import { AppLayout } from '../Components/Layout/AppLayout';
import { ProblemCard } from '../Components/Problems/ProblemCard';
import { DomainCard } from '../Components/Domains/DomainCard';
import { TopSolutionCard } from '../Components/Solutions/TopSolutionCard';
import { Button } from '../Components/UI/Button';
import { mockProblems, mockDomains, mockSolutions, mockStats } from '../data/mockData';
import { Problem, Solution } from '../types';

interface HomeProps {
    problems?: Problem[];
    domains?: typeof mockDomains;
    solutions?: Solution[];
}

export default function Home({
    problems = mockProblems,
    domains = mockDomains,
    solutions = mockSolutions,
}: HomeProps) {
    const [trendingCategory, setTrendingCategory] = useState<string>('all');

    const trendingProblems = problems.filter((p) => p.isTrending);
    const attentionProblems = problems.slice(0, 3);
    const topThreeSolutions = solutions.filter((s) => s.rank && s.rank <= 3).slice(0, 3);

    return (
        <AppLayout>
            <Head title="Real Problems. Real People. Better Solutions." />

            {/* SECTION 1: HERO */}
            <section className="relative overflow-hidden bg-gradient-to-b from-white via-indigo-50/20 to-transparent pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/60">
                {/* Subtle background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-100/40 via-purple-50/30 to-blue-50/20 blur-3xl -z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        
                        {/* Eyebrow badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100 mb-6 shadow-xs animate-in fade-in duration-300">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Structured Problem Discovery & Validation</span>
                        </div>

                        {/* Main Positioning Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                            Real Problems.{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
                                Real People.
                            </span>{' '}
                            Better Solutions.
                        </h1>

                        {/* Supporting copy */}
                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
                            Discover real-world problems, share your personal experience, and help founders and builders validate solutions before writing a line of code.
                        </p>

                        {/* Primary & Secondary CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full sm:w-auto shadow-md shadow-indigo-600/20"
                                onClick={() => {
                                    window.location.href = '/problems/create';
                                }}
                            >
                                <Plus className="w-5 h-5 -ml-1" />
                                <span>+ Submit a Problem</span>
                            </Button>

                            <Link href="/explore" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    <Compass className="w-5 h-5 text-slate-500" />
                                    <span>Explore Problems</span>
                                </Button>
                            </Link>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-xs">
                            <div className="text-center p-2">
                                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                    {mockStats.problems}
                                </div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">
                                    Documented Problems
                                </div>
                            </div>

                            <div className="text-center p-2 border-l border-slate-100">
                                <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">
                                    {mockStats.solutions}
                                </div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">
                                    Community Solutions
                                </div>
                            </div>

                            <div className="text-center p-2 border-l-0 md:border-l border-slate-100">
                                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                    {mockStats.votes}
                                </div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">
                                    Validation Votes
                                </div>
                            </div>

                            <div className="text-center p-2 border-l border-slate-100">
                                <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                                    {mockStats.activeUsers}
                                </div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">
                                    Participating Users
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 2: TRENDING PROBLEMS */}
            <section className="py-16 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs tracking-wider uppercase mb-1">
                                <Flame className="w-4 h-4 fill-amber-500" />
                                <span>High Community Velocity</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Trending Problems
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Issues gaining the highest daily validation and discussion activity.
                            </p>
                        </div>

                        <Link
                            href="/trending"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:translate-x-0.5 transition-transform"
                        >
                            <span>View all trending</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Problems Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trendingProblems.map((problem) => (
                            <ProblemCard key={problem.id} problem={problem} />
                        ))}
                    </div>

                </div>
            </section>

            {/* SECTION 3: EXPLORE BY DOMAIN */}
            <section className="py-16 bg-white border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
                                <Layers className="w-4 h-4" />
                                <span>Categorized Discoveries</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Explore by Domain
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Target problem spaces across business verticals, education, technology, and beyond.
                            </p>
                        </div>

                        <Link
                            href="/domains"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:translate-x-0.5 transition-transform"
                        >
                            <span>All 16 domains</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Domains Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {domains.map((domain) => (
                            <DomainCard key={domain.id} domain={domain} />
                        ))}
                    </div>

                </div>
            </section>

            {/* SECTION 4: PROBLEMS GETTING ATTENTION & RECENT SUBMISSIONS */}
            <section className="py-16 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
                                <Users className="w-4 h-4" />
                                <span>Recent Community Activity</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Problems Getting Attention
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Newly submitted and actively discussed by verified practitioners.
                            </p>
                        </div>

                        <Link
                            href="/explore?sort=newest"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:translate-x-0.5 transition-transform"
                        >
                            <span>Browse all problems</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {attentionProblems.map((problem) => (
                            <ProblemCard key={problem.id} problem={problem} featured={problem.id === 1} />
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 6: TOP COMMUNITY SOLUTIONS */}
            <section className="py-16 bg-white border-t border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mb-8">
                        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
                            <Award className="w-4 h-4" />
                            <span>Validated Innovation</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            🏆 Top Community Solutions
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Ranked deterministically through community votes, verified practitioner validation, and AI problem-fit signals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topThreeSolutions.map((solution, idx) => (
                            <TopSolutionCard
                                key={solution.id}
                                solution={solution}
                                rank={(idx + 1) as 1 | 2 | 3}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 7: HOW IT WORKS */}
            <section id="how-it-works" className="py-20 bg-slate-50/70 border-t border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                            The Methodology
                        </span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                            How PainPoint Works
                        </h2>
                        <p className="text-slate-600 text-sm mt-2">
                            A transparent 4-stage validation funnel transforming raw human friction into proven software and service opportunities.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-base mb-4">
                                01
                            </div>
                            <h3 className="font-bold text-slate-900 text-base mb-2">
                                Discover Friction
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Anyone can submit real-world bottlenecks, broken workflows, or unmet needs they face in work or life.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-base mb-4">
                                02
                            </div>
                            <h3 className="font-bold text-slate-900 text-base mb-2">
                                Confirm Pain
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                People vote "I Have This Problem", documenting their frequency and pain severity from 1 to 5.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-base mb-4">
                                03
                            </div>
                            <h3 className="font-bold text-slate-900 text-base mb-2">
                                Propose Solutions
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Builders, founders, and community solvers pitch SaaS ideas, scripts, workflows, or services.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-base mb-4">
                                04
                            </div>
                            <h3 className="font-bold text-slate-900 text-base mb-2">
                                Pin Top 3 Picks
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Our deterministic algorithm scores votes, discussion depth, and AI-fit to crown the Top 3 solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 8: HAVE A PROBLEM? CTA BLOCK */}
            <section className="py-16 bg-white border-t border-slate-200/80">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl">
                        
                        {/* Subtle background ornamentation */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-4 border border-white/10">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Got a frustrating problem?</span>
                            </span>

                            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
                                Tell the world what needs fixing.
                            </h2>

                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                                Whether you're an educator overwhelmed by paperwork, a small business owner battling messy inboxes, or a developer stuck in config hell — your problem matters.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full sm:w-auto bg-white text-indigo-950 hover:bg-slate-100 shadow-none font-bold"
                                    onClick={() => {
                                        window.location.href = '/problems/create';
                                    }}
                                >
                                    + Submit Your Problem Now
                                </Button>
                                <Link href="/explore" className="w-full sm:w-auto">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full sm:w-auto bg-transparent border-white/20 text-white hover:bg-white/10"
                                    >
                                        Explore Existing Problems
                                    </Button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </AppLayout>
    );
}
