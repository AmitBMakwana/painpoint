import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Layers, Search, ArrowRight, Flame } from 'lucide-react';
import { AppLayout } from '../../Components/Layout/AppLayout';
import { DomainCard } from '../../Components/Domains/DomainCard';
import { mockDomains } from '../../data/mockData';

export default function DomainsIndex() {
    const [search, setSearch] = useState('');

    const filteredDomains = mockDomains.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase()) || 
        d.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="Browse Problem Domains — PainPoint" />

            <div className="bg-white border-b border-slate-200/80 pt-10 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="max-w-2xl">
                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 mb-2 inline-block">
                                Topic Directory
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Explore by Domain
                            </h1>
                            <p className="text-sm sm:text-base text-slate-500 mt-2">
                                Browse problem spaces organized into distinct market verticals, from education and healthcare to developer tooling and sustainable logistics.
                            </p>
                        </div>

                        {/* Domain Search Filter */}
                        <div className="w-full md:w-72 relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Filter domains..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredDomains.map(domain => (
                        <DomainCard key={domain.id} domain={domain} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
