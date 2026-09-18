import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppLayout } from '../../Components/Layout/AppLayout';
import { 
    Mic, 
    MicOff, 
    Globe, 
    UploadCloud, 
    FileText, 
    Image as ImageIcon, 
    Film, 
    Link2, 
    Shield, 
    User, 
    MapPin, 
    AlertCircle, 
    CheckCircle2, 
    Sparkles, 
    Trash2, 
    Plus, 
    Radio, 
    Search,
    ChevronRight,
    HelpCircle,
    Info,
    Flame
} from 'lucide-react';
import { Button } from '../../Components/UI/Button';

interface Category {
    slug: string;
    name: string;
    icon: string;
}

interface Language {
    code: string;
    name: string;
    flag: string;
}

interface PublicSubmitProps {
    categories: Category[];
    supportedLanguages: Language[];
    initialCategory?: string;
    isAuthenticated?: boolean;
    currentUser?: any;
}

export default function PublicSubmit({
    categories = [],
    supportedLanguages = [],
    initialCategory = 'community',
    isAuthenticated = false,
    currentUser = null,
}: PublicSubmitProps) {
    // Form States
    const [title, setTitle] = useState('');
    const [categorySlug, setCategorySlug] = useState(initialCategory);
    const [languageCode, setLanguageCode] = useState('en');
    const [description, setDescription] = useState('');
    const [voiceTranscript, setVoiceTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);

    // Impact & Scale
    const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
    const [frequency, setFrequency] = useState<'hourly' | 'daily' | 'weekly' | 'monthly' | 'occasional'>('daily');
    const [scale, setScale] = useState<'individual' | 'team' | 'community' | 'regional' | 'global'>('regional');
    const [affectedGroup, setAffectedGroup] = useState('');

    // Location
    const [country, setCountry] = useState('India');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [locality, setLocality] = useState('');
    const [postalCode, setPostalCode] = useState('');

    // Resources & Links
    const [links, setLinks] = useState<{ url: string; title: string }[]>([]);
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    // Identity / Contact Option
    const [submissionType, setSubmissionType] = useState<'anonymous' | 'identified'>('anonymous');
    const [contactName, setContactName] = useState(currentUser?.name || '');
    const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
    const [contactMobile, setContactMobile] = useState('');
    const [contactAddress, setContactAddress] = useState('');
    const [contactCity, setContactCity] = useState('');
    const [contactPin, setContactPin] = useState('');
    const [contactOrg, setContactOrg] = useState('');
    const [contactMethod, setContactMethod] = useState<'email' | 'phone' | 'whatsapp' | 'any'>('email');

    // Duplicate suggestions state
    const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);
    const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

    // Submission states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Web Speech Recognition Ref
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechRecognitionSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = languageCode === 'hi' ? 'hi-IN' : languageCode === 'gu' ? 'gu-IN' : languageCode === 'es' ? 'es-ES' : 'en-US';

        recognition.onresult = (event: any) => {
            let transcriptText = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcriptText += event.results[i][0].transcript;
            }
            if (transcriptText.trim()) {
                setVoiceTranscript((prev) => prev ? `${prev} ${transcriptText}` : transcriptText);
                setDescription((prev) => prev ? `${prev} ${transcriptText}` : transcriptText);
            }
        };

        recognition.onerror = (err: any) => {
            console.warn('Speech recognition error:', err);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [languageCode]);

    const toggleVoiceRecording = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Debounced duplicate detection
    useEffect(() => {
        if (title.length < 4) {
            setDuplicateMatches([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsCheckingDuplicates(true);
            try {
                const res = await fetch(`/api/problems/check-duplicates?q=${encodeURIComponent(title)}`);
                const data = await res.json();
                setDuplicateMatches(data.results || []);
            } catch (e) {
                console.error('Failed to check duplicates', e);
            } finally {
                setIsCheckingDuplicates(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [title]);

    // Handle File Additions
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...selectedFiles].slice(0, 5));
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle Link Additions
    const addLink = () => {
        if (newLinkUrl.trim()) {
            setLinks((prev) => [...prev, { url: newLinkUrl.trim(), title: newLinkTitle.trim() || newLinkUrl.trim() }]);
            setNewLinkUrl('');
            setNewLinkTitle('');
        }
    };

    const removeLink = (index: number) => {
        setLinks((prev) => prev.filter((_, i) => i !== index));
    };

    // Submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category_slug', categorySlug);
        formData.append('language_code', languageCode);
        formData.append('description', description);
        if (voiceTranscript) formData.append('voice_transcript', voiceTranscript);

        formData.append('urgency', urgency);
        formData.append('frequency', frequency);
        formData.append('scale', scale);
        if (affectedGroup) formData.append('affected_group', affectedGroup);

        if (country) formData.append('country', country);
        if (state) formData.append('state', state);
        if (city) formData.append('city', city);
        if (locality) formData.append('locality', locality);
        if (postalCode) formData.append('postal_code', postalCode);

        formData.append('submission_type', submissionType);

        if (submissionType === 'identified') {
            if (contactName) formData.append('contact[name]', contactName);
            if (contactEmail) formData.append('contact[email]', contactEmail);
            if (contactMobile) formData.append('contact[mobile]', contactMobile);
            if (contactAddress) formData.append('contact[address]', contactAddress);
            if (contactCity) formData.append('contact[city]', contactCity || city);
            if (contactPin) formData.append('contact[postal_code]', contactPin || postalCode);
            if (contactOrg) formData.append('contact[additional_info]', contactOrg);
        }

        // Links
        links.forEach((l, idx) => {
            formData.append(`links[${idx}][url]`, l.url);
            formData.append(`links[${idx}][title]`, l.title);
        });

        // Files
        files.forEach((f) => {
            formData.append('files[]', f);
        });

        router.post('/submit-problem', formData, {
            forceFormData: true,
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout>
            <Head title="Submit a Real-World Problem — PainPoint Community" />

            <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen py-10 md:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Banner */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            Open Community Gateway • No Account Required
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Report a Real-World Problem
                        </h1>
                        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                            Got stuck in frustrating bureaucracy, infrastructure failures, or daily friction? Submit here anonymously or share your contacts for builders to solve.
                        </p>
                    </div>

                    {/* Form Container */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Errors summary if any */}
                        {Object.keys(errors).length > 0 && (
                            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-shake">
                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold">Please correct the highlighted fields:</h4>
                                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
                                        {Object.entries(errors).map(([key, msg]) => (
                                            <li key={key}>{msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* SECTION 1: Core Problem & Multilingual / Voice */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                                        1
                                    </span>
                                    <h2 className="text-lg font-bold text-slate-900">What is the problem?</h2>
                                </div>

                                {/* Language Selector */}
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-slate-600" />
                                    <span className="text-xs font-medium text-slate-600">Language:</span>
                                    <select
                                        value={languageCode}
                                        onChange={(e) => setLanguageCode(e.target.value)}
                                        className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                                    >
                                        {supportedLanguages.map((lang) => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.flag} {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Category Selector */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                    Domain / Category *
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.slug}
                                            type="button"
                                            onClick={() => setCategorySlug(cat.slug)}
                                            className={`p-3 text-left rounded-2xl border transition-all text-xs font-medium flex flex-col gap-1.5 ${
                                                categorySlug === cat.slug
                                                    ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 font-bold shadow-xs ring-2 ring-indigo-500/20'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                                            }`}
                                        >
                                            <span className="text-sm font-semibold truncate">{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title with live duplicate detector */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Problem Title *
                                    </label>
                                    <span className="text-xs text-slate-600">{title.length}/255</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Broken water pipeline flooding Sector 4 underpass every evening"
                                    className={`w-full px-4 py-3 text-sm sm:text-base bg-slate-50 border rounded-2xl outline-none transition-all ${
                                        errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                    }`}
                                />
                                {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}

                                {/* Duplicate Detection Alert */}
                                {duplicateMatches.length > 0 && (
                                    <div className="mt-3 p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl text-amber-900 text-xs">
                                        <div className="flex items-center gap-2 font-bold mb-1">
                                            <AlertCircle className="w-4 h-4 text-amber-600" />
                                            <span>Similar problems already reported by the community:</span>
                                        </div>
                                        <div className="space-y-1.5 mt-2">
                                            {duplicateMatches.map((dup) => (
                                                <div key={dup.id} className="flex items-center justify-between bg-white/80 p-2 rounded-xl border border-amber-100">
                                                    <span className="font-medium text-slate-800 truncate max-w-md">
                                                        [{dup.public_id}] {dup.title}
                                                    </span>
                                                    <a
                                                        href={`/problems/${dup.slug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-indigo-600 font-bold hover:underline shrink-0 ml-2"
                                                    >
                                                        View ({dup.support_count} supports)
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="mt-2 text-[11px] text-amber-700">
                                            You can still submit your version if your context or location is distinct!
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Detailed Description with Voice Dictation */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                            Detailed Description *
                                        </label>
                                        <span className="text-[11px] text-slate-600">(Explain who is suffering and what happens)</span>
                                    </div>

                                    {/* Voice Dictation Button */}
                                    {speechRecognitionSupported && (
                                        <button
                                            type="button"
                                            onClick={toggleVoiceRecording}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                                isRecording
                                                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/20 ring-2 ring-rose-300'
                                                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                                            }`}
                                        >
                                            {isRecording ? (
                                                <>
                                                    <MicOff className="w-3.5 h-3.5" />
                                                    <span>Listening... Click to Stop</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Mic className="w-3.5 h-3.5 text-indigo-600" />
                                                    <span>Speak Problem (Voice Input)</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                <div className="relative">
                                    <textarea
                                        rows={5}
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe the issue in full detail. How often does it happen? Who is affected? What solutions have been tried and why did they fail?"
                                        className={`w-full p-4 text-sm bg-slate-50 border rounded-2xl outline-none transition-all ${
                                            errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                        }`}
                                    />
                                    {isRecording && (
                                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 rounded-lg border border-rose-200 text-rose-600 text-xs font-medium shadow-xs">
                                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                            Dictating via Web Speech API...
                                        </div>
                                    )}
                                </div>
                                {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
                            </div>

                        </div>

                        {/* SECTION 2: Scale, Frequency, Urgency & Location */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                                    2
                                </span>
                                <h2 className="text-lg font-bold text-slate-900">Scale, Impact & Geographic Location</h2>
                            </div>

                            {/* Urgency, Frequency & Scale Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                        Urgency
                                    </label>
                                    <select
                                        value={urgency}
                                        onChange={(e: any) => setUrgency(e.target.value)}
                                        className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="low">Low (Minor annoyance)</option>
                                        <option value="medium">Medium (Recurring hindrance)</option>
                                        <option value="high">High (Major loss / safety risk)</option>
                                        <option value="critical">Critical (Emergency / Life hazard)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                        Frequency
                                    </label>
                                    <select
                                        value={frequency}
                                        onChange={(e: any) => setFrequency(e.target.value)}
                                        className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="hourly">Hourly</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="occasional">Occasionally / Seasonal</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                        Affected Scale
                                    </label>
                                    <select
                                        value={scale}
                                        onChange={(e: any) => setScale(e.target.value)}
                                        className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="individual">Individual</option>
                                        <option value="team">Team / Workplace</option>
                                        <option value="community">Neighborhood / Community</option>
                                        <option value="regional">City / Regional</option>
                                        <option value="global">National / Global</option>
                                    </select>
                                </div>
                            </div>

                            {/* Who is affected */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                    Who is primarily suffering?
                                </label>
                                <input
                                    type="text"
                                    value={affectedGroup}
                                    onChange={(e) => setAffectedGroup(e.target.value)}
                                    placeholder="e.g. Daily subway commuters, wheelchair users, smallholder farmers"
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                                />
                            </div>

                            {/* Location Grid */}
                            <div className="pt-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-indigo-600" />
                                    <h3 className="text-sm font-bold text-slate-900">Location Details</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Country</label>
                                        <input
                                            type="text"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                                            placeholder="India, USA, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">State / Province</label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                                            placeholder="Maharashtra, Gujarat, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">City / Town</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                                            placeholder="Ahmedabad, Mumbai, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Postal / PIN Code</label>
                                        <input
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                                            placeholder="380015"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* SECTION 3: Supporting Media, Evidence & Links */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                                    3
                                </span>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Evidence, Media & References</h2>
                                    <p className="text-xs text-slate-600">Attach photos, videos, reports, or web links to substantiate your problem.</p>
                                </div>
                            </div>

                            {/* Drag & Drop File Upload */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                    Upload Supporting Files (Images, Videos, PDFs)
                                </label>
                                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*,application/pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-slate-800">
                                        Click or drag files here to upload
                                    </p>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Supports JPG, PNG, MP4, PDF up to 20MB each (max 5 files)
                                    </p>
                                </div>

                                {/* File preview pills */}
                                {files.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {files.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800">
                                                {file.type.startsWith('image/') ? (
                                                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                                                ) : file.type.startsWith('video/') ? (
                                                    <Film className="w-3.5 h-3.5 text-rose-600" />
                                                ) : (
                                                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                                                )}
                                                <span className="max-w-xs truncate">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="text-slate-600 hover:text-rose-600 ml-1"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add External Link */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                    Add Web Links & Articles
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="url"
                                        value={newLinkUrl}
                                        onChange={(e) => setNewLinkUrl(e.target.value)}
                                        placeholder="https://example.com/news-report"
                                        className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                                    />
                                    <input
                                        type="text"
                                        value={newLinkTitle}
                                        onChange={(e) => setNewLinkTitle(e.target.value)}
                                        placeholder="Title / Note (optional)"
                                        className="sm:w-48 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={addLink}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Link
                                    </Button>
                                </div>

                                {links.length > 0 && (
                                    <div className="space-y-1.5 mt-3">
                                        {links.map((link, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                                <div className="flex items-center gap-2 truncate">
                                                    <Link2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                                    <span className="font-semibold text-slate-800">{link.title}:</span>
                                                    <span className="text-slate-600 truncate">{link.url}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeLink(idx)}
                                                    className="text-slate-600 hover:text-rose-600 p-1"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* SECTION 4: Submitter Identity & Contact Choice */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                                    4
                                </span>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Your Identity & Contact Details</h2>
                                    <p className="text-xs text-slate-600">Choose whether to stay anonymous or allow builders & admins to contact you.</p>
                                </div>
                            </div>

                            {/* 2 Big Choice Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setSubmissionType('anonymous')}
                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                                        submissionType === 'anonymous'
                                            ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-xl ${submissionType === 'anonymous' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900">100% Anonymous</h3>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            No name, phone, or email is stored with the public problem. Your privacy is totally protected.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSubmissionType('identified')}
                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                                        submissionType === 'identified'
                                            ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-xl ${submissionType === 'identified' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900">Share Contact Details</h3>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            Allow verified problem solvers and admins to follow up with you directly for interviews or pilots.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details Expanded Fields */}
                            {submissionType === 'identified' && (
                                <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4 animate-in slide-in-from-top-2 duration-150">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <Info className="w-4 h-4 text-indigo-600" />
                                        <span>Your contacts will only be visible to administrators and verified community architects.</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={contactName}
                                                onChange={(e) => setContactName(e.target.value)}
                                                placeholder="e.g. Rajesh Makwana"
                                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile / Phone Number</label>
                                            <input
                                                type="tel"
                                                value={contactMobile}
                                                onChange={(e) => setContactMobile(e.target.value)}
                                                placeholder="+91 98765 43210"
                                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={contactEmail}
                                                onChange={(e) => setContactEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Address</label>
                                            <input
                                                type="text"
                                                value={contactAddress}
                                                onChange={(e) => setContactAddress(e.target.value)}
                                                placeholder="Building, street, neighborhood"
                                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">City & PIN Code</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={contactCity}
                                                    onChange={(e) => setContactCity(e.target.value)}
                                                    placeholder="City"
                                                    className="w-2/3 px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                                />
                                                <input
                                                    type="text"
                                                    value={contactPin}
                                                    onChange={(e) => setContactPin(e.target.value)}
                                                    placeholder="PIN"
                                                    className="w-1/3 px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Organization / Title (Optional)</label>
                                            <input
                                                type="text"
                                                value={contactOrg}
                                                onChange={(e) => setContactOrg(e.target.value)}
                                                placeholder="e.g. Resident Association President, Local Clinic Nurse"
                                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Submit Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                            <Link
                                href="/explore"
                                className="text-sm font-medium text-slate-600 hover:text-slate-900"
                            >
                                ← Cancel and Return to Explore
                            </Link>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={isSubmitting || !title || !description}
                                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-lg shadow-indigo-600/20"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting Problem...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Submit Problem to Community
                                        <ChevronRight className="w-5 h-5" />
                                    </span>
                                )}
                            </Button>
                        </div>

                    </form>

                </div>
            </div>
        </AppLayout>
    );
}
