import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, 
    ArrowRight, 
    Sparkles, 
    CheckCircle2, 
    AlertCircle, 
    Send, 
    HelpCircle,
    RotateCcw
} from 'lucide-react';
import { AppLayout } from '../../Components/Layout/AppLayout';
import { Button } from '../../Components/UI/Button';
import { mockDomains } from '../../data/mockData';

export default function ProblemCreate() {
    const [step, setStep] = useState<number>(1);

    // Form inputs
    const [rawProblem, setRawProblem] = useState('');
    const [title, setTitle] = useState('');
    const [domainSlug, setDomainSlug] = useState('education');
    const [category, setCategory] = useState('');
    const [summary, setSummary] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    
    // Context inputs
    const [targetAudience, setTargetAudience] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'rarely'>('daily');
    const [painLevel, setPainLevel] = useState<number>(4);
    const [currentWorkaround, setCurrentWorkaround] = useState('');

    const [isSimulatingAI, setIsSimulatingAI] = useState(false);
    const [isPublished, setIsPublished] = useState(false);

    // AI Structuring Simulation
    const handleNextToStructuring = () => {
        if (!rawProblem.trim()) return;
        setIsSimulatingAI(true);
        setTimeout(() => {
            setIsSimulatingAI(false);
            // Heuristic or simulated AI extraction based on keywords
            let detectedDomain = 'business';
            let detectedCategory = 'Operational Friction';
            let detectedAudience = 'Small business operators and team leads';
            let detectedTags = ['operations', 'workflow', 'automation'];

            const lower = rawProblem.toLowerCase();
            if (lower.includes('school') || lower.includes('teacher') || lower.includes('student') || lower.includes('grade')) {
                detectedDomain = 'education';
                detectedCategory = 'Teacher Workload & Grading';
                detectedAudience = 'K-12 teachers, school principals, and academic staff';
                detectedTags = ['education', 'teachers', 'grading', 'burnout'];
            } else if (lower.includes('doctor') || lower.includes('patient') || lower.includes('clinic') || lower.includes('health')) {
                detectedDomain = 'healthcare';
                detectedCategory = 'Patient Logistics & Care';
                detectedAudience = 'Private clinic practitioners and medical staff';
                detectedTags = ['healthcare', 'appointments', 'clinics'];
            } else if (lower.includes('code') || lower.includes('developer') || lower.includes('docker') || lower.includes('bug')) {
                detectedDomain = 'developer-tools';
                detectedCategory = 'Developer Productivity';
                detectedAudience = 'Software engineers and DevOps teams';
                detectedTags = ['developers', 'devops', 'productivity'];
            } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('kitchen') || lower.includes('chef')) {
                detectedDomain = 'food';
                detectedCategory = 'Kitchen & Inventory Management';
                detectedAudience = 'Restaurant owners, head chefs, and kitchen leads';
                detectedTags = ['restaurants', 'food-waste', 'inventory'];
            }

            setTitle(rawProblem.length > 70 ? rawProblem.substring(0, 68) + '...' : rawProblem);
            setDomainSlug(detectedDomain);
            setCategory(detectedCategory);
            setSummary(rawProblem);
            setTargetAudience(detectedAudience);
            setTags(detectedTags);
            setStep(2);
        }, 600);
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim().toLowerCase()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handlePublish = () => {
        setIsPublished(true);
        setTimeout(() => {
            window.location.href = '/explore';
        }, 1800);
    };

    return (
        <AppLayout>
            <Head title="Submit a Real-World Problem — PainPoint" />

            <div className="bg-white border-b border-slate-200/80 py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <Link href="/explore" className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800">
                            <ChevronLeft className="w-4 h-4" />
                            <span>Cancel</span>
                        </Link>

                        {/* Step indicators */}
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4].map(s => (
                                <div
                                    key={s}
                                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                                        step === s 
                                            ? 'bg-indigo-600 text-white shadow-xs' 
                                            : step > s 
                                            ? 'bg-emerald-100 text-emerald-800' 
                                            : 'bg-slate-100 text-slate-400'
                                    }`}
                                >
                                    {step > s ? '✓' : s}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-sm">
                    
                    {/* STEP 1: Conversational Problem Prompt */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                    Step 1 of 4
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                                    What problem are you facing?
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Describe the frustration, manual bottleneck, or broken workflow in your own words. Don't worry about structuring it yet.
                                </p>
                            </div>

                            <div>
                                <textarea
                                    required
                                    rows={5}
                                    value={rawProblem}
                                    onChange={(e) => setRawProblem(e.target.value)}
                                    placeholder="e.g., Independent coffee shops and bakeries waste 15% of daily pastries because there is no reliable way to forecast walk-in customer volume when rainstorms happen unexpectedly..."
                                    className="w-full p-4 text-base bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 leading-relaxed placeholder-slate-400"
                                />
                                <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                                    <span>Tip: Be specific about who suffers and what happens.</span>
                                    <span>{rawProblem.length} characters</span>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    disabled={!rawProblem.trim() || isSimulatingAI}
                                    isLoading={isSimulatingAI}
                                    onClick={handleNextToStructuring}
                                >
                                    <span>Next: Structure with AI</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: AI-Assisted Structuring Preview (Fully Editable) */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 w-fit">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Step 2 of 4 • AI-Assisted Structuring</span>
                                </div>
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
                                    We understood your problem as...
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Review the AI-extracted categorization below. Feel free to tweak any field before continuing.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Problem Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Domain
                                        </label>
                                        <select
                                            value={domainSlug}
                                            onChange={(e) => setDomainSlug(e.target.value)}
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                        >
                                            {mockDomains.map(d => (
                                                <option key={d.id} value={d.slug}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Executive Summary
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Tags (Press Enter to add)
                                    </label>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {tags.map(t => (
                                            <span key={t} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                                                #{t}
                                                <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-indigo-900">×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Type tag and press enter..."
                                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                                <Button
                                    variant="outline"
                                    size="md"
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={() => setStep(3)}
                                >
                                    <span>Next: Add Context & Pain</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Context & Pain Depth */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                    Step 3 of 4
                                </span>
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
                                    How painful is this friction?
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Providing context helps builders understand the urgency and who experiences it.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Who experiences this problem?
                                    </label>
                                    <input
                                        type="text"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        placeholder="e.g., Independent bakery managers, line cooks, baristas"
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">
                                        How frequently does it occur?
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {(['daily', 'weekly', 'monthly', 'rarely'] as const).map(f => (
                                            <button
                                                key={f}
                                                type="button"
                                                onClick={() => setFrequency(f)}
                                                className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                                                    frequency === f
                                                        ? 'bg-indigo-600 text-white shadow-xs'
                                                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                                        <span>Pain level (1: mild nuisance → 5: critical bottleneck):</span>
                                        <span className="text-amber-600 font-extrabold text-sm">{painLevel} / 5</span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[1, 2, 3, 4, 5].map(lvl => (
                                            <button
                                                key={lvl}
                                                type="button"
                                                onClick={() => setPainLevel(lvl)}
                                                className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                                                    painLevel === lvl
                                                        ? 'bg-amber-500 text-white shadow-xs'
                                                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Current Workarounds & Alternatives (Optional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={currentWorkaround}
                                        onChange={(e) => setCurrentWorkaround(e.target.value)}
                                        placeholder="What are people currently doing to cope with this? (e.g., Paper sheets, spreadsheets)"
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                                <Button
                                    variant="outline"
                                    size="md"
                                    onClick={() => setStep(2)}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={() => setStep(4)}
                                >
                                    <span>Review Problem</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Review & Publish */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                    Step 4 of 4 • Final Review
                                </span>
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
                                    Ready to publish to the community?
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Once published, community members will be able to validate their experience, join the conversation, and suggest solutions.
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                        {mockDomains.find(d => d.slug === domainSlug)?.name || domainSlug}
                                    </span>
                                    <span className="text-xs text-slate-500">• {category}</span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                    {title}
                                </h3>

                                <p className="text-slate-600 text-xs leading-relaxed">
                                    {summary}
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/80 text-xs">
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Audience</span>
                                        <span className="font-semibold text-slate-800">{targetAudience || 'General Practitioners'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Frequency</span>
                                        <span className="font-semibold text-slate-800 capitalize">{frequency}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pain Level</span>
                                        <span className="font-semibold text-amber-600">{painLevel} / 5</span>
                                    </div>
                                </div>
                            </div>

                            {isPublished ? (
                                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1 animate-in zoom-in-95">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                                    <h4 className="font-bold text-emerald-900 text-base">Problem Published Successfully!</h4>
                                    <p className="text-xs text-emerald-700">Redirecting to problem directory...</p>
                                </div>
                            ) : (
                                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                                    <Button
                                        variant="outline"
                                        size="md"
                                        onClick={() => setStep(3)}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handlePublish}
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>Publish Problem</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
