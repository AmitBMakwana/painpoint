import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { AppLayout } from '../../Components/Layout/AppLayout';
import { 
    Heart, 
    X, 
    Bookmark, 
    ExternalLink, 
    MapPin, 
    AlertTriangle, 
    Clock, 
    Users, 
    Sparkles, 
    RotateCcw, 
    Share2, 
    Flame,
    Pin,
    Trophy,
    CheckCircle2
} from 'lucide-react';
import { Button } from '../../Components/UI/Button';

interface ProblemCard {
    id: number;
    public_id: string;
    slug: string;
    title: string;
    description: string;
    category_slug: string;
    category_name: string;
    urgency: string;
    scale: string;
    frequency: string;
    city?: string;
    state?: string;
    country?: string;
    support_count: number;
    is_pinned: boolean;
    pin_order?: number;
    cover_image?: string;
    created_at?: string;
}

interface SwipeExploreProps {
    initialCards: ProblemCard[];
    isAuthenticated?: boolean;
}

export default function SwipeExplore({ initialCards = [], isAuthenticated = false }: SwipeExploreProps) {
    const [cards, setCards] = useState<ProblemCard[]>(initialCards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [supportedCount, setSupportedCount] = useState(0);
    const [skippedCount, setSkippedCount] = useState(0);
    const [lastAction, setLastAction] = useState<string | null>(null);
    const [savedProblems, setSavedProblems] = useState<number[]>([]);

    const currentCard = cards[currentIndex];

    // Card Motion values for the active top card
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-18, 18]);
    const opacity = useTransform(x, [-250, -100, 0, 100, 250], [0, 1, 1, 1, 0]);
    const likeOpacity = useTransform(x, [10, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-10, -100], [0, 1]);

    // Handle Swipe Actions
    const handleSwipe = async (direction: 'right' | 'left' | 'up' | 'down') => {
        if (!currentCard) return;

        if (direction === 'right') {
            // Support problem
            setSupportedCount((prev) => prev + 1);
            setLastAction('Supported!');
            try {
                await fetch(`/api/problems/${currentCard.id}/support`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                    },
                });
            } catch (err) {
                console.error('Support error', err);
            }
        } else if (direction === 'left') {
            setSkippedCount((prev) => prev + 1);
            setLastAction('Skipped');
        } else if (direction === 'down') {
            setSavedProblems((prev) => [...prev, currentCard.id]);
            setLastAction('Saved to Bookmarks');
        } else if (direction === 'up') {
            window.open(`/problems/${currentCard.slug}`, '_blank');
            return;
        }

        setTimeout(() => setLastAction(null), 1500);
        setCurrentIndex((prev) => prev + 1);
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleSwipe('right');
            else if (e.key === 'ArrowLeft') handleSwipe('left');
            else if (e.key === 'ArrowUp') handleSwipe('up');
            else if (e.key === 'ArrowDown') handleSwipe('down');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, cards]);

    const resetDeck = () => {
        setCurrentIndex(0);
        setSupportedCount(0);
        setSkippedCount(0);
    };

    return (
        <AppLayout>
            <Head title="Real-Time Problem Card Swipe Discovery — PainPoint" />

            <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between py-6 px-4 select-none relative overflow-hidden">
                
                {/* Background Ambient Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Header Bar */}
                <div className="max-w-md w-full mx-auto flex items-center justify-between z-10 pt-2 pb-4">
                    <div className="flex items-center gap-2">
                        <Link href="/explore" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                            ← Grid View
                        </Link>
                        <span className="text-slate-600">•</span>
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                            <Flame className="w-3 h-3 text-rose-400" />
                            Swipe Discovery
                        </div>
                    </div>

                    {/* Counters */}
                    <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <Heart className="w-3.5 h-3.5 fill-emerald-400" /> {supportedCount}
                        </span>
                        <span className="text-slate-400 font-bold">
                            {cards.length - currentIndex > 0 ? `${cards.length - currentIndex} left` : 'Deck Empty'}
                        </span>
                    </div>
                </div>

                {/* Action Feedback Banner (Floating) */}
                <AnimatePresence>
                    {lastAction && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full font-bold text-xs shadow-lg backdrop-blur-md ${
                                lastAction === 'Supported!'
                                    ? 'bg-emerald-500/90 text-white'
                                    : lastAction === 'Skipped'
                                    ? 'bg-slate-700/90 text-slate-200'
                                    : 'bg-amber-500/90 text-white'
                            }`}
                        >
                            {lastAction}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MAIN SWIPE CARD DECK CONTAINER */}
                <div className="relative w-full max-w-sm sm:max-w-md mx-auto h-[480px] sm:h-[530px] flex items-center justify-center my-auto">
                    {currentCard ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            
                            {/* Card Layer Behind (Rank 3) */}
                            {cards[currentIndex + 2] && (
                                <div className="absolute w-full h-full rounded-3xl bg-slate-800/40 border border-slate-700/40 scale-90 translate-y-8 blur-[1px] pointer-events-none" />
                            )}

                            {/* Card Layer Behind (Rank 2) */}
                            {cards[currentIndex + 1] && (
                                <div className="absolute w-full h-full rounded-3xl bg-slate-800/80 border border-slate-700/60 scale-95 translate-y-4 shadow-xl pointer-events-none p-6 flex flex-col justify-between">
                                    <div className="flex items-center justify-between opacity-50">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-700 text-slate-300">
                                            {cards[currentIndex + 1].category_name}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-300 line-clamp-3 opacity-60">
                                        {cards[currentIndex + 1].title}
                                    </h3>
                                    <div className="h-4" />
                                </div>
                            )}

                            {/* Top Interactive Card */}
                            <motion.div
                                style={{ x, rotate, opacity }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.7}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x > 100) {
                                        handleSwipe('right');
                                    } else if (info.offset.x < -100) {
                                        handleSwipe('left');
                                    }
                                }}
                                className="absolute w-full h-full rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none overflow-hidden"
                            >
                                {/* Swipe Indicators Stamps (Overlay) */}
                                <motion.div
                                    style={{ opacity: likeOpacity }}
                                    className="absolute top-6 left-6 z-30 border-4 border-emerald-400 text-emerald-400 font-extrabold text-xl px-4 py-1.5 rounded-2xl rotate-[-15deg] pointer-events-none uppercase tracking-wider"
                                >
                                    SUPPORT ❤️
                                </motion.div>

                                <motion.div
                                    style={{ opacity: nopeOpacity }}
                                    className="absolute top-6 right-6 z-30 border-4 border-rose-500 text-rose-500 font-extrabold text-xl px-4 py-1.5 rounded-2xl rotate-[15deg] pointer-events-none uppercase tracking-wider"
                                >
                                    SKIP ✖️
                                </motion.div>

                                {/* Card Header */}
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                {currentCard.category_name}
                                            </span>
                                            {currentCard.is_pinned && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                                    <Pin className="w-3 h-3 fill-amber-300" />
                                                    Top {currentCard.pin_order || 'Pinned'}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-mono text-slate-400">
                                            #{currentCard.public_id}
                                        </span>
                                    </div>

                                    {/* Problem Title */}
                                    <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight mt-2">
                                        {currentCard.title}
                                    </h2>

                                    {/* Geographic and Scale Pills */}
                                    <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-300">
                                        {(currentCard.city || currentCard.country) && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300">
                                                <MapPin className="w-3 h-3 text-indigo-400" />
                                                {[currentCard.city, currentCard.country].filter(Boolean).join(', ')}
                                            </span>
                                        )}
                                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                                            currentCard.urgency === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                                        }`}>
                                            {currentCard.urgency} urgency
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300">
                                            {currentCard.frequency}
                                        </span>
                                    </div>
                                </div>

                                {/* Problem Description Excerpt */}
                                <div className="my-3 py-3 border-y border-slate-700/60">
                                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-5">
                                        {currentCard.description}
                                    </p>
                                </div>

                                {/* Card Footer Info */}
                                <div>
                                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                        <span className="flex items-center gap-1 text-slate-300 font-semibold">
                                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                                            {currentCard.support_count} Community Supporters
                                        </span>
                                        <a
                                            href={`/problems/${currentCard.slug}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                                        >
                                            Deep Dive <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <div className="text-[10px] text-slate-600 text-center">
                                        Swipe Right to Support • Swipe Left to Skip • Swipe Down to Save
                                    </div>
                                </div>

                            </motion.div>
                        </div>
                    ) : (
                        // Empty Deck State
                        <div className="w-full h-full rounded-3xl bg-slate-800/80 border border-slate-700 p-8 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">You're All Caught Up!</h3>
                            <p className="text-xs text-slate-400 max-w-xs mb-6">
                                You validated {supportedCount} problems in this session. Return to explore the full directory or submit a new problem.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button variant="outline" size="sm" onClick={resetDeck}>
                                    <RotateCcw className="w-4 h-4 mr-1.5" />
                                    Review Again
                                </Button>
                                <Button variant="primary" size="sm" onClick={() => window.location.href = '/submit-problem'}>
                                    Submit New Problem
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* BOTTOM FLOATING CONTROLS */}
                {currentCard && (
                    <div className="max-w-md w-full mx-auto flex items-center justify-center gap-4 sm:gap-6 z-10 py-3">
                        {/* Skip Button (Left) */}
                        <button
                            type="button"
                            onClick={() => handleSwipe('left')}
                            className="w-14 h-14 rounded-full bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/60 text-slate-400 hover:text-rose-400 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 group"
                            title="Skip (Left Arrow)"
                        >
                            <X className="w-7 h-7 transition-transform group-hover:rotate-90" />
                        </button>

                        {/* Save Bookmark Button (Down) */}
                        <button
                            type="button"
                            onClick={() => handleSwipe('down')}
                            className="w-11 h-11 rounded-full bg-slate-800 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/60 text-slate-400 hover:text-amber-400 flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95"
                            title="Save for Later (Down Arrow)"
                        >
                            <Bookmark className="w-5 h-5" />
                        </button>

                        {/* View Details Button (Up) */}
                        <button
                            type="button"
                            onClick={() => handleSwipe('up')}
                            className="w-11 h-11 rounded-full bg-slate-800 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500/60 text-slate-400 hover:text-indigo-400 flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95"
                            title="View Full Problem (Up Arrow)"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </button>

                        {/* Support Button (Right) */}
                        <button
                            type="button"
                            onClick={() => handleSwipe('right')}
                            className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-all hover:scale-110 active:scale-95 group"
                            title="I Experience This Too (Right Arrow)"
                        >
                            <Heart className="w-7 h-7 fill-white transition-transform group-hover:scale-125" />
                        </button>
                    </div>
                )}

                {/* Keyboard Helper Tips */}
                <div className="max-w-md w-full mx-auto text-center text-[11px] text-slate-400 pb-2 hidden sm:block">
                    Keyboard Shortcuts: <kbd className="px-1 bg-slate-800 rounded">← Skip</kbd> • <kbd className="px-1 bg-slate-800 rounded">→ Support</kbd> • <kbd className="px-1 bg-slate-800 rounded">↑ Details</kbd> • <kbd className="px-1 bg-slate-800 rounded">↓ Save</kbd>
                </div>

            </div>
        </AppLayout>
    );
}
