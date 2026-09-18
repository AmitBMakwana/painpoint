import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Award, 
    Lightbulb, 
    Users, 
    Bookmark, 
    MessageSquare, 
    Flame, 
    CheckCircle2, 
    ShieldCheck, 
    MapPin, 
    Heart, 
    Edit3, 
    X, 
    Check, 
    Plus, 
    ExternalLink,
    Clock,
    Sparkles
} from 'lucide-react';
import { AppLayout } from '../../Components/Layout/AppLayout';
import { Button } from '../../Components/UI/Button';

interface ProfileUser {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    reputation: number;
    points: number;
    headline?: string;
    bio?: string;
    avatar_url?: string;
    created_at?: string;
}

interface ProfileShowProps {
    profileUser: ProfileUser;
    isOwner?: boolean;
    userProblems?: any[];
    userSolutions?: any[];
    savedProblems?: any[];
    defaultTab?: 'problems' | 'solutions' | 'saved';
}

export default function ProfileShow({
    profileUser,
    isOwner = false,
    userProblems = [],
    userSolutions = [],
    savedProblems = [],
    defaultTab = 'problems',
}: ProfileShowProps) {
    const [activeTab, setActiveTab] = useState<'problems' | 'solutions' | 'saved'>(defaultTab);
    const [editModalOpen, setEditModalOpen] = useState(false);

    // Edit form states
    const [editName, setEditName] = useState(profileUser?.name || '');
    const [editHeadline, setEditHeadline] = useState(profileUser?.headline || '');
    const [editBio, setEditBio] = useState(profileUser?.bio || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.post('/profile/update', {
            name: editName,
            headline: editHeadline,
            bio: editBio,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditModalOpen(false);
                setIsSaving(false);
            },
            onError: () => setIsSaving(false),
        });
    };

    if (!profileUser) {
        return (
            <AppLayout>
                <div className="min-h-[60vh] flex items-center justify-center text-center p-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">User Not Found</h2>
                        <p className="text-sm text-slate-500 mt-2">The requested profile does not exist or is private.</p>
                        <Link href="/explore" className="mt-4 inline-block text-indigo-600 font-bold text-sm">
                            ← Return to Explore
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title={`${profileUser.name} (@${profileUser.username}) — Community Profile`} />

            {/* Profile Header Banner */}
            <div className="bg-white border-b border-slate-200/80 pt-10 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-md shrink-0 overflow-hidden">
                                {profileUser.avatar_url ? (
                                    <img src={profileUser.avatar_url} alt={profileUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{profileUser.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>

                            <div className="space-y-1.5 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                        {profileUser.name}
                                    </h1>
                                    <span className="text-sm font-mono text-slate-500">
                                        @{profileUser.username}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                                        <Award className="w-3.5 h-3.5 text-amber-600" />
                                        {profileUser.points} Points
                                    </span>
                                </div>

                                <p className="text-sm font-semibold text-indigo-600">
                                    {profileUser.headline || profileUser.role}
                                </p>

                                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                                    {profileUser.bio || 'Passionate community builder discovering everyday friction and building verified solutions.'}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                        {profileUser.role}
                                    </span>
                                    <span>•</span>
                                    <span>Member since {profileUser.created_at || '2026'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Actions & Metrics */}
                        <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                            {isOwner && (
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(true)}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors border border-slate-200"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Edit Profile
                                </button>
                            )}

                            {/* Metric Counter Card */}
                            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center text-xs w-full sm:w-auto">
                                <div className="px-3">
                                    <div className="text-lg font-black text-slate-900">{userProblems.length}</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Problems</div>
                                </div>
                                <div className="px-3 border-l border-slate-200">
                                    <div className="text-lg font-black text-indigo-600">{userSolutions.length}</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Solutions</div>
                                </div>
                                <div className="px-3 border-l border-slate-200">
                                    <div className="text-lg font-black text-rose-600">{savedProblems.length}</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Saved</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-6 mt-8 border-t border-slate-100 pt-3 text-sm font-semibold">
                        <button
                            type="button"
                            onClick={() => setActiveTab('problems')}
                            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                                activeTab === 'problems'
                                    ? 'border-indigo-600 text-indigo-600 font-bold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Reported Problems ({userProblems.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('solutions')}
                            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                                activeTab === 'solutions'
                                    ? 'border-indigo-600 text-indigo-600 font-bold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Proposed Solutions ({userSolutions.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('saved')}
                            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
                                activeTab === 'saved'
                                    ? 'border-indigo-600 text-indigo-600 font-bold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Saved & Supported ({savedProblems.length})
                        </button>
                    </div>

                </div>
            </div>

            {/* Tab Contents */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* 1. REPORTED PROBLEMS */}
                {activeTab === 'problems' && (
                    <div>
                        {userProblems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {userProblems.map((p) => (
                                    <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all">
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-mono font-bold text-indigo-600">{p.public_id}</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    p.status === 'Approved' || p.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    p.status === 'Pending Review' || p.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-bold text-slate-900 leading-snug">
                                                <Link href={`/problems/${p.slug}`} className="hover:text-indigo-600 transition-colors">
                                                    {p.title}
                                                </Link>
                                            </h3>
                                            <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                            <span className="font-semibold text-slate-700">{p.category_name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1 font-bold text-rose-600">
                                                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> {p.support_count}
                                                </span>
                                                <span className="flex items-center gap-1 font-bold text-indigo-600">
                                                    <Lightbulb className="w-3.5 h-3.5" /> {p.contribution_count}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">No Problems Reported Yet</h3>
                                <p className="text-xs text-slate-500 mt-1 mb-4">
                                    Got stuck in everyday friction? Report a real-world problem and let community builders propose solutions.
                                </p>
                                <Button variant="primary" size="sm" onClick={() => window.location.href = '/submit-problem'}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Submit a Problem
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. PROPOSED SOLUTIONS */}
                {activeTab === 'solutions' && (
                    <div>
                        {userSolutions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {userSolutions.map((s) => (
                                    <div key={s.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
                                        <div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                                <span>Solution for:</span>
                                                <strong className="text-slate-800">{s.problem?.title || 'Community Problem'}</strong>
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 leading-snug">{s.title}</h3>
                                            <p className="text-xs text-slate-600 line-clamp-3 mt-1">{s.content || s.body}</p>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                            <span className="text-indigo-600 font-bold">{s.type || 'Solution'}</span>
                                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> {s.helpful_count ?? 0} Helpful Upvotes
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
                                    <Lightbulb className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">No Solutions Contributed Yet</h3>
                                <p className="text-xs text-slate-500 mt-1 mb-4">
                                    Browse active problems and contribute your architecture, prototype, or advice.
                                </p>
                                <Button variant="primary" size="sm" onClick={() => window.location.href = '/explore'}>
                                    Explore Problems to Solve
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. SAVED / SUPPORTED PROBLEMS */}
                {activeTab === 'saved' && (
                    <div>
                        {savedProblems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {savedProblems.map((p) => (
                                    <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-mono font-bold text-indigo-600">{p.public_id}</span>
                                                <span className="text-rose-600 font-bold flex items-center gap-1">
                                                    <Heart className="w-3.5 h-3.5 fill-rose-500" /> Supported
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 leading-snug">
                                                <Link href={`/problems/${p.slug}`} className="hover:text-indigo-600 transition-colors">
                                                    {p.title}
                                                </Link>
                                            </h3>
                                            <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                            <span>{p.category_name}</span>
                                            <Link href={`/problems/${p.slug}`} className="text-indigo-600 font-bold flex items-center gap-0.5">
                                                View <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
                                    <Bookmark className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">No Saved Problems</h3>
                                <p className="text-xs text-slate-500 mt-1 mb-4">
                                    Swipe right on problems or click "Support" to bookmark issues you care about.
                                </p>
                                <Button variant="primary" size="sm" onClick={() => window.location.href = '/explore/swipe'}>
                                    Try Card Swipe Mode
                                </Button>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* EDIT PROFILE MODAL */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
                            <button
                                type="button"
                                onClick={() => setEditModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white text-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Headline / Specialty</label>
                                <input
                                    type="text"
                                    value={editHeadline}
                                    onChange={(e) => setEditHeadline(e.target.value)}
                                    placeholder="e.g. Medical device engineer solving diagnostic bottlenecks"
                                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white text-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Bio / About You</label>
                                <textarea
                                    rows={3}
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                    placeholder="Share your background and what domains you're passionate about solving..."
                                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white text-slate-900"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AppLayout>
    );
}
