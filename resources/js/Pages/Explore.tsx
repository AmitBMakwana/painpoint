import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Search, 
    Filter, 
    SlidersHorizontal, 
    ArrowUpDown, 
    X, 
    Check, 
    RotateCcw,
    Layers,
    AlertCircle,
    Plus,
    Flame,
    CheckCircle2
} from 'lucide-react';
import { AppLayout } from '../Components/Layout/AppLayout';
import { ProblemCard } from '../Components/Problems/ProblemCard';
import { Button } from '../Components/UI/Button';
import { mockProblems, mockDomains } from '../data/mockData';
import { Problem } from '../types';

interface ExploreProps {
    initialQuery?: string;
    initialDomain?: string;
}

export default function Explore({ initialQuery = '', initialDomain = 'all' }: ExploreProps) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedDomain, setSelectedDomain] = useState(initialDomain);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [minPainLevel, setMinPainLevel] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('trending');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Filter and sort logic
    const filteredProblems = useMemo(() => {
        return mockProblems.filter((p) => {
            // Search query match
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = p.title.toLowerCase().includes(q);
                const matchSummary = p.summary.toLowerCase().includes(q);
                const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
                if (!matchTitle && !matchSummary && !matchTags) return false;
            }

            // Domain filter
            if (selectedDomain !== 'all' && p.domain.slug !== selectedDomain) {
                return false;
            }

            // Status filter
            if (selectedStatus !== 'all' && p.status !== selectedStatus) {
                return false;
            }

            // Pain level filter
            if (minPainLevel > 0 && (p.painLevel || 0) < minPainLevel) {
                return false;
            }

            return true;
        }).sort((a, b) => {
            if (sortBy === 'trending') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.affectedCount - a.affectedCount;
            if (sortBy === 'newest') return b.id - a.id;
            if (sortBy === 'most_solutions') return b.solutionsCount - a.solutionsCount;
            if (sortBy === 'most_discussed') return b.discussionsCount - a.discussionsCount;
            if (sortBy === 'most_validated') return (b.validation.percentage || 0) - (a.validation.percentage || 0);
            return b.affectedCount - a.affectedCount;
        });
    }, [searchQuery, selectedDomain, selectedStatus, minPainLevel, sortBy]);

    const activeFilterCount = (selectedDomain !== 'all' ? 1 : 0) + 
                              (selectedStatus !== 'all' ? 1 : 0) + 
                              (minPainLevel > 0 ? 1 : 0) +
                              (searchQuery ? 1 : 0);

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedDomain('all');
        setSelectedStatus('all');
        setMinPainLevel(0);
        setSortBy('trending');
    };

    return (
        <AppLayout>
            <Head title="Explore Problems — Discover Real Community Pain Points" />

            <div className="bg-white border-b border-slate-200/80 pt-10 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 mb-2 inline-block">
                                Discovery Engine
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Explore Problems
                            </h1>
                            <p className="text-sm sm:text-base text-slate-500 mt-1 max-w-2xl">
                                Discover real-world problems shared by professionals, operators, and everyday people around the world.
                            </p>
                        </div>

                        <Link href="/problems/create">
                            <Button variant="primary" size="md" className="shrink-0 shadow-xs">
                                <Plus className="w-4 h-4" />
                                <span>+ Submit a Problem</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Search and Sort Toolbar */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, keywords, tags (#teachers, #fintech)..."
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-sm outline-none transition-all text-slate-800"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {/* Sort Dropdown */}
                            <div className="relative flex-1 sm:w-48">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full appearance-none pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
                                >
                                    <option value="trending">🔥 Trending Velocity</option>
                                    <option value="newest">🕒 Newest First</option>
                                    <option value="most_validated">✅ Most Validated</option>
                                    <option value="most_solutions">💡 Most Solutions</option>
                                    <option value="most_discussed">💬 Most Discussed</option>
                                </select>
                                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                            </div>

                            {/* Mobile Filter Button */}
                            <button
                                onClick={() => setMobileFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Active Filter Chips */}
                    {activeFilterCount > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
                            <span className="text-slate-400 font-medium">Active filters:</span>
                            {selectedDomain !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                                    Domain: {mockDomains.find(d => d.slug === selectedDomain)?.name || selectedDomain}
                                    <button onClick={() => setSelectedDomain('all')} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {selectedStatus !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                                    Status: {selectedStatus}
                                    <button onClick={() => setSelectedStatus('all')} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {minPainLevel > 0 && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-medium border border-amber-100">
                                    Pain Level: {minPainLevel}+ / 5
                                    <button onClick={() => setMinPainLevel(0)} className="hover:text-amber-900"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            <button
                                onClick={handleResetFilters}
                                className="text-xs text-slate-500 hover:text-slate-800 underline font-medium ml-1 flex items-center gap-1"
                            >
                                <RotateCcw className="w-3 h-3" /> Reset all
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Explore Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    
                    {/* Desktop Left Filter Sidebar */}
                    <aside className="hidden lg:block space-y-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs sticky top-24">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-indigo-600" />
                                Filter Problems
                            </h3>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={handleResetFilters}
                                    className="text-xs text-slate-400 hover:text-slate-700 font-medium"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        {/* Domain Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                                Domain
                            </label>
                            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                                <button
                                    type="button"
                                    onClick={() => setSelectedDomain('all')}
                                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                        selectedDomain === 'all'
                                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <span>All Domains</span>
                                    {selectedDomain === 'all' && <Check className="w-3.5 h-3.5" />}
                                </button>
                                {mockDomains.map((d) => (
                                    <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => setSelectedDomain(d.slug)}
                                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                            selectedDomain === d.slug
                                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="truncate">{d.name}</span>
                                        <span className="text-[10px] text-slate-400">{d.problemsCount}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                                Status
                            </label>
                            <div className="space-y-1">
                                {['all', 'Community Validated', 'Active Discussion', 'High Interest', 'Validating', 'Solution Rich'].map((st) => (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => setSelectedStatus(st)}
                                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                            selectedStatus === st
                                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="capitalize">{st === 'all' ? 'All Statuses' : st}</span>
                                        {selectedStatus === st && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pain Level Minimum */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Min Pain Level
                                </label>
                                <span className="text-xs font-bold text-amber-600">
                                    {minPainLevel > 0 ? `${minPainLevel}+ / 5` : 'Any'}
                                </span>
                            </div>
                            <div className="grid grid-cols-5 gap-1 text-xs">
                                {[0, 2, 3, 4, 5].map((lvl) => (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => setMinPainLevel(lvl)}
                                        className={`py-1.5 rounded-lg font-bold transition-colors ${
                                            minPainLevel === lvl
                                                ? 'bg-indigo-600 text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {lvl === 0 ? 'Any' : lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Right Results Column */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>
                                Showing <strong className="text-slate-900 font-bold">{filteredProblems.length}</strong> problems
                            </span>
                            <span>Sorted by <strong className="text-slate-800">{sortBy.replace('_', ' ')}</strong></span>
                        </div>

                        {filteredProblems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredProblems.map((problem) => (
                                    <ProblemCard key={problem.id} problem={problem} />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-16 px-4 bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">
                                    No matching problems found
                                </h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                                    We couldn't find any problems matching your current search and filter criteria.
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResetFilters}
                                    >
                                        Reset Filters
                                    </Button>
                                    <Link href="/problems/create">
                                        <Button variant="primary" size="sm">
                                            + Submit This Problem
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilterOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in slide-in-from-bottom-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">Filters</h3>
                            <button
                                onClick={() => setMobileFilterOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Domain Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                Domain
                            </label>
                            <select
                                value={selectedDomain}
                                onChange={(e) => setSelectedDomain(e.target.value)}
                                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
                            >
                                <option value="all">All Domains</option>
                                {mockDomains.map((d) => (
                                    <option key={d.id} value={d.slug}>{d.name} ({d.problemsCount})</option>
                                ))}
                            </select>
                        </div>

                        {/* Mobile Status Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Community Validated">Community Validated</option>
                                <option value="Active Discussion">Active Discussion</option>
                                <option value="High Interest">High Interest</option>
                                <option value="Validating">Validating</option>
                                <option value="Solution Rich">Solution Rich</option>
                            </select>
                        </div>

                        {/* Apply & Reset Buttons */}
                        <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="md"
                                className="w-1/2"
                                onClick={() => {
                                    handleResetFilters();
                                    setMobileFilterOpen(false);
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                className="w-1/2"
                                onClick={() => setMobileFilterOpen(false)}
                            >
                                Show {filteredProblems.length} Results
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
