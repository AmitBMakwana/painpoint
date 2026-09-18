import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ShieldCheck, 
    AlertCircle, 
    CheckCircle2, 
    Pin, 
    Users, 
    Lightbulb, 
    LogOut, 
    ArrowRight, 
    Eye, 
    Check, 
    X, 
    ExternalLink, 
    Clock, 
    MapPin, 
    Phone, 
    Mail 
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

    const handleLogout = () => {
        router.post('/admin/logout');
    };

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
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <Head title="Admin Operations Console — PainPoint" />

            {/* Admin Header Bar */}
            <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                            P
                        </div>
                        <div>
                            <span className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                                PainPoint Admin
                                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                                    Console
                                </span>
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1 ml-6 text-xs font-semibold">
                        <Link href="/admin/dashboard" className="px-3 py-1.5 rounded-lg bg-slate-800 text-white">
                            Dashboard
                        </Link>
                        <Link href="/admin/problems" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
                            Moderate Problems ({metrics.pending_review} Pending)
                        </Link>
                        <a href="/" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white flex items-center gap-1">
                            Public Site <ExternalLink className="w-3 h-3" />
                        </a>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-white">{adminUser?.name || 'Admin'}</div>
                        <div className="text-[10px] text-slate-400">{adminUser?.role || 'Super Admin'}</div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors"
                        title="Logout from Admin"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Dashboard Body */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                
                {/* METRICS ROW */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Reported</div>
                        <div className="text-2xl font-extrabold text-white mt-1">{metrics.total_problems}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">All time submissions</div>
                    </div>

                    <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4">
                        <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending Review
                        </div>
                        <div className="text-2xl font-extrabold text-amber-300 mt-1">{metrics.pending_review}</div>
                        <div className="text-[10px] text-amber-500 mt-0.5">Awaiting moderation</div>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                        <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Approved
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-300 mt-1">{metrics.approved_problems}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Live on platform</div>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                        <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                            <Pin className="w-3 h-3" /> Pinned Top 3
                        </div>
                        <div className="text-2xl font-extrabold text-indigo-300 mt-1">{metrics.pinned_problems}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Platform spotlight</div>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Users className="w-3 h-3" /> Members
                        </div>
                        <div className="text-2xl font-extrabold text-white mt-1">{metrics.total_users}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Registered contributors</div>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" /> Solutions
                        </div>
                        <div className="text-2xl font-extrabold text-white mt-1">{metrics.total_contributions}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Proposals & evidence</div>
                    </div>
                </div>

                {/* MODERATION QUEUE: PENDING PROBLEMS */}
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-700">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-400" />
                                Urgent Review Queue ({pendingProblems.length})
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Public anonymous and identified problems submitted by community members.
                            </p>
                        </div>
                        <Link
                            href="/admin/problems?status=pending"
                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                            View All in Moderation Table <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {pendingProblems.length > 0 ? (
                        <div className="space-y-3">
                            {pendingProblems.map((prob) => (
                                <div
                                    key={prob.id}
                                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                            <span className="font-mono text-indigo-400 font-bold">{prob.public_id}</span>
                                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                                                {prob.category_name}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                prob.submission_type === 'identified' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                                {prob.submission_type === 'identified' ? '👤 Identified Submitter' : '🕶️ Anonymous'}
                                            </span>
                                            {prob.city && (
                                                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                                                    <MapPin className="w-3 h-3 text-indigo-400" /> {prob.city}, {prob.country}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-white text-base leading-snug">
                                            {prob.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 line-clamp-2 max-w-3xl">
                                            {prob.description}
                                        </p>

                                        {/* Contact Snippet if identified */}
                                        {prob.contact && (
                                            <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
                                                <span className="font-semibold text-white">Contact:</span>
                                                {prob.contact.name && <span>{prob.contact.name}</span>}
                                                {prob.contact.mobile && <span className="flex items-center gap-1 text-slate-400"><Phone className="w-3 h-3" /> {prob.contact.mobile}</span>}
                                                {prob.contact.email && <span className="flex items-center gap-1 text-slate-400"><Mail className="w-3 h-3" /> {prob.contact.email}</span>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleApprove(prob.id)}
                                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                                        >
                                            <Check className="w-3.5 h-3.5" /> Approve
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleReject(prob.id)}
                                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-semibold transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" /> Reject
                                        </button>
                                        <a
                                            href={`/problems/${prob.slug}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
                                            title="View Public Layout"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                            All pending submissions have been reviewed! Clean queue.
                        </div>
                    )}
                </div>

                {/* CURRENT TOP 3 PINNED PROBLEMS */}
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Pin className="w-5 h-5 text-amber-400 fill-amber-400" />
                                Active Top 3 Pinned Problems
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                These problems appear on the homepage hero, swipe deck top cards, and leaderboard spotlight.
                            </p>
                        </div>
                        <Link
                            href="/admin/problems?status=pinned"
                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                        >
                            Manage All Pins →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pinnedProblems.map((p, idx) => (
                            <div key={p.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                        Pin #{p.pin_order || idx + 1}
                                    </span>
                                    <span className="font-mono text-slate-500">{p.public_id}</span>
                                </div>
                                <h4 className="font-bold text-white text-sm line-clamp-2">{p.title}</h4>
                                <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                                    <span>{p.category_name}</span>
                                    <span className="text-emerald-400 font-semibold">{p.support_count} supporters</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}
