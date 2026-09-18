import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, Compass, Plus, Bookmark, User } from 'lucide-react';

interface MobileNavProps {
    onOpenSubmit?: () => void;
    onOpenAuth?: () => void;
}

export function MobileNav({ onOpenSubmit, onOpenAuth }: MobileNavProps) {
    const { url } = usePage();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 safe-area-bottom">
            <nav className="flex items-center justify-around">
                
                {/* Home */}
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors ${
                        url === '/' ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-800'
                    }`}
                >
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Home</span>
                </Link>

                {/* Explore */}
                <Link
                    href="/explore"
                    className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors ${
                        url.startsWith('/explore') ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-800'
                    }`}
                >
                    <Compass className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Explore</span>
                </Link>

                {/* Prominent Create Action Button */}
                <button
                    type="button"
                    onClick={() => {
                        if (onOpenSubmit) {
                            onOpenSubmit();
                        } else {
                            window.location.href = '/problems/create';
                        }
                    }}
                    className="flex flex-col items-center justify-center -mt-5"
                    aria-label="Submit a problem"
                >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all">
                        <Plus className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 mt-1">Create</span>
                </button>

                {/* Saved */}
                <Link
                    href="/app/saved"
                    onClick={(e) => {
                        if (onOpenAuth) {
                            // Can check if guest
                        }
                    }}
                    className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors ${
                        url.startsWith('/app/saved') ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-800'
                    }`}
                >
                    <Bookmark className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Saved</span>
                </Link>

                {/* Profile */}
                <Link
                    href="/app/profile"
                    className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors ${
                        url.startsWith('/app/profile') ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-800'
                    }`}
                >
                    <User className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Profile</span>
                </Link>

            </nav>
        </div>
    );
}
