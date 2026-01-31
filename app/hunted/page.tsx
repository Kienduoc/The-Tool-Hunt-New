import { getHuntedTools } from '@/lib/api/hunted'
import ToolCard from '@/components/tools/ToolCard'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'My Hunted Collection | The Tool Hunt',
    description: 'Your personal arsenal of AI tools.',
}

export default async function HuntedPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login?next=/hunted')
    }

    const huntedTools = await getHuntedTools()

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">My Hunted Collection 💼</h1>
                    <p className="text-muted-foreground">
                        You have hunted <span className="font-bold text-foreground">{huntedTools.length}</span> tools.
                    </p>
                </div>
                <Link href="/the-hunt-is-on">
                    <Button size="lg" variant="outline">Hunt More Tools</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {huntedTools.map((item) => (
                    <ToolCard key={item.tool.id} tool={item.tool} />
                ))}
            </div>

            {huntedTools.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card">
                    <div className="text-6xl mb-4">🕸️</div>
                    <h3 className="text-xl font-bold mb-2">Your collection is empty</h3>
                    <p className="text-muted-foreground mb-6">Start hunting for tools to build your arsenal.</p>
                    <Link href="/the-hunt-is-on">
                        <Button size="lg">Go Hunting</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
