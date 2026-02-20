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

    return data.map((item: any) => ({
        hunted_at: item.created_at,
        tool: item.tool
    })) as HuntedTool[]
})

export const getHuntedToolIds = cache(async (): Promise<Set<string>> => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Set()

    const { data, error } = await supabase
        .from('hunted_tools')
        .select('tool_id')
        .eq('user_id', user.id)

    if (error) return new Set()
    return new Set(data.map((item: any) => item.tool_id))
})

export const getHuntedCount = cache(async (): Promise<number> => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { count, error } = await supabase
        .from('hunted_tools')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)

    if (error) return 0
    return count ?? 0
})
