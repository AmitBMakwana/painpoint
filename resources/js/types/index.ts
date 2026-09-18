export interface User {
    id: number;
    name: string;
    avatar?: string;
    role?: string;
    reputation: number;
    problemsCount?: number;
    solutionsCount?: number;
}

export interface Domain {
    id: number;
    slug: string;
    name: string;
    description: string;
    icon: string;
    problemsCount: number;
    isTrending?: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    domainId: number;
}

export interface ValidationSummary {
    totalYes: number;
    totalNo: number;
    percentage: number;
    userVote?: 'yes' | 'no' | null;
    frequencyBreakdown: {
        daily: number;
        weekly: number;
        monthly: number;
        rarely: number;
    };
    averagePainLevel: number; // 1 to 5
}

export interface AISignal {
    summary?: string;
    category?: string;
    audience?: string;
    tags?: string[];
    frequencySignal?: string;
    problemFitScore?: number; // 0-100
    problemFitSummary?: string;
    implementationComplexity?: 'Low' | 'Medium' | 'High';
    potentialImpact?: 'Moderate' | 'High' | 'Transformative';
}

export interface Problem {
    id: number;
    slug: string;
    title: string;
    summary: string;
    description?: string;
    domain: {
        slug: string;
        name: string;
    };
    category: string;
    tags: string[];
    author: User;
    createdAt: string;
    affectedCount: number;
    solutionsCount: number;
    discussionsCount: number;
    viewsCount: number;
    isTrending?: boolean;
    status: 'New' | 'Validating' | 'Active Discussion' | 'High Interest' | 'Solution Rich' | 'Community Validated' | 'Solved';
    validation: ValidationSummary;
    targetAudience?: string;
    frequency?: string;
    painLevel?: number;
    currentAlternatives?: string;
    whyItMatters?: string;
    aiAnalysis?: AISignal;
}

export interface Solution {
    id: number;
    problemId: number;
    slug: string;
    title: string;
    author: User;
    summary: string;
    description?: string;
    solutionType: 'SaaS' | 'Mobile App' | 'AI' | 'Process' | 'Service' | 'Hardware' | 'Marketplace' | 'Other';
    tags: string[];
    votesCount: number;
    hasVoted?: boolean;
    helpfulVotesCount: number;
    commentsCount: number;
    rank?: number; // 1, 2, 3 for Top 3
    aiFitScore?: number;
    aiFitAnalysis?: string;
    implementationDifficulty?: 'Easy' | 'Moderate' | 'Challenging';
    estimatedCost?: string;
    createdAt: string;
}

export interface Comment {
    id: number;
    problemId: number;
    author: User;
    content: string;
    createdAt: string;
    helpfulVotes: number;
    hasVotedHelpful?: boolean;
    parentId?: number | null;
    replies?: Comment[];
}

export interface Stats {
    problems: string;
    solutions: string;
    votes: string;
    activeUsers: string;
}
