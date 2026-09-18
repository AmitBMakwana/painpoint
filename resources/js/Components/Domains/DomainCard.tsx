import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    Cpu, 
    Briefcase, 
    GraduationCap, 
    HeartPulse, 
    Coins, 
    Utensils, 
    Compass, 
    Leaf, 
    Car, 
    Home, 
    ShoppingBag, 
    Terminal, 
    TrendingUp, 
    Users, 
    CheckSquare, 
    Flame,
    ArrowUpRight
} from 'lucide-react';
import { Domain } from '../../types';

interface DomainCardProps {
    domain: Domain;
}

export function DomainCard({ domain }: DomainCardProps) {
    const getDomainIcon = (slug: string) => {
        switch (slug) {
            case 'ai-technology':
                return <Cpu className="w-5 h-5 text-indigo-600" />;
            case 'business':
                return <Briefcase className="w-5 h-5 text-blue-600" />;
            case 'education':
                return <GraduationCap className="w-5 h-5 text-emerald-600" />;
            case 'healthcare':
                return <HeartPulse className="w-5 h-5 text-rose-600" />;
            case 'finance':
                return <Coins className="w-5 h-5 text-amber-600" />;
            case 'food':
                return <Utensils className="w-5 h-5 text-orange-600" />;
            case 'travel':
                return <Compass className="w-5 h-5 text-teal-600" />;
            case 'environment':
                return <Leaf className="w-5 h-5 text-green-600" />;
            case 'developer-tools':
                return <Terminal className="w-5 h-5 text-violet-600" />;
            case 'productivity':
                return <CheckSquare className="w-5 h-5 text-sky-600" />;
            default:
                return <Cpu className="w-5 h-5 text-indigo-600" />;
        }
    };

    return (
        <Link
            href={`/domains/${domain.slug}`}
            className="group relative flex flex-col justify-between bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200"
        >
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {getDomainIcon(domain.slug)}
                    </div>
                    {domain.isTrending && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Trending
                        </span>
                    )}
                </div>

                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base mb-1.5 flex items-center justify-between">
                    <span>{domain.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {domain.description}
                </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{domain.problemsCount} problems</span>
                <span className="text-indigo-600 font-medium group-hover:underline">Explore domain</span>
            </div>
        </Link>
    );
}
