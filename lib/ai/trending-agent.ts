import { createClient } from '@/lib/supabase/server'

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

const SEARCH_QUERIES = [
    'best AI tools 2025',
    'top AI productivity tools',
    'AI coding tools review',
    'AI video editing tools',
    'AI design tools comparison',
    'new AI tools this week',
]

export interface TrendingVideo {
    videoId: string
    title: string
    thumbnailUrl: string
    channelName: string
    publishedAt: string
    viewCount: number
    description: string
}

export async function discoverTrendingVideos(maxResults: number = 10): Promise<TrendingVideo[]> {
    if (!YOUTUBE_API_KEY) throw new Error('Missing YouTube API Key')

    const supabase = await createClient()

    // Get existing youtube_ids to avoid duplicates
    const { data: existingVideos } = await supabase
        .from('videos')
        .select('youtube_id')
    const existingIds = new Set((existingVideos || []).map(v => v.youtube_id))

    // Also check pending_reviews for videos already in queue
    const { data: pendingVideos } = await supabase
        .from('pending_reviews')
        .select('raw_data')
        .eq('type', 'video')
        .in('status', ['pending', 'approved'])
    const pendingIds = new Set(
        (pendingVideos || []).map(p => {
            try { return (p.raw_data as any)?.metadata?.videoId } catch { return null }
        }).filter(Boolean)
    )

    const allVideos: TrendingVideo[] = []

    // Search with 2 random queries to stay within quota
    const shuffled = SEARCH_QUERIES.sort(() => 0.5 - Math.random())
    const queries = shuffled.slice(0, 2)

    for (const query of queries) {
        try {
            // Step 1: Search for videos
            const searchRes = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&order=viewCount&maxResults=10&publishedAfter=${getDateWeekAgo()}&key=${YOUTUBE_API_KEY}`
            )
            const searchData = await searchRes.json()

            if (!searchData.items) continue

            // Step 2: Get video statistics for view count
            const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')
            const statsRes = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
            )
            const statsData = await statsRes.json()
            const statsMap = new Map(
                (statsData.items || []).map((item: any) => [item.id, item])
            )

            for (const item of searchData.items) {
                const videoId = item.id.videoId

                // Skip duplicates
                if (existingIds.has(videoId) || pendingIds.has(videoId)) continue

                const stats = statsMap.get(videoId) as any
                const viewCount = parseInt(stats?.statistics?.viewCount || '0')

                // Only include videos with decent engagement (>1000 views)
                if (viewCount < 1000) continue

                // Skip shorts (< 60 seconds)
                const durationStr = stats?.contentDetails?.duration || 'PT0S'
                const durationMatch = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
                const totalSeconds = (parseInt(durationMatch?.[1] || '0') * 3600) +
                    (parseInt(durationMatch?.[2] || '0') * 60) +
                    parseInt(durationMatch?.[3] || '0')
                if (totalSeconds < 60) continue

                allVideos.push({
                    videoId,
                    title: item.snippet.title,
                    thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
                    channelName: item.snippet.channelTitle,
                    publishedAt: item.snippet.publishedAt,
                    viewCount,
                    description: item.snippet.description,
                })
            }
        } catch (err) {
            console.error(`Search failed for query "${query}":`, err)
        }
    }

    // Sort by view count and return top N
    allVideos.sort((a, b) => b.viewCount - a.viewCount)
    return allVideos.slice(0, maxResults)
}

function getDateWeekAgo(): string {
    const date = new Date()
    date.setDate(date.getDate() - 14) // Look back 2 weeks
    return date.toISOString()
}
