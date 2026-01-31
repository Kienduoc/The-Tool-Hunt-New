export interface YouTubeVideoMetadata {
    videoId: string
    title: string
    description: string
    thumbnailUrl: string
    channelName: string
    duration: number // in seconds
    publishedAt: string
}

export async function getVideoMetadata(
    videoUrl: string
): Promise<YouTubeVideoMetadata> {
    const videoId = extractVideoId(videoUrl)

    if (!videoId) {
        throw new Error('Invalid YouTube URL')
    }

    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    if (!apiKey) {
        throw new Error('Missing YouTube API Key')
    }

    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`
    )

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
        throw new Error('Video not found')
    }

    const video = data.items[0]

    // Handle maxres thumbnail if available, else high
    const thumb = video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url

    return {
        videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnailUrl: thumb,
        channelName: video.snippet.channelTitle,
        duration: parseDuration(video.contentDetails.duration),
        publishedAt: video.snippet.publishedAt,
    }
}

function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }

    return null
}

function parseDuration(isoDuration: string): number {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return 0

    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')

    return hours * 3600 + minutes * 60 + seconds
}
