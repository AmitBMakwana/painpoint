import React from 'react';
import { Link } from '@inertiajs/react';
import { Sparkles, ShieldCheck, Heart, Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200/80 pt-16 pb-24 md:pb-16 text-slate-600 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
                    
                    {/* Brand column */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base">
                                P
                            </div>
                            <span className="font-bold text-slate-900 text-lg tracking-tight">
                                PainPoint
                            </span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
                            Real Problems. Real People. Better Solutions. Discover everyday friction, confirm personal pain points, and collaborate with the community to build community-validated solutions.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Community Verified
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                                <Sparkles className="w-3.5 h-3.5" />
                                AI-Assisted
                            </span>
                        </div>
                    </div>

                    {/* Explore column */}
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm mb-3">Explore</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/explore" className="text-slate-600 hover:text-indigo-600 transition-colors">All Problems</Link></li>
                            <li><Link href="/explore/swipe" className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-1.5">🔥 Card Swipe Mode</Link></li>
                            <li><Link href="/leaderboard" className="text-amber-600 font-medium hover:text-amber-700 transition-colors flex items-center gap-1.5">🏆 Leaderboard</Link></li>
                            <li><Link href="/trending" className="text-slate-600 hover:text-indigo-600 transition-colors">Trending Problems</Link></li>
                            <li><Link href="/solutions" className="text-slate-600 hover:text-indigo-600 transition-colors">Community Solutions</Link></li>
                            <li><Link href="/domains" className="text-slate-600 hover:text-indigo-600 transition-colors">Browse Domains</Link></li>
                        </ul>
                    </div>

                    {/* Top Domains */}
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm mb-3">Top Domains</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/domains/ai-technology" className="text-slate-600 hover:text-indigo-600 transition-colors">AI & Technology</Link></li>
                            <li><Link href="/domains/education" className="text-slate-600 hover:text-indigo-600 transition-colors">Education</Link></li>
                            <li><Link href="/domains/business" className="text-slate-600 hover:text-indigo-600 transition-colors">Small Business</Link></li>
                            <li><Link href="/domains/healthcare" className="text-slate-600 hover:text-indigo-600 transition-colors">Healthcare</Link></li>
                            <li><Link href="/domains/developer-tools" className="text-slate-600 hover:text-indigo-600 transition-colors">Developer Tools</Link></li>
                        </ul>
                    </div>

                    {/* Platform & Legal */}
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm mb-3">Platform</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/submit-problem" className="text-slate-600 hover:text-indigo-600 transition-colors">Submit Problem (Public)</Link></li>
                            <li><Link href="/pricing" className="text-slate-600 hover:text-indigo-600 transition-colors">Pricing & Plans</Link></li>
                            <li><Link href="/about" className="text-slate-600 hover:text-indigo-600 transition-colors">Product Vision</Link></li>
                            <li><Link href="/login" className="text-slate-600 hover:text-indigo-600 transition-colors">Sign In</Link></li>
                            <li><Link href="/register" className="text-slate-600 hover:text-indigo-600 transition-colors">Create Account</Link></li>
                            <li><Link href="/admin/login" className="text-slate-600 hover:text-slate-700 transition-colors text-xs font-mono">🔒 Admin Console</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
                    <p>© {new Date().getFullYear()} PainPoint Platform. Crafted for real builders and communities.</p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1">
                            Built with precision & care <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
                        </span>
                        <span>v1.0 Production</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
