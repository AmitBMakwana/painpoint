import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    AlertCircle, 
    Users, 
    Lightbulb, 
    Settings, 
    LogOut, 
    ExternalLink, 
    Menu, 
    X, 
    ShieldCheck, 
    Pin, 
    ChevronRight,
    Trophy,
    Layers,
    PlusCircle,
    Server,
    Shield
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
    const { url, props } = usePage();
    const admin = (props as any)?.auth?.admin;
    const flash = (props as any)?.flash;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const navItems = [
        { 
            name: 'Dashboard Overview', 
            href: '/admin/dashboard', 
            icon: LayoutDashboard, 
            active: url === '/admin/dashboard',
            badge: null
        },
        { 
            name: 'Problem Moderation', 
            href: '/admin/problems', 
            icon: AlertCircle, 
            active: url.startsWith('/admin/problems'),
            badge: 'Queue'
        },
        { 
            name: 'User Management', 
            href: '/admin/users', 
            icon: Users, 
            active: url.startsWith('/admin/users'),
            badge: 'Roles'
        },
        { 
            name: 'Solution Proposals', 
            href: '/admin/solutions', 
            icon: Lightbulb, 
            active: url.startsWith('/admin/solutions'),
            badge: '+50 pts'
        },
        { 
            name: 'Platform Settings', 
            href: '/admin/settings', 
            icon: Settings, 
            active: url.startsWith('/admin/settings'),
            badge: null
        },
    ];

    const quickLinks = [
        { name: 'Public Directory', href: '/explore', icon: ExternalLink },
        { name: 'Top 3 Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'Card Swipe Explore', href: '/explore/swipe', icon: Layers },
        { name: 'Report New Problem', href: '/submit-problem', icon: PlusCircle },
    ];

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex antialiased">
            
            {/* ========================================================================= */}
            {/* DESKTOP FIXED SIDEBAR */}
            {/* ========================================================================= */}
            <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-slate-200/80 sticky top-0 h-screen z-30 shrink-0 select-none">
                
                {/* Brand Logo Header */}
                <div className="h-16 px-6 border-b border-slate-200/80 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
                            <span className="font-extrabold text-xl tracking-tighter">P</span>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="font-black text-slate-950 text-base leading-tight tracking-tight">PainPoint</span>
                                <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    ADMIN
                                </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">Ops & Moderation Suite</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                    
                    {/* Primary Navigation Section */}
                    <div>
                        <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                            Governance & Moderation
                        </div>
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                                            item.active
                                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                                                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.badge && (
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold tracking-wide ${
                                                item.active 
                                                    ? 'bg-white/20 text-white' 
                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                            }`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Quick Community Shortcuts */}
                    <div>
                        <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                            Public Interfaces
                        </div>
                        <div className="space-y-1">
                            {quickLinks.map((ql) => {
                                const Icon = ql.icon;
                                return (
                                    <a
                                        key={ql.name}
                                        href={ql.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{ql.name}</span>
                                        </div>
                                        <ChevronRight className="w-3 h-3 text-slate-300" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* System Health Badge */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Platform Operational
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">v1.0</span>
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                            Multi-Guard Auth Active • RESTful API Engine Enabled
                        </div>
                    </div>

                </div>

                {/* Sidebar User / Logout Footer */}
                <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center shrink-0 border border-indigo-200">
                                {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="truncate">
                                <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                                    {admin?.name || 'Administrator'}
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium truncate">
                                    {admin?.role || 'Super Admin'}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                            title="Sign out from Admin"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </aside>

            {/* ========================================================================= */}
            {/* MOBILE SLIDE-IN SIDEBAR DRAWER (Responsive) */}
            {/* ========================================================================= */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
                        onClick={() => setMobileSidebarOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
                        {/* Drawer Header */}
                        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-base flex items-center justify-center">
                                    P
                                </div>
                                <span className="font-bold text-slate-900 text-sm">PainPoint Operations</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(false)}
                                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Nav links */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileSidebarOpen(false)}
                                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold ${
                                                item.active
                                                    ? 'bg-indigo-600 text-white shadow-xs'
                                                    : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-4 h-4" />
                                                <span>{item.name}</span>
                                            </div>
                                            {item.badge && (
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                                    item.active ? 'bg-white/20' : 'bg-indigo-50 text-indigo-700'
                                                }`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="pt-3 border-t border-slate-100 space-y-1">
                                <div className="text-[10px] font-bold uppercase text-slate-400 px-3 mb-1">
                                    Public Portals
                                </div>
                                {quickLinks.map((ql) => {
                                    const Icon = ql.icon;
                                    return (
                                        <a
                                            key={ql.name}
                                            href={ql.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50"
                                        >
                                            <Icon className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{ql.name}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Drawer footer */}
                        <div className="p-4 border-t border-slate-200 bg-slate-50">
                            <div className="flex items-center justify-between text-xs">
                                <div className="truncate">
                                    <div className="font-bold text-slate-900 truncate">{admin?.name || 'Administrator'}</div>
                                    <div className="text-[10px] text-slate-500">{admin?.email}</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-xs font-bold text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MAIN CONTENT AREA WITH TOPBAR */}
            {/* ========================================================================= */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Topbar for Mobile and Desktop contextual actions */}
                <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                    
                    {/* Left: Mobile hamburger & breadcrumbs */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                            aria-label="Open navigation sidebar"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-400 hidden sm:inline">Admin</span>
                            <span className="text-slate-300 hidden sm:inline">/</span>
                            <span className="font-extrabold text-slate-900">{title || 'Operations Console'}</span>
                        </div>
                    </div>

                    {/* Right: Quick actions & status */}
                    <div className="flex items-center gap-2.5">
                        <a
                            href="/explore"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                        >
                            Public Site <ExternalLink className="w-3 h-3" />
                        </a>

                        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-slate-500 font-medium">Logged in:</span>
                            <span className="font-bold text-slate-800">{admin?.name || 'Admin'}</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors lg:hidden"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>

                </header>

                {/* Flash Alerts Banner */}
                {flash?.success && (
                    <div className="px-4 sm:px-6 lg:px-8 pt-4">
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}

                {/* Page Content Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
                    {title && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
                                {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
                            </div>
                        </div>
                    )}

                    {children}
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-200/80 py-4 px-6 bg-white text-center text-xs text-slate-400">
                    PainPoint Administrator Console • API-Driven Architecture • Logged in as {admin?.email || 'admin@painpoint.com'}
                </footer>

            </div>

        </div>
    );
}
