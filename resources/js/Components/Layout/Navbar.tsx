import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Search, 
    Plus, 
    Compass, 
    Flame, 
    Layers, 
    Lightbulb, 
    CreditCard, 
    Menu, 
    X, 
    Sparkles, 
    ArrowRight,
    UserCircle2
} from 'lucide-react';
import { Button } from '../UI/Button';

interface NavbarProps {
    onOpenAuth?: (title?: string, description?: string) => void;
    onOpenSubmit?: () => void;
}

export function Navbar({ onOpenAuth, onOpenSubmit }: NavbarProps) {
    const { url } = usePage();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/explore?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const navLinks = [
        { name: 'Explore', href: '/explore', icon: Compass, active: url.startsWith('/explore') },
        { name: 'Trending', href: '/trending', icon: Flame, active: url.startsWith('/trending') },
        { name: 'Domains', href: '/domains', icon: Layers, active: url.startsWith('/domains') },
        { name: 'Solutions', href: '/solutions', icon: Lightbulb, active: url.startsWith('/solutions') },
        { name: 'Pricing', href: '/pricing', icon: CreditCard, active: url.startsWith('/pricing') },
    ];

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    
                    {/* Logo */}
                    <div className="flex items-center gap-6 shrink-0">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
                                <span className="font-extrabold text-lg tracking-tighter">P</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-950 text-lg leading-tight tracking-tight flex items-center gap-1.5">
                                    PainPoint
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                                        Beta
                                    </span>
                                </span>
                                <span className="text-[10px] text-slate-600 hidden sm:block">
                                    Problem & Solution Discovery
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'text-indigo-600 bg-indigo-50/60 font-semibold'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${link.active ? 'text-indigo-600' : 'text-slate-600'}`} />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Centered Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-2">
                        <form onSubmit={handleSearchSubmit} className="w-full relative">
                            <div className="relative flex items-center">
                                <Search className="w-4 h-4 absolute left-3 text-slate-600 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search problems, solutions, or topics..."
                                    className="w-full pl-9 pr-12 py-1.5 text-sm bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all outline-none text-slate-800 placeholder-slate-600"
                                />
                                <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 bg-slate-200/70 rounded border border-slate-300 pointer-events-none">
                                    /
                                </kbd>
                            </div>
                        </form>
                    </div>

                    {/* Right Navigation & CTAs */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => onOpenAuth ? onOpenAuth('Log in to PainPoint', 'Sign in to access your saved problems, votes, and community solutions.') : window.location.href = '/login'}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors hidden sm:block"
                        >
                            Log in
                        </button>

                        <button
                            type="button"
                            onClick={() => onOpenAuth ? onOpenAuth('Create a free account', 'Join the community to validate real problems and suggest solutions.') : window.location.href = '/register'}
                            className="text-sm font-medium text-slate-700 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 transition-all hidden sm:block shadow-xs"
                        >
                            Sign up
                        </button>

                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                if (onOpenSubmit) {
                                    onOpenSubmit();
                                } else {
                                    window.location.href = '/problems/create';
                                }
                            }}
                            className="hidden xs:inline-flex"
                        >
                            <Plus className="w-4 h-4 -ml-0.5" />
                            <span>Submit Problem</span>
                        </Button>

                        {/* Mobile Menu Toggle Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Dropdown Menu Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-600" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search problems or solutions..."
                            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-800"
                        />
                    </form>

                    <div className="grid grid-cols-2 gap-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium ${
                                        link.active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 text-indigo-600" />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                        <Button
                            variant="primary"
                            size="md"
                            className="w-full"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                if (onOpenSubmit) onOpenSubmit();
                                else window.location.href = '/problems/create';
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            Submit a Problem
                        </Button>

                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    if (onOpenAuth) onOpenAuth();
                                    else window.location.href = '/login';
                                }}
                                className="w-full py-2 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                            >
                                Log in
                            </button>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    if (onOpenAuth) onOpenAuth();
                                    else window.location.href = '/register';
                                }}
                                className="w-full py-2 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
