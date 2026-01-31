import { createClient } from '@/lib/supabase/server'
import { DetectedTool } from '@/lib/ai/video-analyzer'

interface ToolMatchResult {
    existingToolId?: string
    shouldCreate: boolean
    toolData: any
}

export async function matchOrCreateTool(
    detectedTool: DetectedTool
): Promise<ToolMatchResult> {
    const supabase = await createClient()

    // Try to find existing tool by name (case-insensitive)
    const { data: existingTools } = await supabase
        .from('tools')
        .select('*')
        .ilike('name', detectedTool.name)
        .limit(1)

    if (existingTools && existingTools.length > 0) {
        return {
            existingToolId: existingTools[0].id,
            shouldCreate: false,
            toolData: existingTools[0],
        }
    }

    // Tool doesn't exist, prepare data for creation
    const slug = generateSlug(detectedTool.name)

    return {
        shouldCreate: true,
        toolData: {
            name: detectedTool.name,
            slug,
            description: detectedTool.description,
            category: detectedTool.category,
            pricing_type: detectedTool.pricingType,
            use_cases: detectedTool.useCases,
            status: 'new_tool', // Mark as new for admin review
            website_url: `https://www.google.com/search?q=${encodeURIComponent(detectedTool.name + ' AI Tool')}`, // Placeholder
        },
    }
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

export async function createToolsFromDetected(
    detectedTools: DetectedTool[]
): Promise<{ created: any[]; existing: any[] }> {
    const supabase = await createClient()
    const created = []
    const existing = []

    for (const tool of detectedTools) {
        const match = await matchOrCreateTool(tool)

        if (match.shouldCreate) {
            const { data, error } = await supabase
                .from('tools')
                .insert(match.toolData)
                .select()
                .single()

            if (!error && data) {
                created.push(data)
            } else if (error) {
                console.error(`Failed to create tool ${tool.name}:`, error)
            }
        } else {
            existing.push(match.toolData)
        }
    }

    return { created, existing }
}
