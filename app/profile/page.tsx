import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth/actions'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { User, LogOut, Settings } from 'lucide-react'

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

    return (
        <div className="container py-12 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="bg-card border border-border rounded-xl p-8 space-y-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-3xl">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span>{user.email?.[0]?.toUpperCase()}</span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{profile?.full_name || 'Hunter'}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b border-border pb-2">Account Settings</h3>

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

                <form action={signOut}>
                    <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    )
}
