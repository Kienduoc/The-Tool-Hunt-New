import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ toolId: string }> }
) {
    const supabase = await createClient()
    const { toolId } = await params

    // 1. Get tool destination URL
    const { data: tool } = await supabase
        .from('tools')
        .select('website_url, affiliate_url')
        .eq('id', toolId) // Attempt lookup by UUID
        .single()

    // If not found by ID, try slug? usually ID is safer for API routes.
    // If using slug in URL `go/[slug]`, we'd query by slug.
    // Let's assume toolId is UUID. If it fails, maybe check slug as fallback (optional)

    if (!tool) {
        return new Response('Tool not found', { status: 404 })
    }

    const destination = tool.affiliate_url || tool.website_url

    // 2. Log the click (async, fire and forget)
    // We can use `after` in Next.js 15, or just await it if fast enough. 
    // For Supabase, simple insert is fast.
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'

    // Note: We need a 'clicks' table or just increment a counter.
    // Schema might not have `affiliate_clicks` table yet.
    // I'll assume we just increment `view_count` on the tool for now or create a log if table exists.
    // Let's just increment `view_count` for simplicity in MVP.

    // RPC or direct update
    // Check if rpc exists or just direct update
    // We created RPC in migration 05
    try {
        await supabase.rpc('increment_view_count', { tool_id: toolId })
    } catch (e) {
        console.error('Failed to increment view count', e)
    }

    // 3. Redirect
    redirect(destination)
}
