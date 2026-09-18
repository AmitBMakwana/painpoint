import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '../../../Layouts/AdminLayout';
import { 
    Search, 
    Check, 
    X, 
    Pin, 
    Trash2, 
    Eye, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    Mic, 
    ExternalLink, 
    LayoutGrid,
    List,
    ThumbsUp,
    Lightbulb,
    Flame,
    Clock,
    AlertTriangle,
    Shield,
    Sparkles
} from 'lucide-react';
import { Button } from '../../../Components/UI/Button';

interface Problem {
    id: number;
    public_id: string;
    slug: string;
    title: string;
    description: string;
    voice_transcript?: string;
    category_slug: string;
    category_name: string;
    urgency: string;
    scale: string;
    frequency: string;
    country?: string;
    state?: string;
    city?: string;
    locality?: string;
    postal_code?: string;
    status: string;
    submission_type: string;
    support_count: number;
    contribution_count: number;
    is_pinned: boolean;
    pin_order?: number;
    is_featured: boolean;
    rejection_reason?: string;
    admin_notes?: string;
    created_at: string;
    contact?: {
        name?: string;
        mobile?: string;
        email?: string;
        address?: string;
        city?: string;
        postal_code?: string;
        additional_info?: string;
    };
    media?: any[];
    links?: any[];
}

interface ProblemsIndexProps {
    problems: {
        data: Problem[];
        current_page: number;
        last_page: number;
        total: number;
        links: any[];
    };
    filters: {
        status: string;
        search: string;
        category: string;
    };
    counts: {
        all: number;
        pending: number;
        approved: number;
        rejected: number;
        pinned: number;
    };
}

export default function AdminProblemsIndex({
    problems,
    filters,
    counts,
}: ProblemsIndexProps) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
    const [activeModalTab, setActiveModalTab] = useState<'overview' | 'contact' | 'voice'>('overview');

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
        router.get('/admin/problems', {
            status,
            search: searchQuery,
        }, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/problems', {
            status: statusFilter,
            search: searchQuery,
        }, { preserveState: true });
    };

    const handleApprove = (id: number) => {
        router.post(`/admin/problems/${id}/approve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedProblem?.id === id) {
                    setSelectedProblem((prev) => prev ? { ...prev, status: 'Approved' } : null);
                }
            },
        });
    };

    const handleReject = (id: number) => {
        const reason = prompt('Please enter rejection reason:');
        if (reason) {
            router.post(`/admin/problems/${id}/reject`, { reason }, {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedProblem?.id === id) {
                        setSelectedProblem((prev) => prev ? { ...prev, status: 'Rejected', rejection_reason: reason } : null);
                    }
                },
            });
        }
    };

    const handlePin = (id: number, order: number, isCurrentlyPinned: boolean) => {
        router.post(`/admin/problems/${id}/pin`, {
            is_pinned: !isCurrentlyPinned,
            pin_order: order,
        }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number, publicId: string) => {
        if (confirm(`Are you sure you want to delete problem ${publicId} permanently?`)) {
            router.delete(`/admin/problems/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedProblem?.id === id) setSelectedProblem(null);
                },
            });
        }
    };

    const tabs = [
        { id: 'all', label: 'All Problems', count: counts.all },
        { id: 'pending', label: 'Pending Review', count: counts.pending, highlight: true },
        { id: 'approved', label: 'Approved', count: counts.approved },
        { id: 'pinned', label: 'Pinned Top 3', count: counts.pinned },
        { id: 'rejected', label: 'Rejected', count: counts.rejected },
    ];

    return (
        <AdminLayout
            title="Problem Curation & Moderation"
            subtitle="Focus directly on real reported challenges. Review, verify submitters, and pin top community problems."
        >
            <Head title="Problem Moderation — PainPoint Admin" />

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div 
                    onClick={() => handleFilterChange('all')}
                    className="cursor-pointer bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:border-indigo-300 transition-all"
                >
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Submissions</div>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">{counts.all}</div>
                </div>

                <div 
                    onClick={() => handleFilterChange('pending')}
                    className="cursor-pointer bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 shadow-2xs hover:border-amber-400 transition-all"
                >
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Needs Review
                    </div>
                    <div className="text-2xl font-black text-amber-900 mt-0.5">{counts.pending}</div>
                </div>

                <div 
                    onClick={() => handleFilterChange('approved')}
                    className="cursor-pointer bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 shadow-2xs hover:border-emerald-400 transition-all"
                >
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Live on Site</div>
                    <div className="text-2xl font-black text-emerald-900 mt-0.5">{counts.approved}</div>
                </div>

                <div 
                    onClick={() => handleFilterChange('pinned')}
                    className="cursor-pointer bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-4 shadow-2xs hover:border-indigo-400 transition-all"
                >
                    <div className="text-[10px] font-black uppercase tracking-wider text-indigo-800 flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Pinned Top 3
                    </div>
                    <div className="text-2xl font-black text-indigo-900 mt-0.5">{counts.pinned}</div>
                </div>
            </div>

            {/* Filter Tabs, View Switcher & Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                
                {/* Status Tabs */}
                <div className="flex flex-wrap gap-1 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleFilterChange(tab.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                statusFilter === tab.id
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                statusFilter === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search & Layout Toggle Controls */}
                <div className="flex items-center gap-2.5">
                    {/* View Toggle */}
                    <div className="flex items-center p-1 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
                        <button
                            type="button"
                            onClick={() => setViewMode('cards')}
                            className={`p-1.5 rounded-xl text-xs font-bold transition-colors ${
                                viewMode === 'cards' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:text-slate-700'
                            }`}
                            title="Visual Card Grid"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-xl text-xs font-bold transition-colors ${
                                viewMode === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:text-slate-700'
                            }`}
                            title="Compact Data Table"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative flex-1 sm:w-72">
                        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search real problems, ID, city..."
                            className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-900 outline-none focus:border-indigo-500 shadow-2xs placeholder-slate-400"
                        />
                    </form>
                </div>
            </div>

            {/* ================================================================= */}
            {/* VIEW MODE 1: VISUAL PROBLEM CARDS (Focus on real problem) */}
            {/* ================================================================= */}
            {viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {problems.data.length > 0 ? (
                        problems.data.map((p) => {
                            const isPending = p.status?.toLowerCase() === 'pending';
                            const isApproved = p.status?.toLowerCase() === 'approved';
                            const isRejected = p.status?.toLowerCase() === 'rejected';

                            return (
                                <div
                                    key={p.id}
                                    className={`bg-white border rounded-3xl p-5 sm:p-6 shadow-xs transition-all flex flex-col justify-between gap-4 group ${
                                        p.is_pinned
                                            ? 'border-amber-300 ring-1 ring-amber-200'
                                            : isPending
                                            ? 'border-amber-200 bg-amber-50/20'
                                            : 'border-slate-200/80 hover:border-indigo-300'
                                    }`}
                                >
                                    {/* Card Header: Category, Submitter & Status */}
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="font-mono text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                                                    {p.public_id}
                                                </span>
                                                <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                                                    {p.category_name}
                                                </span>
                                                {p.urgency && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                                        p.urgency.toLowerCase() === 'high' || p.urgency.toLowerCase() === 'critical'
                                                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        <Flame className="w-3 h-3" /> {p.urgency}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex items-center gap-1.5">
                                                {p.is_pinned && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black">
                                                        <Pin className="w-3 h-3 fill-amber-600" />
                                                        Top #{p.pin_order || 1}
                                                    </span>
                                                )}
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    isApproved
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : isRejected
                                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Core Problem Statement (Clear, high readability, punchy) */}
                                        <div>
                                            <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                                                {p.title}
                                            </h3>
                                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mt-1.5">
                                                {p.description}
                                            </p>
                                        </div>

                                        {/* Submitter & Geo Metadata */}
                                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                                            <div className="flex items-center gap-2">
                                                {p.submission_type === 'identified' ? (
                                                    <span className="inline-flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                                                        <User className="w-3.5 h-3.5 text-indigo-500" />
                                                        {p.contact?.name || 'Identified Submitter'}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-[11px] font-medium">
                                                        🕶️ Anonymous Submitter
                                                    </span>
                                                )}

                                                {p.city && (
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                        <MapPin className="w-3 h-3 text-slate-400" /> {p.city}, {p.country}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Engagement Counts */}
                                            <div className="flex items-center gap-3 text-[11px] font-bold">
                                                <span className="text-rose-600 flex items-center gap-1">
                                                    <ThumbsUp className="w-3 h-3" /> {p.support_count}
                                                </span>
                                                <span className="text-indigo-600 flex items-center gap-1">
                                                    <Lightbulb className="w-3 h-3" /> {p.contribution_count}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons Toolbar */}
                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedProblem(p);
                                                setActiveModalTab('overview');
                                            }}
                                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5 text-slate-500" /> Details
                                        </button>

                                        <div className="flex items-center gap-1.5">
                                            {isPending && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleApprove(p.id)}
                                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                                                >
                                                    <Check className="w-3.5 h-3.5" /> Approve
                                                </button>
                                            )}

                                            {!isRejected && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleReject(p.id)}
                                                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 text-xs font-bold transition-colors"
                                                    title="Reject Problem"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handlePin(p.id, p.is_pinned ? 0 : 1, p.is_pinned)}
                                                className={`p-1.5 rounded-xl border transition-colors ${
                                                    p.is_pinned 
                                                        ? 'bg-amber-100 text-amber-800 border-amber-300' 
                                                        : 'bg-white hover:bg-amber-50 text-slate-400 hover:text-amber-800 border-slate-200'
                                                }`}
                                                title={p.is_pinned ? 'Remove from Top 3' : 'Pin to Top 3'}
                                            >
                                                <Pin className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(p.id, p.public_id)}
                                                className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-300 hover:text-rose-600 border border-slate-200 transition-colors"
                                                title="Delete Permanently"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
                            No problems found for this filter criteria.
                        </div>
                    )}
                </div>
            )}

            {/* ================================================================= */}
            {/* VIEW MODE 2: COMPACT DATA TABLE (High density) */}
            {/* ================================================================= */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                    <th className="py-3 px-4">Ref ID</th>
                                    <th className="py-3 px-4">Problem Statement</th>
                                    <th className="py-3 px-4">Sector</th>
                                    <th className="py-3 px-4">Submitter</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Spotlight</th>
                                    <th className="py-3 px-4 text-right">Quick Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {problems.data.length > 0 ? (
                                    problems.data.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                                                {p.public_id}
                                            </td>
                                            <td className="py-3.5 px-4 max-w-sm">
                                                <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                                                <div className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">{p.description}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                                    {p.category_name}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {p.submission_type === 'identified' ? (
                                                    <span className="font-bold text-slate-800 text-[11px]">
                                                        {p.contact?.name || 'Identified'}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-[10px]">🕶️ Anonymous</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                    p.status.toLowerCase() === 'approved'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : p.status.toLowerCase() === 'rejected'
                                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {p.is_pinned ? (
                                                    <span className="text-amber-700 font-black text-[11px] flex items-center gap-1">
                                                        <Pin className="w-3 h-3 fill-amber-500" /> Top #{p.pin_order || 1}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300">—</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedProblem(p)}
                                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                                                        title="Inspect full details"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApprove(p.id)}
                                                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReject(p.id)}
                                                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white"
                                                        title="Reject"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePin(p.id, p.is_pinned ? 0 : 1, p.is_pinned)}
                                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-800"
                                                        title="Pin/Unpin"
                                                    >
                                                        <Pin className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                                            No problems found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            {problems.links && problems.links.length > 3 && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                    <div className="text-xs text-slate-500">
                        Showing page {problems.current_page} of {problems.last_page} ({problems.total} records)
                    </div>
                    <div className="flex items-center gap-1">
                        {problems.links.map((link, idx) => (
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

            {/* ================================================================= */}
            {/* STRUCTURED PROBLEM INSPECTION DOSSIER (TABBED & USER-FRIENDLY) */}
            {/* ================================================================= */}
            {selectedProblem && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 text-slate-900">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-indigo-600 text-xs font-black">
                                        {selectedProblem.public_id}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-slate-700">
                                        {selectedProblem.category_name}
                                    </span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">
                                    {selectedProblem.title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedProblem(null)}
                                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Sub-tabs */}
                        <div className="flex border-b border-slate-100 px-6 gap-6 text-xs font-bold text-slate-500 bg-white">
                            <button
                                type="button"
                                onClick={() => setActiveModalTab('overview')}
                                className={`py-3 border-b-2 transition-colors ${
                                    activeModalTab === 'overview'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent hover:text-slate-900'
                                }`}
                            >
                                Problem Statement
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveModalTab('contact')}
                                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                                    activeModalTab === 'contact'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent hover:text-slate-900'
                                }`}
                            >
                                <Shield className="w-3.5 h-3.5" />
                                Submitter Identity {selectedProblem.submission_type === 'identified' && '✓'}
                            </button>

                            {selectedProblem.voice_transcript && (
                                <button
                                    type="button"
                                    onClick={() => setActiveModalTab('voice')}
                                    className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                                        activeModalTab === 'voice'
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent hover:text-slate-900'
                                    }`}
                                >
                                    <Mic className="w-3.5 h-3.5" /> Audio Transcript
                                </button>
                            )}
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            
                            {/* TAB 1: OVERVIEW */}
                            {activeModalTab === 'overview' && (
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                            Description & Impact
                                        </span>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                                            {selectedProblem.description}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 text-xs">
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Urgency</span>
                                            <span className="font-extrabold text-slate-900">{selectedProblem.urgency || 'Normal'}</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Scale</span>
                                            <span className="font-extrabold text-slate-900">{selectedProblem.scale || 'Local'}</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Frequency</span>
                                            <span className="font-extrabold text-slate-900">{selectedProblem.frequency || 'Occasional'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: SUBMITTER CONTACT */}
                            {activeModalTab === 'contact' && (
                                <div>
                                    {selectedProblem.submission_type === 'identified' && selectedProblem.contact ? (
                                        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Full Name</span>
                                                <span className="font-extrabold text-slate-900">{selectedProblem.contact.name || 'Not provided'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Mobile Phone</span>
                                                <span className="font-mono font-bold text-emerald-700">{selectedProblem.contact.mobile || 'Not provided'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Address</span>
                                                <span className="font-mono font-bold text-indigo-700">{selectedProblem.contact.email || 'Not provided'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase block">City & PIN</span>
                                                <span className="font-semibold text-slate-800">{selectedProblem.contact.city || selectedProblem.city || '—'} {selectedProblem.contact.postal_code || ''}</span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Physical Address</span>
                                                <span className="text-slate-700">{selectedProblem.contact.address || 'Not provided'}</span>
                                            </div>
                                            {selectedProblem.contact.additional_info && (
                                                <div className="col-span-2">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Organization / Role Notes</span>
                                                    <span className="text-slate-700">{selectedProblem.contact.additional_info}</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                                            Submitter explicitly chose <strong>Anonymous Mode</strong>. No personal identity data was stored.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: VOICE TRANSCRIPT */}
                            {activeModalTab === 'voice' && selectedProblem.voice_transcript && (
                                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 text-xs text-indigo-950 italic leading-relaxed">
                                    "{selectedProblem.voice_transcript}"
                                </div>
                            )}
                        </div>

                        {/* Modal Footer Controls */}
                        <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleApprove(selectedProblem.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                >
                                    <Check className="w-3.5 h-3.5 mr-1" /> Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReject(selectedProblem.id)}
                                    className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold"
                                >
                                    <X className="w-3.5 h-3.5 mr-1" /> Reject
                                </Button>
                            </div>

                            <a
                                href={`/problems/${selectedProblem.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                Open Public View <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>

                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
