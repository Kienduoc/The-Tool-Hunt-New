import { processYouTubeVideo } from '@/lib/video-processor/pipeline'
import { checkAdmin } from '@/lib/auth/admin'
import { NextResponse } from 'next/server'

export const maxDuration = 300 // Allow up to 5 minutes for processing

export async function POST(request: Request) {
    // Ensure Admin
    await checkAdmin()

    const { videoUrl, autoPublish } = await request.json()

    if (!videoUrl) {
        return NextResponse.json({ error: 'Missing videoUrl' }, { status: 400 })
    }

    // Handle processing
    // Ideally this should be a background job (Bull/Inngest). For now, we await it or trust Vercel timeout (using maxDuration 300s)
    // Or start it and return 'processing started' if we have a way to async context.
    // Next.js App Router API routes can run async.

    const result = await processYouTubeVideo(videoUrl, autoPublish)

    if (!result.success) {
        return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
}
