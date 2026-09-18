import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '../../../Layouts/AdminLayout';
import { 
    ShieldCheck, 
    Search, 
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
    ExternalLink, 
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle
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
        <AdminLayout
            title="Problem Moderation & Curation Console"
            subtitle={`Reviewing ${problems.total} reported community problems across all sectors.`}
        >
            <Head title="Problem Moderation — PainPoint Admin" />

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                statusFilter === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search Box */}
                <form onSubmit={handleSearch} className="relative sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search title, ID, submitter..."
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-900 outline-none focus:border-indigo-500 shadow-2xs placeholder-slate-400"
                    />
                </form>
            </div>

            {/* Problems Table Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                <th className="py-3.5 px-4 sm:px-6">Ref ID</th>
                                <th className="py-3.5 px-4">Problem Statement</th>
                                <th className="py-3.5 px-4">Category</th>
                                <th className="py-3.5 px-4">Submitter Identity</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Pin / Rank</th>
                                <th className="py-3.5 px-4 sm:px-6 text-right">Moderation Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {problems.data.length > 0 ? (
                                problems.data.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-4 px-4 sm:px-6 font-mono font-bold text-indigo-600">
                                            {p.public_id}
                                        </td>
                                        <td className="py-4 px-4 max-w-sm">
                                            <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                                            <div className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{p.description}</div>
                                            {p.city && (
                                                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                                                    <MapPin className="w-3 h-3 text-indigo-400" /> {p.city}, {p.country}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                                {p.category_name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            {p.submission_type === 'identified' ? (
                                                <div>
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                                                        <User className="w-3 h-3" />
                                                        {p.contact?.name || 'Identified'}
                                                    </span>
                                                    {p.contact?.mobile && (
                                                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{p.contact.mobile}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-medium">
                                                    🕶️ Anonymous
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                                p.status.toLowerCase() === 'approved'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : p.status.toLowerCase() === 'rejected'
                                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            {p.is_pinned ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-extrabold">
                                                    <Pin className="w-3 h-3 fill-amber-600 text-amber-600" />
                                                    Top #{p.pin_order || 1}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-[11px]">—</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 sm:px-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedProblem(p)}
                                                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors"
                                                    title="Inspect full problem & contacts"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleApprove(p.id)}
                                                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 transition-colors"
                                                    title="Approve Problem"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleReject(p.id)}
                                                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 transition-colors"
                                                    title="Reject Problem"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handlePin(p.id, p.is_pinned ? 0 : 1, p.is_pinned)}
                                                    className={`p-2 rounded-xl border transition-colors ${
                                                        p.is_pinned 
                                                            ? 'bg-amber-100 text-amber-800 border-amber-300' 
                                                            : 'bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-800 border-slate-200'
                                                    }`}
                                                    title={p.is_pinned ? 'Unpin' : 'Pin to Top 3'}
                                                >
                                                    <Pin className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(p.id, p.public_id)}
                                                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors"
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
                                    <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                                        No problems found matching this filter criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {problems.links && problems.links.length > 3 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between">
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
            </div>

            {/* PROBLEM INSPECTION & CONTACT MODAL */}
            {selectedProblem && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-900">
                        
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <span className="font-mono text-indigo-600 text-xs font-extrabold">
                                    {selectedProblem.public_id}
                                </span>
                                <h3 className="text-lg font-black text-slate-900 mt-1 leading-tight">
                                    {selectedProblem.title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedProblem(null)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Problem Statement</h4>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                                {selectedProblem.description}
                            </p>
                        </div>

                        {/* Voice Transcript (if any) */}
                        {selectedProblem.voice_transcript && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 mb-1.5">
                                    <Mic className="w-3.5 h-3.5" /> Audio / Voice Transcript
                                </h4>
                                <p className="text-xs text-indigo-950 italic bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200">
                                    "{selectedProblem.voice_transcript}"
                                </p>
                            </div>
                        )}

                        {/* Submitter Contact Identity (Protected Data) */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                Submitter Identity Information
                            </h4>
                            {selectedProblem.submission_type === 'identified' && selectedProblem.contact ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                                    <div>
                                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Submitter Name</span>
                                        <span className="font-bold text-slate-900">{selectedProblem.contact.name || 'Not provided'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Mobile / Phone</span>
                                        <span className="font-mono font-bold text-emerald-700">{selectedProblem.contact.mobile || 'Not provided'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Email Address</span>
                                        <span className="font-mono text-indigo-700">{selectedProblem.contact.email || 'Not provided'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Location</span>
                                        <span className="text-slate-800 font-semibold">{selectedProblem.contact.city || selectedProblem.city || '—'} {selectedProblem.contact.postal_code || selectedProblem.postal_code || ''}</span>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Street Address</span>
                                        <span className="text-slate-700">{selectedProblem.contact.address || 'Not provided'}</span>
                                    </div>
                                    {selectedProblem.contact.additional_info && (
                                        <div className="sm:col-span-2">
                                            <span className="text-slate-400 block text-[10px] font-bold uppercase">Organization / Context</span>
                                            <span className="text-slate-700">{selectedProblem.contact.additional_info}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                                    Submitter selected 100% Anonymous Mode. No contact identity stored.
                                </div>
                            )}
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleApprove(selectedProblem.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs font-bold"
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
