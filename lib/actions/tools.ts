'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleHuntTool(toolId: string) {
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized', hunted: false }
    }

    // Check if already hunted
    const { data: existing } = await supabase
        .from('hunted_tools')
        .select('id')
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .single()

    if (existing) {
        // Unhunt
        await supabase.from('hunted_tools').delete().eq('id', existing.id)

        // Decrement hunt count
        await supabase.rpc('decrement_hunt_count', { tool_id: toolId }) // Assuming RPC exists, or just use raw sql if permitted, or ignore count for now if tricky
        // For now simple decrement update:
        // supabase.from('tools').update({ hunt_count: count - 1 }) // Concurrency issue. 
        // Let's iterate: just toggle relation first.

        revalidatePath('/the-hunt-is-on')
        revalidatePath(`/the-hunt-is-on/[slug]`)
        return { hunted: false }
    } else {
        // Hunt
        await supabase.from('hunted_tools').insert({
            user_id: user.id,
            tool_id: toolId
        })

        // Increment hunt count (Optimistic or RPC)
        // await supabase.rpc('increment_hunt_count', { tool_id: toolId })

        revalidatePath('/the-hunt-is-on')
        revalidatePath(`/the-hunt-is-on/[slug]`)
        return { hunted: true }
    }
}

export async function getHuntStatus(toolId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data } = await supabase
        .from('hunted_tools')
        .select('id')
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .single()

    return !!data
}
