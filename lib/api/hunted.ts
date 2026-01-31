import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import { Tool } from '@/lib/api/tools'

export type HuntedTool = {
    hunted_at: string
    tool: Tool
}

export const getHuntedTools = cache(async () => {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('hunted_tools')
        .select(`
      created_at,
      tool:tools (*)
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching hunted tools:', error)
        return []
    }

    // Map to flat structure if needed, or keep nested
    // Returning as proper type
    return data.map((item: any) => ({
        hunted_at: item.created_at,
        tool: item.tool
    })) as HuntedTool[]
})
