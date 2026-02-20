
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// Use service role key if available to bypass RLS, otherwise generic key (ensure RLS allows insert)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

// Generic/Common words to exclude from auto-tagging to prevent false positives
const BLACKLIST_TOOLS = [
    'Make', 'Pi', 'You', 'Ada', 'Poe', 'Data', 'Design', 'Video', 'Audio', 'Image', 'Chat', 'Writer', 'Search', 'Music', 'Voice', 'Bloom', 'Scribe', 'Copy', 'Hero', 'Canvas', 'Pixel', 'Studio', 'Create', 'Genius', 'Magic', 'Box', 'Flow', 'Spark', 'Synthesia' // Synthesia is a tool but also a condition? No, Synthesia is specific enough.
]
// Let's refine the blacklist based on checking common English words vs tool names.
const GENERIC_BLACKLIST = new Set([
    'make', 'pi', 'you', 'ada', 'poe', 'data', 'design', 'video', 'audio', 'image', 'chat', 'writer', 'search', 'music', 'voice', 'bloom', 'scribe', 'copy', 'hero', 'canvas', 'pixel', 'studio', 'create', 'genius', 'magic', 'box', 'flow', 'spark', 'date', 'time', 'moment', 'day', 'week', 'month', 'year'
])

async function autoTagVideos() {
    console.log('🚀 Starting auto-tagging of videos...')

    // 1. Fetch all tools
    const { data: tools, error: toolsError } = await supabase
        .from('tools')
        .select('id, name, slug')

    if (toolsError) {
        console.error('Error fetching tools:', toolsError)
        return
    }

    // Filter out blacklisted tools or short names that are not specific
    const validTools = tools.filter(t => {
        const nameLower = t.name.toLowerCase()
        if (t.name.length < 3) return false
        if (GENERIC_BLACKLIST.has(nameLower)) return false
        return true
    })

    console.log(`Loaded ${validTools.length} valid tools for tagging (excluding ${tools.length - validTools.length} generic/short names).`)

    // 2. Fetch all videos
    const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('id, title, description')

    if (videosError) {
        console.error('Error fetching videos:', videosError)
        return
    }

    console.log(`Loaded ${videos.length} videos.`)

    let totalTags = 0
    let taggedVideoCount = 0

    // 3. Iterate videos and find matches
    for (const video of videos) {
        const text = `${video.title} ${video.description || ''}`.toLowerCase()
        const matchedTools = []

        for (const tool of validTools) {
            // Check for exact name match (case-insensitive)
            // Use regex to ensure word boundary
            const toolName = tool.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex special chars
            const regex = new RegExp(`\\b${toolName}\\b`, 'i')

            if (regex.test(text)) {
                matchedTools.push(tool)
            }
        }

        if (matchedTools.length > 0) {
            console.log(`\n📹 Video: "${video.title}" matched: ${matchedTools.map(t => t.name).join(', ')}`)

            // Generate SQL for insertion
            const values = matchedTools.map(tool => `('${video.id}', '${tool.id}')`).join(',\n')

            console.log(`\n-- SQL for Video: "${video.title}"`)
            console.log(`INSERT INTO video_tools (video_id, tool_id) VALUES \n${values}\nON CONFLICT (video_id, tool_id) DO NOTHING;`)

            totalTags += matchedTools.length
            taggedVideoCount++
        }
    }

    console.log(`\n-- ✅ Generated SQL for ${taggedVideoCount} videos with ${totalTags} tool associations.`)
}

autoTagVideos()
