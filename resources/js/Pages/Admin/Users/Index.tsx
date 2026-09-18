import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '../../../Layouts/AdminLayout';
import { 
    Users, 
    Search, 
    Shield, 
    Edit2, 
    Trash2, 
    X, 
    Check, 
    Award, 
    Star, 
    FileText, 
    Lightbulb, 
    ThumbsUp,
    ShieldAlert,
    UserCheck,
    Mail
} from 'lucide-react';
import { Button } from '../../../Components/UI/Button';

interface UserItem {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    reputation: number;
    points: number;
    headline?: string;
    problems_count: number;
    solutions_count: number;
    supports_count: number;
    created_at: string;
}

interface UsersIndexProps {
    users: {
        data: UserItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: any[];
    };
    filters: {
        role: string;
        search: string;
    };
    availableRoles: string[];
    metrics: {
        total_users: number;
        admins_count: number;
        members_count: number;
    };
}

export default function AdminUsersIndex({
    users,
    filters,
    availableRoles,
    metrics,
}: UsersIndexProps) {
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    // Edit form state
    const [editRole, setEditRole] = useState('');
    const [editPoints, setEditPoints] = useState<number>(0);
    const [editReputation, setEditReputation] = useState<number>(0);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', {
            role: selectedRole,
            search: searchQuery,
        }, { preserveState: true });
    };

    const handleRoleFilterChange = (role: string) => {
        setSelectedRole(role);
        router.get('/admin/users', {
            role,
            search: searchQuery,
        }, { preserveState: true });
    };

    const openEditModal = (user: UserItem) => {
        setEditingUser(user);
        setEditRole(user.role || 'Community Member');
        setEditPoints(user.points || 0);
        setEditReputation(user.reputation || 0);
    };

    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        router.put(`/admin/users/${editingUser.id}`, {
            role: editRole,
            points: editPoints,
            reputation: editReputation,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingUser(null);
            },
        });
    };

    const handleDeleteUser = (user: UserItem) => {
        if (confirm(`Are you sure you want to delete user ${user.name} (${user.email})? This action cannot be undone.`)) {
            router.delete(`/admin/users/${user.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout
            title="User Management & Role Permissions"
            subtitle="Oversee community members, grant admin and moderator privileges, and audit user participation."
        >
            <Head title="User Management — PainPoint Admin" />

            {/* Metrics KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Registered</div>
                        <div className="text-2xl font-black text-slate-900">{metrics.total_users}</div>
                        <div className="text-[10px] text-slate-400">All registered platform accounts</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Staff & Admins</div>
                        <div className="text-2xl font-black text-slate-900">{metrics.admins_count}</div>
                        <div className="text-[10px] text-slate-400">Super Admins & Moderators</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Community Members</div>
                        <div className="text-2xl font-black text-slate-900">{metrics.members_count}</div>
                        <div className="text-[10px] text-slate-400">Active innovators & problem submitters</div>
                    </div>
                </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                
                {/* Role Filter Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Filter Role:</span>
                    <select
                        value={selectedRole}
                        onChange={(e) => handleRoleFilterChange(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 shadow-2xs"
                    >
                        <option value="all">All Roles ({metrics.total_users})</option>
                        {availableRoles.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="relative sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name, email, handle..."
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-900 outline-none focus:border-indigo-500 shadow-2xs placeholder-slate-400"
                    />
                </form>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                <th className="py-3.5 px-4 sm:px-6">User / Identity</th>
                                <th className="py-3.5 px-4">Role & Privilege</th>
                                <th className="py-3.5 px-4">Reputation & Points</th>
                                <th className="py-3.5 px-4">Activity Stats</th>
                                <th className="py-3.5 px-4">Joined</th>
                                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.data.length > 0 ? (
                                users.data.map((u) => {
                                    const isAdminRole = u.role?.toLowerCase().includes('admin') || u.role?.toLowerCase().includes('moderator');
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                                                            {u.name}
                                                            {isAdminRole && (
                                                                <Shield className="w-3.5 h-3.5 text-indigo-600 fill-indigo-100" />
                                                            )}
                                                        </div>
                                                        <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                                                            <Mail className="w-3 h-3 text-slate-400" /> {u.email}
                                                        </div>
                                                        {u.headline && (
                                                            <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{u.headline}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                                                    u.role === 'Super Admin'
                                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                        : u.role === 'Admin'
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                        : u.role === 'Moderator'
                                                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                }`}>
                                                    {u.role || 'Community Member'}
                                                </span>
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-extrabold text-amber-600 flex items-center gap-1 text-xs">
                                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                                        {u.points || 0} pts
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        Reputation: {u.reputation || 0}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3 text-[11px] text-slate-600">
                                                    <span title="Submitted Problems" className="flex items-center gap-1 font-semibold">
                                                        <FileText className="w-3.5 h-3.5 text-indigo-500" /> {u.problems_count}
                                                    </span>
                                                    <span title="Proposed Solutions" className="flex items-center gap-1 font-semibold">
                                                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> {u.solutions_count}
                                                    </span>
                                                    <span title="Supported Problems" className="flex items-center gap-1 font-semibold">
                                                        <ThumbsUp className="w-3.5 h-3.5 text-rose-500" /> {u.supports_count}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 text-slate-500 text-[11px]">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(u)}
                                                        className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 transition-colors"
                                                        title="Edit Role & Permissions"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUser(u)}
                                                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                                        No users found matching this filter criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links && users.links.length > 3 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                            Showing page {users.current_page} of {users.last_page} ({users.total} users)
                        </div>
                        <div className="flex items-center gap-1">
                            {users.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : link.url
                                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                            : 'text-slate-400 cursor-not-allowed opacity-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* EDIT USER ROLE & POINTS MODAL */}
            {editingUser && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-900">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                                    Manage User Access
                                </span>
                                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                                    {editingUser.name}
                                </h3>
                                <p className="text-xs text-slate-500">{editingUser.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Assigned System Role
                                </label>
                                <select
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500"
                                >
                                    {availableRoles.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Reputation Points
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editPoints}
                                        onChange={(e) => setEditPoints(parseInt(e.target.value) || 0)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Reputation Score
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editReputation}
                                        onChange={(e) => setEditReputation(parseInt(e.target.value) || 0)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingUser(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                >
                                    Save Role & Permissions
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
