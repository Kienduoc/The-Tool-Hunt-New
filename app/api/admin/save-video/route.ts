import { saveProcessedVideo } from '@/lib/video-processor/pipeline'
import { checkAdmin } from '@/lib/auth/admin'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(request: Request) {
    await checkAdmin()

    const { data, autoPublish } = await request.json()

    if (!data) {
        return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    try {
        const result = await saveProcessedVideo(data, autoPublish)
        return NextResponse.json({ success: true, data: result })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
