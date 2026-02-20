import { getVideoBySlug } from '@/lib/api/videos'
import VideoDetailClient from '@/components/videos/VideoDetailClient'
import Link from 'next/link'
import { ArrowLeft, Clock, Eye, Share2, MapPin } from 'lucide-react'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const video = await getVideoBySlug(id)
    if (!video) return { title: 'Video Not Found' }
    return {
        title: `${video.title} | Hunt Like a Pro`,
        description: video.description,
    }
}

function formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${m}:${String(s).padStart(2, '0')}`
}

function formatViews(count?: number) {
    if (!count) return null
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`
    return `${count} views`
}

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const video = await getVideoBySlug(id)

    if (!video) {
        notFound()
    }

    return (
        <div className="container py-8 max-w-6xl">
            {/* Back Button */}
            <Link
                href="/hunt-like-a-pro"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors px-4 py-2 rounded-full border border-border hover:border-primary/40 bg-card/50"
            >
                <ArrowLeft className="w-4 h-4" />
                Quay lại Hunt Like a Pro
            </Link>

            {/* ── Video Player + Tools Sidebar + Description (Client) ── */}
            <VideoDetailClient
                videoId={video.youtube_id}
                aiSummary={video.ai_summary}
                description={video.description}
                tools={video.video_tools}
            >
                {/* Category Tag + Title + Meta — rendered between video and description */}
                <div className="flex items-start justify-between mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                        {video.category}
                    </span>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
                    {video.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{video.channel_name}</span>
                        {formatViews(video.view_count) && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    {formatViews(video.view_count)}
                                </span>
                            </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDuration(video.duration)}
                        </span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-full hover:border-primary/40 hover:text-primary transition-colors bg-card/50">
                        <MapPin className="w-4 h-4" />
                        Ghim Video
                    </button>
                </div>
            </VideoDetailClient>
        </div>
    )
}
