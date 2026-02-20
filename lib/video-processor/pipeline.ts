import { createClient } from '@/lib/supabase/server'
import { getVideoMetadata } from '@/lib/youtube/api'
import { getVideoTranscript, formatTranscriptForAI } from '@/lib/youtube/transcript'
import {
    analyzeVideoSummary,
    detectTimestamps,
    detectTools,
} from '@/lib/ai/video-analyzer'
import { createToolsFromDetected } from './tool-matcher'

interface ProcessingResult {
    videoId: string
    success: boolean
    error?: string
    data?: {
        video: any
        timestamps: any[]
        tools: {
            created: any[]
            existing: any[]
        }
    }
}

export async function analyzeVideo(videoUrl: string) {
    // Step 1: Extract video metadata
    console.log('Step 1: Extracting metadata...')
    const metadata = await getVideoMetadata(videoUrl)

    // Step 2: Get transcript
    console.log('Step 2: Fetching transcript...')
    let formattedTranscript = ''
    try {
        const transcript = await getVideoTranscript(metadata.videoId)
        formattedTranscript = formatTranscriptForAI(transcript)
    } catch (e) {
        console.warn('Transcript failed, proceeding without full transcript features')
        formattedTranscript = "Transcript unavailable."
    }

    // Step 3: AI Analysis - Summary
    console.log('Step 3: Analyzing video summary...')
    const summary = await analyzeVideoSummary(
        metadata.title,
        metadata.description,
        formattedTranscript
    )

    // Step 4: AI Analysis - Timestamps
    console.log('Step 4: Detecting timestamps...')
    const timestamps = await detectTimestamps(formattedTranscript)

    // Step 5: AI Analysis - Tools
    console.log('Step 5: Detecting tools...')
    const detectedTools = await detectTools(metadata.title, formattedTranscript)

    return {
        metadata,
        summary,
        timestamps,
        detectedTools
    }
}

export async function saveProcessedVideo(
    data: {
        metadata: any,
        summary: any,
        timestamps: any[],
        detectedTools: any[]
    },
    autoPublish: boolean = false
) {
    const supabase = await createClient()
    const { metadata, summary, timestamps, detectedTools } = data

    // Insert video record
    const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .insert({
            youtube_id: metadata.videoId,
            title: metadata.title,
            description: metadata.description,
            thumbnail_url: metadata.thumbnailUrl,
            channel_name: metadata.channelName,
            duration: metadata.duration,
            category: summary.category,
            ai_summary: summary.summary,
            ai_processing_status: 'completed',
            ai_processed_at: new Date().toISOString(),
            admin_approved: autoPublish,
        })
        .select()
        .single()

    if (videoError) throw videoError
    const videoDbId = videoData.id

    // Save timestamps
    const timestampInserts = timestamps.map((ts) => ({
        video_id: videoDbId,
        timestamp: ts.timestamp,
        title: ts.title,
        description: ts.description,
    }))

    if (timestampInserts.length > 0) {
        await supabase
            .from('video_timestamps')
            .insert(timestampInserts)
    }

    // Create or match tools
    const toolResults = await createToolsFromDetected(detectedTools)
    const allTools = [...toolResults.created, ...toolResults.existing]
    const uniqueToolIds = Array.from(new Set(allTools.map(t => t.id)))

    const videoToolLinks = uniqueToolIds.map((toolId) => ({
        video_id: videoDbId,
        tool_id: toolId,
    }))

    if (videoToolLinks.length > 0) {
        await supabase.from('video_tools').insert(videoToolLinks)
    }

    return {
        videoId: videoDbId,
        video: videoData,
        toolResults
    }
}

export async function processYouTubeVideo(
    videoUrl: string,
    autoPublish: boolean = false
): Promise<ProcessingResult> {
    try {
        const analysis = await analyzeVideo(videoUrl)
        const result = await saveProcessedVideo(analysis, autoPublish)

        return {
            videoId: result.videoId,
            success: true,
            data: {
                video: result.video,
                timestamps: analysis.timestamps,
                tools: result.toolResults,
            },
        }
    } catch (error: any) {
        console.error('Processing failed:', error)
        return {
            videoId: '',
            success: false,
            error: error.message,
        }
    }
}

async function logProcessingStep(
    videoId: string | null,
    step: string,
    status: string,
    data: any
) {
    if (!videoId) return
    const supabase = await createClient()
    await supabase.from('ai_processing_logs').insert({
        video_id: videoId,
        step,
        status,
        output_data: data
    })
}
