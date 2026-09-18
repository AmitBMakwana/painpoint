import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '../../Layouts/AdminLayout';
import { 
    Settings, 
    Layers, 
    Server, 
    Database, 
    Shield, 
    CheckCircle2, 
    ExternalLink,
    Code,
    Cpu,
    Activity,
    FolderKanban
} from 'lucide-react';

interface CategoryItem {
    slug: string;
    name: string;
    problems_count: number;
}

interface SettingsProps {
    categories: CategoryItem[];
    systemStats: {
        php_version: string;
        laravel_version: string;
        database_driver: string;
        total_problems: number;
        total_solutions: number;
        total_users: number;
        total_admins: number;
    };
}

export default function AdminSettings({
    categories,
    systemStats,
}: SettingsProps) {
    return (
        <AdminLayout
            title="Platform Settings & Infrastructure"
            subtitle="Review configured problem domains, database health, framework runtime, and governance parameters."
        >
            <Head title="Platform Settings — PainPoint Admin" />

            {/* System Runtime Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Server className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Runtime</div>
                        <div className="text-xl font-black text-slate-900">PHP {systemStats.php_version}</div>
                        <div className="text-[10px] text-slate-400">Production Engine</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                        <Code className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Framework</div>
                        <div className="text-xl font-black text-slate-900">Laravel {systemStats.laravel_version}</div>
                        <div className="text-[10px] text-slate-400">Inertia React 19 Stack</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Database className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Primary DB</div>
                        <div className="text-xl font-black text-slate-900 uppercase">{systemStats.database_driver}</div>
                        <div className="text-[10px] text-slate-400">ACID Relational Storage</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Access Security</div>
                        <div className="text-xl font-black text-slate-900">Multi-Guard</div>
                        <div className="text-[10px] text-slate-400">auth:web & auth:admin</div>
                    </div>
                </div>
            </div>

            {/* Problem Domains & Categories Directory */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FolderKanban className="w-5 h-5 text-indigo-600" />
                            Registered Problem Domains ({categories.length} Sectors)
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Curated classification taxonomy used for indexing, filtering, and cross-discipline solutions.
                        </p>
                    </div>
                    <Link
                        href="/explore"
                        target="_blank"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                        Browse Public Category Directory <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                        <div
                            key={cat.slug}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:border-indigo-300 transition-colors"
                        >
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                                <span className="font-mono text-[10px] text-slate-400">slug: {cat.slug}</span>
                            </div>
                            <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-indigo-600 shadow-2xs">
                                {cat.problems_count} problems
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Platform Feature Flags & Policies */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        Platform Operational Policies
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Core operational rules enforced throughout the PainPoint platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Public Submission Without Login
                        </div>
                        <p className="text-slate-600 leading-relaxed text-xs">
                            Active. Any citizen or engineer can submit a problem statement without prior registration. Submissions are queued for admin moderation before public display.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Voice & Multilingual Input
                        </div>
                        <p className="text-slate-600 leading-relaxed text-xs">
                            Active. Voice transcription via Web Speech Recognition API with automatic language detection across Hindi, Gujarati, Marathi, Spanish, etc.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Submitter Identity Privacy
                        </div>
                        <p className="text-slate-600 leading-relaxed text-xs">
                            Active. Identified submitter contact data (phone, address, email) is encrypted and visible exclusively in the Admin Moderation Console.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Deterministic Top 3 Pinning
                        </div>
                        <p className="text-slate-600 leading-relaxed text-xs">
                            Active. Curators pin validated top problems directly to the community leaderboard podium and hero swipe cards.
                        </p>
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
}
