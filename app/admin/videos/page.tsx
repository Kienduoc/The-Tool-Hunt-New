import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Play } from 'lucide-react'
import Button from '@/components/ui/Button'

export default async function AdminVideosPage() {
    const supabase = await createClient()
    const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Videos</h1>
                <Link href="/admin/videos/processor">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add via AI Processor
                    </Button>
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-3">Thumbnail</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">AI Summary</th>
                            <th className="px-6 py-3">Tools</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos?.map((video) => (
                            <tr key={video.id} className="border-b border-border hover:bg-muted/30">
                                <td className="px-6 py-4 w-32">
                                    <div className="aspect-video bg-muted rounded overflow-hidden">
                                        {video.thumbnail_url && <img src={video.thumbnail_url} className="w-full h-full object-cover" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium max-w-xs truncate" title={video.title}>{video.title}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full border ${video.ai_processing_status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        video.ai_processing_status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {video.ai_processing_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 max-w-xs truncate text-muted-foreground">
                                    {video.ai_summary ? '✅ Generated' : '—'}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {/* Join needed to count, assume 0 for now to valid render */}
                                    —
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/hunt-like-a-pro`}>
                                        <Button variant="ghost" size="sm">
                                            <Play className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {videos?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                    No videos found. Use the AI Processor to add one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
