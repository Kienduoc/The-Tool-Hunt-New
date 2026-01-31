import { createClient } from '@/lib/supabase/server'
import { Users, Shield, UserCheck, Clock } from 'lucide-react'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    const adminCount = profiles?.filter(p => p.role === 'admin').length || 0
    const editorCount = profiles?.filter(p => p.role === 'editor').length || 0
    const userCount = profiles?.filter(p => p.role === 'user').length || 0

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Users Management</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                        <Shield className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Admins</p>
                        <p className="text-2xl font-bold">{adminCount}</p>
                    </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                        <UserCheck className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Editors</p>
                        <p className="text-2xl font-bold">{editorCount}</p>
                    </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                        <Users className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Users</p>
                        <p className="text-2xl font-bold">{userCount}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles?.map((profile) => (
                            <tr key={profile.id} className="border-b border-border hover:bg-muted/30">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                                            {profile.full_name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="font-medium">{profile.full_name || 'No name'}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                {profile.bio || 'No bio'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full border ${profile.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            profile.role === 'editor' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        }`}>
                                        {profile.role || 'user'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {profile.location || '—'}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {new Date(profile.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {profiles?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
