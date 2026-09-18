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
    Sparkles, 
    Pin 
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, active: url === '/admin/dashboard' },
        { name: 'Problem Moderation', href: '/admin/problems', icon: AlertCircle, active: url.startsWith('/admin/problems') },
        { name: 'User Management', href: '/admin/users', icon: Users, active: url.startsWith('/admin/users') },
        { name: 'Solution Proposals', href: '/admin/solutions', icon: Lightbulb, active: url.startsWith('/admin/solutions') },
        { name: 'Platform Settings', href: '/admin/settings', icon: Settings, active: url.startsWith('/admin/settings') },
    ];

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
            
            {/* Top Admin Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        
                        {/* Logo & Admin Badge */}
                        <div className="flex items-center gap-4 shrink-0">
                            <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
                                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
                                    <span className="font-extrabold text-lg tracking-tighter">P</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-950 text-lg leading-tight tracking-tight flex items-center gap-1.5">
                                        PainPoint
                                        <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                                            Admin
                                        </span>
                                    </span>
                                    <span className="text-[10px] text-slate-500 hidden sm:block">
                                        Operations & Governance
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Nav Items */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                            item.active
                                                ? 'text-indigo-600 bg-indigo-50/80 border border-indigo-100 shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Admin Profile & Actions */}
                        <div className="flex items-center gap-3">
                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                            >
                                Public Site <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <div className="hidden md:flex flex-col text-right">
                                <span className="text-xs font-bold text-slate-900">{admin?.name || 'Administrator'}</span>
                                <span className="text-[10px] text-slate-500 font-semibold">{admin?.role || 'Super Admin'}</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                                title="Log out from Admin Console"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>

                            {/* Mobile Hamburger */}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold ${
                                        item.active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 text-indigo-600" />
                                    {item.name}
                                </Link>
                            );
                        })}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <a href="/" target="_blank" className="font-semibold text-slate-600 flex items-center gap-1">
                                Public Site <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="font-bold text-rose-600"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Flash Alerts Banner */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            {/* Main Page Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                {title && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
                            {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
                        </div>
                    </div>
                )}

                {children}
            </main>

            {/* Admin Footer */}
            <footer className="border-t border-slate-200/80 py-4 bg-white text-center text-xs text-slate-500">
                <p>PainPoint Administrator Console • Version 1.0 Production • Logged in as {admin?.email || 'admin'}</p>
            </footer>

        </div>
    );
}
