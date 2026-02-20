import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth/actions'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { User, LogOut, Settings } from 'lucide-react'
import { getHuntedTools } from '@/lib/api/hunted'
import ActivityHeatmap from '@/components/profile/ActivityHeatmap'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch profile details
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch hunted tools for stats
    const huntedTools = await getHuntedTools()

    // Prepare data for Heatmap
    const huntDates = huntedTools.map(item => item.hunted_at)

    // Prepare data for Skill Mapping (Category Stats)
    const categoryStats = huntedTools.reduce((acc, item) => {
        const category = item.tool.category || 'Uncategorized'
        acc[category] = (acc[category] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const sortedCategories = Object.entries(categoryStats)
        .sort(([, a], [, b]) => b - a)

    return (
        <div className="container py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Profile Content */}
                <div className="md:col-span-2 space-y-8">

                    {/* Activity Heatmap Card */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <ActivityHeatmap
                            dates={huntDates}
                            totalHunts={huntedTools.length}
                            title="tools hunted"
                        />
                    </div>

                    {/* Skill Mapping Card */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <span>🎯</span> Skill Mapping
                        </h3>
                        <div className="space-y-3">
                            {sortedCategories.length > 0 ? (
                                sortedCategories.map(([category, count]) => {
                                    const percentage = Math.round((count / huntedTools.length) * 100)
                                    return (
                                        <div key={category} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{category}</span>
                                                <span className="text-muted-foreground">{count} tools ({percentage}%)</span>
                                            </div>
                                            <div className="h-2 bg-secondary/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-muted-foreground text-sm">Hunt tools to see your skill mapping!</p>
                            )}
                        </div>
                    </div>

                    {/* Hunted Collection Link (Previous content) */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <div className="grid gap-4">
                            <Link href="/hunted" className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                        <span className="text-xl">💼</span>
                                    </div>
                                    <span className="font-medium">My Hunted Collection</span>
                                </div>
                                <span className="text-muted-foreground group-hover:text-primary">→</span>
                            </Link>

                            <button disabled className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border opacity-60 cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-muted text-muted-foreground rounded-lg">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">Preferences (Coming Soon)</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar / User Info */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6 sticky top-24">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-4xl border-4 border-background shadow-lg">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span>{user.email?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{profile?.full_name || 'Hunter'}</h2>
                                <p className="text-muted-foreground text-sm">{user.email}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-3 bg-secondary/5 rounded-lg">
                                    <div className="text-2xl font-bold text-primary">{huntedTools.length}</div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Hunted</div>
                                </div>
                                <div className="p-3 bg-secondary/5 rounded-lg">
                                    <div className="text-2xl font-bold text-primary">{sortedCategories.length}</div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Skills</div>
                                </div>
                            </div>
                        </div>

                        <form action={signOut} className="pt-2">
                            <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
