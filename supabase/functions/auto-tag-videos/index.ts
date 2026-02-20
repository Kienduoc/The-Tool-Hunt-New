
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Parse webhook payload
        const { record, type, table } = await req.json()

        // Only process INSERT or UPDATE on videos table
        if (table !== 'videos') {
            return new Response('Ignored', { headers: corsHeaders })
        }

        const video = record
        if (!video || !video.title) {
            return new Response('No video data', { headers: corsHeaders })
        }

        console.log(`Processing video: ${video.id} - ${video.title}`)

        // 1. Fetch all tools (cached or fresh)
        // For simplicity, we fetch fresh. In high volume, we'd cache.
        const { data: tools, error: toolsError } = await supabase
            .from('tools')
            .select('id, name')

        if (toolsError) {
            console.error('Error fetching tools:', toolsError)
            return new Response('Error fetching tools', { status: 500, headers: corsHeaders })
        }

        // Generic blacklist (lowercase)
        const GENERIC_BLACKLIST = new Set([
            'make', 'pi', 'you', 'ada', 'poe', 'data', 'design', 'video', 'audio', 'image',
            'chat', 'writer', 'search', 'music', 'voice', 'bloom', 'scribe', 'copy',
            'hero', 'canvas', 'pixel', 'studio', 'create', 'genius', 'magic', 'box',
            'flow', 'spark', 'date', 'time', 'moment', 'day', 'week', 'month', 'year'
        ])

        // Filter valid tools
        const validTools = tools.filter((t: any) => {
            const nameLower = t.name.toLowerCase()
            if (t.name.length < 3) return false
            if (GENERIC_BLACKLIST.has(nameLower)) return false
            return true
        })

        // 2. Scan text
        const text = `${video.title} ${video.description || ''} ${video.ai_summary || ''}`.toLowerCase()
        const matchedTools = []

        for (const tool of validTools) {
            const toolName = tool.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const regex = new RegExp(`\\b${toolName}\\b`, 'i')
            if (regex.test(text)) {
                matchedTools.push(tool)
            }
        }

        if (matchedTools.length > 0) {
            console.log(`Matched tools: ${matchedTools.map(t => t.name).join(', ')}`)

            const inserts = matchedTools.map(tool => ({
                video_id: video.id,
                tool_id: tool.id
            }))

            // 3. Insert tags
            const { error: insertError } = await supabase
                .from('video_tools')
                .upsert(inserts, { onConflict: 'video_id, tool_id', ignoreDuplicates: true })

            if (insertError) {
                console.error('Error inserting tags:', insertError)
                return new Response('Error inserting tags', { status: 500, headers: corsHeaders })
            }
        } else {
            console.log('No tools matched.')
        }

        return new Response(JSON.stringify({ success: true, matched: matchedTools.length }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
