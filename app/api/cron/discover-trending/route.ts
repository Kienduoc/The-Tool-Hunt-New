import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { discoverTrendingVideos } from '@/lib/ai/trending-agent'
import { analyzeVideo } from '@/lib/video-processor/pipeline'

// Vercel Cron: runs Mon & Fri at 8AM GMT+7 (1AM UTC)
export const maxDuration = 300

export async function GET(request: Request) {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    try {
        console.log('[CRON] Starting trending discovery...')

        // Step 1: Discover trending videos
        const trendingVideos = await discoverTrendingVideos(5)
        console.log(`[CRON] Found ${trendingVideos.length} trending videos`)

        const results = []

        // Step 2: Analyze each video with AI
        for (const video of trendingVideos) {
            try {
                console.log(`[CRON] Analyzing: ${video.title}`)
                const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`
                const analysis = await analyzeVideo(videoUrl)

                // Step 3: Save to pending_reviews
                const { data, error } = await supabase
                    .from('pending_reviews')
                    .insert({
                        type: 'video',
                        status: 'pending',
                        source: 'cron_trending',
                        raw_data: analysis,
                    })
                    .select()
                    .single()

                if (error) {
                    console.error(`[CRON] Failed to save review for ${video.title}:`, error)
                    results.push({ videoId: video.videoId, status: 'error', error: error.message })
                } else {
                    results.push({ videoId: video.videoId, status: 'queued', reviewId: data.id })
                }
            } catch (err: any) {
                console.error(`[CRON] Analysis failed for ${video.title}:`, err.message)
                results.push({ videoId: video.videoId, status: 'error', error: err.message })
            }
        }

        return NextResponse.json({
            success: true,
            discovered: trendingVideos.length,
            results,
            timestamp: new Date().toISOString(),
        })
    } catch (error: any) {
        console.error('[CRON] Discovery failed:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
