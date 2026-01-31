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

export async function processYouTubeVideo(
    videoUrl: string,
    autoPublish: boolean = false
): Promise<ProcessingResult> {
    const supabase = await createClient()
    let videoDbId: string | null = null

    try {
        // Check if video already exists to avoid duplicates (optional, or fail)
        // For now proceed (might insert duplicate or fail on constraint if youtube_id unique)

        // Step 1: Extract video metadata
        console.log('Step 1: Extracting metadata...')
        const metadata = await getVideoMetadata(videoUrl)

        // Check constraint here if needed

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

        // Insert preliminary video record to get ID for logging
        const { data: videoData, error: videoError } = await supabase
            .from('videos')
            .insert({
                youtube_id: metadata.videoId,
                title: metadata.title,
                description: metadata.description,
                thumbnail_url: metadata.thumbnailUrl,
                channel_name: metadata.channelName,
                duration: metadata.duration,
                ai_processing_status: 'processing',
            })
            .select()
            .single()

        if (videoError) throw videoError
        videoDbId = videoData.id

        await logProcessingStep(videoDbId, 'metadata', 'completed', { metadata })

        // Step 3: AI Analysis - Summary
        console.log('Step 3: Analyzing video summary...')
        const summary = await analyzeVideoSummary(
            metadata.title,
            metadata.description,
            formattedTranscript
        )

        await logProcessingStep(videoDbId, 'summary', 'completed', { summary })

        // Step 4: AI Analysis - Timestamps
        console.log('Step 4: Detecting timestamps...')
        const timestamps = await detectTimestamps(formattedTranscript)

        await logProcessingStep(videoDbId, 'timestamps', 'completed', {
            timestampCount: timestamps.length,
        })

        // Step 5: AI Analysis - Tools
        console.log('Step 5: Detecting tools...')
        const detectedTools = await detectTools(metadata.title, formattedTranscript)

        await logProcessingStep(videoDbId, 'tools', 'completed', {
            toolCount: detectedTools.length,
        })

        // Step 6: Update video with AI results
        console.log('Step 6: Updating database...')
        const { error: updateError } = await supabase
            .from('videos')
            .update({
                category: summary.category,
                ai_summary: summary.summary,
                ai_processing_status: 'completed',
                ai_processed_at: new Date().toISOString(),
                admin_approved: autoPublish,
            })
            .eq('id', videoDbId)

        if (updateError) throw updateError

        // Step 7: Save timestamps
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
                .select()
        }

        // Step 8: Create or match tools
        const toolResults = await createToolsFromDetected(detectedTools)

        // Step 9: Link tools to video
        const allTools = [...toolResults.created, ...toolResults.existing]
        // Filter out duplicates if any
        const uniqueToolIds = Array.from(new Set(allTools.map(t => t.id)))

        const videoToolLinks = uniqueToolIds.map((toolId) => ({
            video_id: videoDbId,
            tool_id: toolId,
        }))

        if (videoToolLinks.length > 0) {
            await supabase.from('video_tools').insert(videoToolLinks)
        }

        return {
            videoId: videoDbId!,
            success: true,
            data: {
                video: videoData,
                timestamps: timestamps || [],
                tools: toolResults,
            },
        }
    } catch (error: any) {
        console.error('Processing failed:', error)

        if (videoDbId) {
            await logProcessingStep(videoDbId, 'pipeline', 'failed', { error: error.message })
            await supabase
                .from('videos')
                .update({
                    ai_processing_status: 'failed',
                    ai_error: error.message,
                })
                .eq('id', videoDbId)
        }

        return {
            videoId: videoDbId || '',
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
