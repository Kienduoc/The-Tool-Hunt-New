import { createClient } from '@/lib/supabase/server'
// import { Card } from '@/components/ui/card' // Removed

// ... usage replaced

import { Wrench, Video, FileText, Users, Eye, TrendingUp } from 'lucide-react'

// Fallback Card component if not imported
function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-muted-foreground">{title}</h3>
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="text-3xl font-bold">{value}</div>
        </div>
    )
}

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch stats concurrently
    const [
        { count: toolCount },
        { count: videoCount },
        { count: articleCount },
        { count: userCount },
        { data: recentTools }
    ] = await Promise.all([
        supabase.from('tools').select('*', { count: 'exact', head: true }),
        supabase.from('videos').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('tools').select('name, status, created_at').order('created_at', { ascending: false }).limit(5)
    ])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                <span className="text-muted-foreground">Welcome back, Admin</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Tools" value={toolCount || 0} icon={Wrench} color="bg-blue-500/10 text-blue-500" />
                <StatCard title="Videos" value={videoCount || 0} icon={Video} color="bg-red-500/10 text-red-500" />
                <StatCard title="Articles" value={articleCount || 0} icon={FileText} color="bg-green-500/10 text-green-500" />
                <StatCard title="Users" value={userCount || 0} icon={Users} color="bg-purple-500/10 text-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Recent Tools
                    </h2>
                    <div className="space-y-4">
                        {recentTools?.map((tool) => (
                            <div key={tool.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <span className="font-medium">{tool.name}</span>
                                <span className={`text-xs px-2 py-1 rounded-full border ${tool.status === 'hot_trend' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                    tool.status === 'new_tool' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                        'bg-muted text-muted-foreground'
                                    }`}>
                                    {tool.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
