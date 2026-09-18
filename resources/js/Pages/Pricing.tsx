import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Check, Sparkles, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { AppLayout } from '../Components/Layout/AppLayout';
import { Button } from '../Components/UI/Button';

export default function Pricing() {
    const [annual, setAnnual] = useState(true);

    const plans = [
        {
            name: 'Free Community',
            badge: 'For Everyone',
            priceMonthly: '$0',
            priceAnnual: '$0',
            period: 'forever free',
            description: 'Full access to browse, discover real problems, join discussions, and submit solutions.',
            cta: 'Join Free Community',
            highlight: false,
            features: [
                'Unlimited problem & solution browsing',
                'Submit your own problems & solutions',
                'Participate in "I Have This Problem" validation',
                'Upvote & join community conversations',
                'Follow & save problems to your profile',
                'Basic search across 16 domains',
            ],
        },
        {
            name: 'Pro Builder',
            badge: 'Most Popular',
            priceMonthly: '$19',
            priceAnnual: '$15',
            period: 'per month',
            description: 'For indie hackers and developers seeking validated startup ideas with real demand signals.',
            cta: 'Start 14-Day Free Trial',
            highlight: true,
            features: [
                'Everything in Free Community',
                'Advanced filtering (Pain score, frequency, status)',
                'Export problems & solutions to CSV & Markdown',
                'AI Problem & Solution Fit Analysis reports',
                'Unlimited saved searches & weekly alert digests',
                'Private unlisted problem drafts',
                'Verified Builder Profile Badge',
            ],
        },
        {
            name: 'Founder / Studio',
            badge: 'Product Strategy',
            priceMonthly: '$49',
            priceAnnual: '$39',
            period: 'per month',
            description: 'For founders, venture studios, and PMs doing rigorous market validation before building.',
            cta: 'Start Founder Trial',
            highlight: false,
            features: [
                'Everything in Pro Builder',
                'Automated Problem Validation Report generation (PDF)',
                'AI PRD (Product Requirement Doc) generator',
                'Opportunity discovery & market sizing insights',
                'Direct researcher outreach to validated problem authors',
                'Early access to trending problem surge alerts',
                'Priority ranking review eligibility',
            ],
        },
        {
            name: 'Business',
            badge: 'Enterprise & Teams',
            priceMonthly: '$149',
            priceAnnual: '$119',
            period: 'per month',
            description: 'For companies collecting internal employee pain points or customer product feedback.',
            cta: 'Contact Sales / Demo',
            highlight: false,
            features: [
                'Everything in Founder',
                'Private company-only problem spaces',
                'Internal employee problem submission portals',
                'Customer problem collection widgets',
                'REST API access & webhook integrations',
                'Dedicated account manager & custom SLA',
            ],
        },
    ];

    const faqs = [
        {
            q: 'Is the core community platform truly free?',
            a: 'Yes, 100%. Reading, submitting problems, discussing, and voting on solutions will always be completely free. We do not lock core community conversations behind a paywall.',
        },
        {
            q: 'What is the Problem Validation Report?',
            a: 'It is a structured research document summarizing all community validation responses, affected demographic data, pain level frequency, competing workarounds, and top solutions ready for executive presentations or investors.',
        },
        {
            q: 'Can I switch or cancel my plan anytime?',
            a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time with a single click in your settings.',
        },
        {
            q: 'How does annual billing work?',
            a: 'When you choose annual billing, you are billed once upfront for 12 months at a 20% discount compared to the month-to-month plan.',
        },
    ];

    return (
        <AppLayout>
            <Head title="Pricing Plans — Transparent SaaS & Founder Tools | PainPoint" />

            <div className="bg-white border-b border-slate-200/80 pt-12 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-3 inline-block">
                        Transparent Pricing
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Predictable plans for builders and founders
                    </h1>
                    <p className="text-base sm:text-lg text-slate-500 mt-3 max-w-2xl mx-auto">
                        Explore for free. Upgrade when you need deep AI research reports, exportable validation datasets, and market opportunity PRDs.
                    </p>

                    {/* Monthly / Annual Toggle */}
                    <div className="mt-8 flex items-center justify-center gap-3 text-sm">
                        <span className={`font-semibold ${!annual ? 'text-slate-900' : 'text-slate-500'}`}>
                            Monthly Billing
                        </span>
                        <button
                            type="button"
                            onClick={() => setAnnual(!annual)}
                            className="relative w-12 h-6 rounded-full bg-indigo-600 transition-colors focus:outline-none p-0.5"
                            aria-label="Toggle annual pricing"
                        >
                            <span
                                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                                    annual ? 'translate-x-6' : 'translate-x-0'
                                }`}
                            />
                        </button>
                        <span className={`font-semibold flex items-center gap-1.5 ${annual ? 'text-slate-900' : 'text-slate-500'}`}>
                            Annual Billing
                            <span className="px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                                Save 20%
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`flex flex-col justify-between bg-white rounded-2xl p-6 transition-all ${
                                plan.highlight
                                    ? 'border-2 border-indigo-600 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-600 relative'
                                    : 'border border-slate-200/80 hover:border-slate-300 shadow-xs'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {plan.name}
                                    </span>
                                    {plan.highlight && (
                                        <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                            {plan.badge}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                        {annual ? plan.priceAnnual : plan.priceMonthly}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        / {plan.period}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                                    {plan.description}
                                </p>

                                <div className="space-y-3 pt-6 border-t border-slate-100 text-xs">
                                    <span className="font-bold text-slate-900 block mb-1">Included:</span>
                                    {plan.features.map((feat) => (
                                        <div key={feat} className="flex items-start gap-2 text-slate-600">
                                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 mt-6 border-t border-slate-100">
                                <Button
                                    variant={plan.highlight ? 'primary' : 'outline'}
                                    size="md"
                                    className="w-full"
                                    onClick={() => {
                                        window.location.href = '/register';
                                    }}
                                >
                                    {plan.cta}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Everything you need to know about PainPoint plans and community guidelines.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                                <h4 className="text-sm font-bold text-slate-900 mb-2">
                                    {faq.q}
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
