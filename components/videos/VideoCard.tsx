import Link from 'next/link'
import { Play, Clock } from 'lucide-react'
import { VideoWithTools } from '@/lib/api/videos'

export default function VideoCard({ video }: { video: VideoWithTools }) {
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return (
        <Link href={`/hunt-like-a-pro/${video.id}`} className="group block h-full">
            <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                    <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary-foreground fill-current ml-1" />
                        </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(video.duration)}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold px-2 py-1 bg-secondary/10 text-secondary rounded-full border border-secondary/20">
                            {video.category || 'Tutorial'}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{video.channel_name}</span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {video.title}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                        {video.description}
                    </p>

                    {/* Linked Tools */}
                    {video.video_tools && video.video_tools.length > 0 && (
                        <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                            <span className="text-xs text-muted-foreground font-medium">Tools:</span>
                            <div className="flex -space-x-2">
                                {video.video_tools.slice(0, 3).map((vt, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold overflow-hidden" title={vt.tools.name}>
                                        {vt.tools.logo_url ? (
                                            <img src={vt.tools.logo_url} alt={vt.tools.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="bg-muted w-full h-full flex items-center justify-center">{vt.tools.name[0]}</span>
                                        )}
                                    </div>
                                ))}
                                {video.video_tools.length > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground">
                                        +{video.video_tools.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
