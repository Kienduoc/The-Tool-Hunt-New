import { getVideos } from '@/lib/api/videos'
import VideoCard from '@/components/videos/VideoCard'
import CategoryFilter from '@/components/videos/CategoryFilter'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Hunt Like a Pro | The Tool Hunt',
    description: 'Master AI tools with expert video tutorials. Watch, learn, and hunt.',
}

export default async function HuntLikeAProPage({
    searchParams,
}: {
    searchParams: { category?: string }
}) {
    const videos = await getVideos(searchParams.category)

    return (
        <div className="container py-12">
            <div className="text-center mb-8 space-y-4">
                <h1 className="text-4xl font-bold">Hunt Like a Pro 🎓</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Deep dives, tutorials, and masterclasses on the latest AI tools.
                    Don&apos;t just find a tool—master it.
                </p>
            </div>

            <CategoryFilter />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>

            {videos.length === 0 && (
                <div className="text-center py-20 border 2 border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">No videos found yet. Initialize seed data to see content.</p>
                </div>
            )}
        </div>
    )
}
