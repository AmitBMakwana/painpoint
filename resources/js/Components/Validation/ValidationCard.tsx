import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2, AlertCircle, BarChart3, HelpCircle } from 'lucide-react';
import { ValidationSummary } from '../../types';
import { useAuthModal } from '../Layout/AppLayout';

interface ValidationCardProps {
    problemId: number;
    initialValidation: ValidationSummary;
    onVoteSubmit?: (vote: 'yes' | 'no', frequency?: string, painLevel?: number) => void;
}

export function ValidationCard({
    problemId,
    initialValidation,
    onVoteSubmit,
}: ValidationCardProps) {
    const { openAuth } = useAuthModal();
    const [validation, setValidation] = useState<ValidationSummary>(initialValidation);
    const [hasVoted, setHasVoted] = useState<'yes' | 'no' | null>(initialValidation.userVote || null);
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'rarely'>('daily');
    const [selectedPainLevel, setSelectedPainLevel] = useState<number>(4);

    const handleVote = (vote: 'yes' | 'no') => {
        // Prompt contextual auth if simulated guest
        // For interactive demo, allow immediate local state update
        if (vote === 'yes') {
            setHasVoted('yes');
            setShowDetailsForm(true);
            const newTotalYes = validation.totalYes + 1;
            const newPct = Math.round((newTotalYes / (newTotalYes + validation.totalNo)) * 100);
            setValidation({
                ...validation,
                totalYes: newTotalYes,
                percentage: newPct,
                userVote: 'yes',
            });
            if (onVoteSubmit) onVoteSubmit('yes');
        } else {
            setHasVoted('no');
            setShowDetailsForm(false);
            const newTotalNo = validation.totalNo + 1;
            const newPct = Math.round((validation.totalYes / (validation.totalYes + newTotalNo)) * 100);
            setValidation({
                ...validation,
                totalNo: newTotalNo,
                percentage: newPct,
                userVote: 'no',
            });
            if (onVoteSubmit) onVoteSubmit('no');
        }
    };

    const handleSaveDetails = () => {
        setShowDetailsForm(false);
        if (onVoteSubmit) onVoteSubmit('yes', selectedFrequency, selectedPainLevel);
    };

    const totalVotes = validation.totalYes + validation.totalNo;

    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm tracking-tight">
                            Is this your problem too?
                        </h4>
                        <p className="text-xs text-slate-500">
                            Community validation signals
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <span className="text-xl font-black text-slate-900">{validation.percentage}%</span>
                    <span className="block text-[10px] text-slate-400 font-medium">Agreement rate</span>
                </div>
            </div>

            {/* Voting Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => handleVote('yes')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                        hasVoted === 'yes'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                            : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200/60'
                    }`}
                >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Yes, I face this</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleVote('no')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                        hasVoted === 'no'
                            ? 'bg-slate-700 text-white shadow-md ring-2 ring-slate-700/30'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                >
                    <ThumbsDown className="w-4 h-4" />
                    <span>No, not really</span>
                </button>
            </div>

            {/* Optional Pain & Frequency Step when voted Yes */}
            {showDetailsForm && (
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-2">
                            How often do you experience this?
                        </label>
                        <div className="grid grid-cols-4 gap-1.5 text-xs">
                            {(['daily', 'weekly', 'monthly', 'rarely'] as const).map((freq) => (
                                <button
                                    key={freq}
                                    type="button"
                                    onClick={() => setSelectedFrequency(freq)}
                                    className={`py-1.5 px-2 rounded-lg capitalize font-medium transition-all ${
                                        selectedFrequency === freq
                                            ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    {freq}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
                            <span>Pain level (1: mild inconvenience → 5: severe bottleneck):</span>
                            <span className="font-bold text-indigo-600">{selectedPainLevel}/5</span>
                        </div>
                        <div className="grid grid-cols-5 gap-1.5">
                            {[1, 2, 3, 4, 5].map((lvl) => (
                                <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setSelectedPainLevel(lvl)}
                                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        selectedPainLevel === lvl
                                            ? 'bg-amber-500 text-white shadow-xs'
                                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSaveDetails}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                        Save Validation Details
                    </button>
                </div>
            )}

            {/* Validation Breakdown & Signal Summary */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium text-slate-700">
                        {validation.totalYes.toLocaleString()} people confirmed YES
                    </span>
                    <span className="text-slate-400">
                        {totalVotes.toLocaleString()} total responses
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${validation.percentage}%` }}
                    />
                    <div
                        className="bg-slate-300 h-full rounded-r-full transition-all duration-500"
                        style={{ width: `${100 - validation.percentage}%` }}
                    />
                </div>

                {/* Frequency & Pain Meter Statistics */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                            Most Common Frequency
                        </span>
                        <span className="font-bold text-slate-800 text-sm capitalize">
                            Daily (64%)
                        </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                            Avg Pain Level
                        </span>
                        <span className="font-bold text-amber-600 text-sm">
                            {validation.averagePainLevel || 4.2} / 5.0
                        </span>
                    </div>
                </div>

                <p className="text-[11px] text-slate-400 italic pt-1">
                    * Based on responses from participating community members. Does not constitute absolute scientific consensus.
                </p>
            </div>
        </div>
    );
}
