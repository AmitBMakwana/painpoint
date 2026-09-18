import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppLayout } from '../../Components/Layout/AppLayout';
import { 
    CheckCircle2, 
    Copy, 
    Check, 
    ArrowRight, 
    Clock, 
    ShieldCheck, 
    Search, 
    Plus, 
    Share2, 
    Sparkles 
} from 'lucide-react';
import { Button } from '../../Components/UI/Button';

interface ConfirmationProps {
    referenceId?: string;
    problem?: any;
}

export default function SubmittedConfirmation({ referenceId = 'PRB-2026-CONFIRM', problem }: ConfirmationProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (referenceId) {
            navigator.clipboard.writeText(referenceId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AppLayout>
            <Head title="Problem Submitted — Reference ID Generated" />

            <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50">
                <div className="max-w-xl w-full text-center">
                    
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-6 animate-bounce">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Problem Successfully Submitted!
                    </h1>
                    <p className="mt-2 text-slate-600 text-sm sm:text-base">
                        Thank you for speaking up. Your submission gives real builders and researchers the raw problem statement they need to design solutions.
                    </p>

                    {/* Reference ID Card */}
                    <div className="my-8 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-left">
                        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Your Reference Tracking Code
                        </div>
                        <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                            <span className="font-mono text-lg sm:text-xl font-extrabold text-indigo-700 tracking-wider">
                                {referenceId}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-emerald-600">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                                        <span>Copy Code</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {problem && (
                            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                                <p><strong className="text-slate-800">Problem Title:</strong> {problem.title}</p>
                                <p><strong className="text-slate-800">Domain:</strong> {problem.category_name}</p>
                                <p><strong className="text-slate-800">Mode:</strong> {problem.submission_type === 'anonymous' ? '100% Anonymous' : 'Identified'}</p>
                            </div>
                        )}
                    </div>

                    {/* Timeline of next steps */}
                    <div className="text-left bg-slate-50/80 rounded-2xl p-5 border border-slate-200 text-xs space-y-3 mb-8">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            What happens next?
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                                <p className="text-slate-600"><strong className="text-slate-800">Moderation Review:</strong> Admins check the submission for spam prevention and clear taxonomy.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                                <p className="text-slate-600"><strong className="text-slate-800">Community Discovery:</strong> The problem appears on the Explore feed and Card Swipe mode for community validation.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                                <p className="text-slate-600"><strong className="text-slate-800">Solution Proposals:</strong> Community members submit architectures and prototypes to solve it.</p>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => window.location.href = '/explore'}
                            className="shadow-sm"
                        >
                            <Search className="w-4 h-4 mr-1.5" />
                            Explore Other Problems
                        </Button>

                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => window.location.href = '/submit-problem'}
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Submit Another Problem
                        </Button>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
