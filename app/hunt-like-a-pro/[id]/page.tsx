import { getVideoBySlug } from '@/lib/api/videos'
import VideoPlayer from '@/components/videos/VideoPlayer'
import Link from 'next/link'
import { ArrowLeft, Clock, ExternalLink } from 'lucide-react'
import { notFound } from 'next/navigation'
import Button from '@/components/ui/Button'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const video = await getVideoBySlug(id)
    if (!video) return { title: 'Video Not Found' }
    return {
        title: `${video.title} | Hunt Like a Pro`,
        description: video.description,
    }
}

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const video = await getVideoBySlug(id)

    if (!video) {
        notFound()
    }

    return (
        <div className="container py-8 max-w-6xl">
            <Link href="/hunt-like-a-pro" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Tutorials
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Video & Details */}
                <div className="lg:col-span-2 space-y-8">
                    <VideoPlayer videoId={video.youtube_id} />

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">{video.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {Math.floor(video.duration / 60)} min
                            </span>
                            <span>•</span>
                            <span className="font-medium text-foreground">{video.channel_name}</span>
                            <span>•</span>
                            <span className="capitalize">{video.category}</span>
                        </div>

                        <div className="prose dark:prose-invert max-w-none p-6 bg-card rounded-xl border border-border">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                                {video.description}
                            </p>
                        </div>

                        {/* AI Summary Section */}
                        {video.ai_summary && (
                            <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <span className="text-xl">🤖</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-primary">AI Key Takeaways</h3>
                                </div>
                                <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="whitespace-pre-wrap leading-relaxed">{video.ai_summary}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Tools & Timestamps */}
                <div className="space-y-6">
                    {/* Featured Tools */}
                    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-xl">🛠️</span> Tools in this video
                        </h3>

                        {video.video_tools?.length > 0 ? (
                            <div className="space-y-4">
                                {video.video_tools.map(({ tools }) => (
                                    <div key={tools.slug} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                        <div className="w-10 h-10 bg-background rounded-lg border border-border flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {tools.logo_url ? (
                                                <img src={tools.logo_url} alt={tools.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold">{tools.name[0]}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium truncate">{tools.name}</h4>
                                            <Link href={`/the-hunt-is-on/${tools.slug}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                                                View Details <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </div>
                                        {/* Add to Hunted Button (Future) */}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No specific tools tagged.</p>
                        )}

                        <Link href="/the-hunt-is-on" className="block mt-4">
                            <Button variant="outline" className="w-full">Browse All Tools</Button>
                        </Link>
                    </div>

                    {/* Timestamps */}
                    {video.video_timestamps?.length > 0 && (
                        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="text-xl">⏱️</span> Timestamps
                            </h3>
                            <div className="space-y-1 relative">
                                {/* Timeline line */}
                                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border -z-10" />

                                {video.video_timestamps.map((ts) => (
                                    <button
                                        key={ts.timestamp}
                                        className="flex items-start gap-4 p-2 w-full text-left hover:bg-muted/50 rounded-lg group transition-colors"
                                    // onClick={() => seekTo(ts.timestamp)} // Needs client state interaction
                                    >
                                        <span className="w-10 text-xs font-mono bg-background border border-border rounded px-1.5 py-0.5 text-center shrink-0">
                                            {Math.floor(ts.timestamp / 60)}:{String(ts.timestamp % 60).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium group-hover:text-primary transition-colors">{ts.title}</p>
                                            {ts.description && (
                                                <p className="text-xs text-muted-foreground mt-0.5">{ts.description}</p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
