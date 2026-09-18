import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ShieldCheck, 
    Search, 
    Filter, 
    Check, 
    X, 
    Pin, 
    Trash2, 
    Sparkles, 
    Eye, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    FileText, 
    Link2, 
    Mic, 
    ArrowLeft, 
    LogOut, 
    ExternalLink, 
    AlertCircle 
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
        { id: 'pending', label: 'Pending Review', count: counts.pending },
        { id: 'approved', label: 'Approved', count: counts.approved },
        { id: 'pinned', label: 'Pinned Top 3', count: counts.pinned },
        { id: 'rejected', label: 'Rejected', count: counts.rejected },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <Head title="Problem Moderation & Curation Console — PainPoint Admin" />

            {/* Header */}
            <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="font-extrabold text-white text-base tracking-tight">
                            Problem Moderation Console
                        </h1>
                        <p className="text-[10px] text-slate-400">Total {problems.total} records registered</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/admin/dashboard" className="text-xs font-semibold text-slate-400 hover:text-white">
                        Dashboard
                    </Link>
                    <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1">
                        Public View <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </header>

            {/* Main Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                
                {/* Search & Tabs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    
                    {/* Status Tabs */}
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => handleFilterChange(tab.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                    statusFilter === tab.id
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                    statusFilter === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative sm:w-72">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search title, ID, submitter..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                        />
                    </form>
                </div>

                {/* Problems Table */}
                <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-950/60 border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                                    <th className="py-3 px-4">Ref ID</th>
                                    <th className="py-3 px-4">Problem Statement</th>
                                    <th className="py-3 px-4">Domain</th>
                                    <th className="py-3 px-4">Submitter Mode</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Pin / Rank</th>
                                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/60">
                                {problems.data.length > 0 ? (
                                    problems.data.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                                                {p.public_id}
                                            </td>
                                            <td className="py-3.5 px-4 max-w-sm">
                                                <div className="font-bold text-white line-clamp-1">{p.title}</div>
                                                <div className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">{p.description}</div>
                                                {p.city && (
                                                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-3 h-3" /> {p.city}, {p.country}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                                                    {p.category_name}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {p.submission_type === 'identified' ? (
                                                    <div>
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">
                                                            <User className="w-3 h-3" />
                                                            {p.contact?.name || 'Identified'}
                                                        </span>
                                                        {p.contact?.mobile && (
                                                            <div className="text-[10px] text-slate-400 mt-0.5">{p.contact.mobile}</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px]">
                                                        🕶️ Anonymous
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    p.status === 'Approved' || p.status === 'approved'
                                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                                        : p.status === 'Rejected' || p.status === 'rejected'
                                                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {p.is_pinned ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                                                        <Pin className="w-3 h-3 fill-amber-300" />
                                                        Top #{p.pin_order || 1}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500 text-[11px]">—</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedProblem(p)}
                                                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                                                        title="Inspect full problem & contacts"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleApprove(p.id)}
                                                        className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-800"
                                                        title="Approve Problem"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleReject(p.id)}
                                                        className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-800 text-rose-300 border border-rose-800"
                                                        title="Reject Problem"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handlePin(p.id, p.is_pinned ? 0 : 1, p.is_pinned)}
                                                        className={`p-1.5 rounded-lg border ${
                                                            p.is_pinned 
                                                                ? 'bg-amber-950 text-amber-300 border-amber-800' 
                                                                : 'bg-slate-900 hover:bg-amber-950 text-slate-400 hover:text-amber-300 border-slate-700'
                                                        }`}
                                                        title={p.is_pinned ? 'Unpin' : 'Pin to Top 3'}
                                                    >
                                                        <Pin className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(p.id, p.public_id)}
                                                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 border border-slate-700"
                                                        title="Delete Permanently"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400">
                                            No problems found for this filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>

            {/* PROBLEM INSPECTION & CONTACT MODAL */}
            {selectedProblem && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
                        
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div>
                                <span className="font-mono text-indigo-400 text-xs font-bold">
                                    {selectedProblem.public_id}
                                </span>
                                <h3 className="text-lg font-bold text-white mt-1">
                                    {selectedProblem.title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedProblem(null)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Full Statement</h4>
                            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                                {selectedProblem.description}
                            </p>
                        </div>

                        {/* Voice Transcript (if any) */}
                        {selectedProblem.voice_transcript && (
                            <div>
                                <h4 className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1 mb-1">
                                    <Mic className="w-3.5 h-3.5" /> Voice Transcription
                                </h4>
                                <p className="text-xs text-slate-300 italic bg-indigo-950/30 p-3 rounded-2xl border border-indigo-900/60">
                                    "{selectedProblem.voice_transcript}"
                                </p>
                            </div>
                        )}

                        {/* Submitter Contact Identity (Protected Data) */}
                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">
                                Submitter Identity Information
                            </h4>
                            {selectedProblem.submission_type === 'identified' && selectedProblem.contact ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
                                    <div>
                                        <span className="text-slate-500 block text-[10px]">Name</span>
                                        <span className="font-semibold text-white">{selectedProblem.contact.name || 'Not provided'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-[10px]">Mobile / Phone</span>
                                        <span className="font-mono text-emerald-400">{selectedProblem.contact.mobile || 'Not provided'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-[10px]">Email Address</span>
                                        <span className="font-mono text-indigo-400">{selectedProblem.contact.email || 'Not provided'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-[10px]">City & PIN</span>
                                        <span className="text-white">{selectedProblem.contact.city || selectedProblem.city || '—'} {selectedProblem.contact.postal_code || selectedProblem.postal_code || ''}</span>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-slate-500 block text-[10px]">Street Address</span>
                                        <span className="text-slate-300">{selectedProblem.contact.address || 'Not provided'}</span>
                                    </div>
                                    {selectedProblem.contact.additional_info && (
                                        <div className="sm:col-span-2">
                                            <span className="text-slate-500 block text-[10px]">Organization / Role</span>
                                            <span className="text-slate-300">{selectedProblem.contact.additional_info}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                                    Submitter selected 100% Anonymous Mode. No contact identity stored.
                                </div>
                            )}
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleApprove(selectedProblem.id)}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                                >
                                    <Check className="w-3.5 h-3.5 mr-1" /> Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReject(selectedProblem.id)}
                                    className="text-rose-400 border-rose-800 hover:bg-rose-950/40"
                                >
                                    <X className="w-3.5 h-3.5 mr-1" /> Reject
                                </Button>
                            </div>

                            <a
                                href={`/problems/${selectedProblem.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                                Open Public View <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
