import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '../../Layouts/AdminLayout';
import { 
    AlertCircle, 
    CheckCircle2, 
    Pin, 
    Users, 
    Lightbulb, 
    ArrowRight, 
    Eye, 
    Check, 
    X, 
    ExternalLink, 
    Clock, 
    MapPin, 
    Phone, 
    Mail,
    Shield,
    Sparkles,
    Flame
} from 'lucide-react';
import { Button } from '../../Components/UI/Button';

interface AdminDashboardProps {
    adminUser: any;
    metrics: {
        total_problems: number;
        pending_review: number;
        approved_problems: number;
        pinned_problems: number;
        total_users: number;
        total_contributions: number;
    };
    pendingProblems: any[];
    pinnedProblems: any[];
    recentProblems: any[];
}

export default function AdminDashboard({
    adminUser,
    metrics = {
        total_problems: 6,
        pending_review: 1,
        approved_problems: 5,
        pinned_problems: 3,
        total_users: 5,
        total_contributions: 115,
    },
    pendingProblems = [],
    pinnedProblems = [],
    recentProblems = [],
}: AdminDashboardProps) {

    const handleApprove = (id: number) => {
        router.post(`/admin/problems/${id}/approve`, {}, {
            preserveScroll: true,
        });
    };

    const handleReject = (id: number) => {
        const reason = prompt('Please enter rejection reason for this submission:');
        if (reason) {
            router.post(`/admin/problems/${id}/reject`, { reason }, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout
            title="Platform Overview & Governance"
            subtitle="Monitor real-time problem submissions, community interactions, and moderation queues."
        >
            <Head title="Admin Operations Console — PainPoint" />

            {/* METRICS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Reported</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{metrics.total_problems}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">All time submissions</div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 shadow-xs">
                    <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Review
                    </div>
                    <div className="text-2xl font-black text-amber-900 mt-1">{metrics.pending_review}</div>
                    <div className="text-[10px] text-amber-700 mt-0.5">Requires moderation</div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-5 shadow-xs">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                    </div>
                    <div className="text-2xl font-black text-emerald-900 mt-1">{metrics.approved_problems}</div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">Live on directory</div>
                </div>

                <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-3xl p-5 shadow-xs">
                    <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Pinned Top 3
                    </div>
                    <div className="text-2xl font-black text-indigo-900 mt-1">{metrics.pinned_problems}</div>
                    <div className="text-[10px] text-indigo-700 mt-0.5">Community spotlight</div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Users className="w-3 h-3" /> Members
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{metrics.total_users}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Registered contributors</div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" /> Solutions
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{metrics.total_contributions}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Proposed answers</div>
                </div>
            </div>

            {/* MODERATION REVIEW QUEUE */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            Urgent Review Queue ({pendingProblems.length} Pending)
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Submissions requiring admin verification before public publishing.
                        </p>
                    </div>
                    <Link
                        href="/admin/problems?status=pending"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                        View Full Moderation Table <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {pendingProblems.length > 0 ? (
                    <div className="space-y-3">
                        {pendingProblems.map((prob) => (
                            <div
                                key={prob.id}
                                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                            >
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="font-mono text-indigo-700 font-extrabold">{prob.public_id}</span>
                                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]">
                                            {prob.category_name}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                            prob.submission_type === 'identified' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                            {prob.submission_type === 'identified' ? '👤 Identified Submitter' : '🕶️ Anonymous'}
                                        </span>
                                        {prob.city && (
                                            <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                                                <MapPin className="w-3 h-3 text-indigo-500" /> {prob.city}, {prob.country}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                                        {prob.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl">
                                        {prob.description}
                                    </p>

                                    {/* Contact identity preview if submitted */}
                                    {prob.contact && (
                                        <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                                            <span className="font-bold text-slate-800">Contact:</span>
                                            {prob.contact.name && <span className="font-semibold text-slate-900">{prob.contact.name}</span>}
                                            {prob.contact.mobile && <span className="flex items-center gap-1 text-slate-600"><Phone className="w-3 h-3 text-indigo-500" /> {prob.contact.mobile}</span>}
                                            {prob.contact.email && <span className="flex items-center gap-1 text-slate-600"><Mail className="w-3 h-3 text-indigo-500" /> {prob.contact.email}</span>}
                                        </div>
                                    )}
                                </div>

                                {/* Quick Action Buttons */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => handleApprove(prob.id)}
                                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                                    >
                                        <Check className="w-3.5 h-3.5" /> Approve
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleReject(prob.id)}
                                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 text-xs font-bold transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" /> Reject
                                    </button>
                                    <a
                                        href={`/problems/${prob.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                                        title="View Statement"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        All problem submissions have been reviewed! Clean queue.
                    </div>
                )}
            </div>

            {/* TOP 3 PINNED PROBLEMS MANAGER */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Pin className="w-5 h-5 text-amber-500 fill-amber-500" />
                            Active Top 3 Pinned Spotlight Problems
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            These problems are highlighted on the Leaderboard podium, card swipe stack, and public hero.
                        </p>
                    </div>
                    <Link
                        href="/admin/problems?status=pinned"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                        Manage All Pins →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pinnedProblems.map((p, idx) => (
                        <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-extrabold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                    Pin Order #{p.pin_order || idx + 1}
                                </span>
                                <span className="font-mono text-slate-400">{p.public_id}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">{p.title}</h4>
                            <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-200/80">
                                <span className="font-medium text-slate-700">{p.category_name}</span>
                                <span className="text-rose-600 font-bold">{p.support_count} supporters</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </AdminLayout>
    );
}
