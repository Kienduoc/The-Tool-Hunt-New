import { analyzeVideo } from '@/lib/video-processor/pipeline'
import { checkAdmin } from '@/lib/auth/admin'
import { NextResponse } from 'next/server'

export const maxDuration = 300 // Allow up to 5 minutes

export async function POST(request: Request) {
    await checkAdmin()

    const { videoUrl } = await request.json()

    if (!videoUrl) {
        return NextResponse.json({ error: 'Missing videoUrl' }, { status: 400 })
    }

    try {
        const analysis = await analyzeVideo(videoUrl)
        return NextResponse.json({ success: true, data: analysis })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
