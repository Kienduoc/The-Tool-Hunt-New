import { YoutubeTranscript } from 'youtube-transcript'

export interface TranscriptSegment {
    text: string
    start: number // seconds
    duration: number
}

// Ensure YoutubeTranscript is properly handled if it doesn't have default export types in some versions
// But assuming standard usage from docs

export async function getVideoTranscript(
    videoId: string
): Promise<TranscriptSegment[]> {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId)

        return transcript.map((segment: any) => ({
            text: segment.text,
            start: Math.floor(segment.offset / 1000), // Convert ms to seconds
            duration: Math.floor(segment.duration / 1000),
        }))
    } catch (error) {
        console.error('Failed to fetch transcript:', error)
        throw new Error('Transcript not available for this video')
    }
}

export function formatTranscriptForAI(
    segments: TranscriptSegment[]
): string {
    // Limit to roughly 1 hour or reasonable context size if needed
    // For now return full, but pipeline might truncate
    return segments
        .map((seg) => {
            const timestamp = formatTimestamp(seg.start)
            return `[${timestamp}] ${seg.text}`
        })
        .join('\n')
}

function formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
}
