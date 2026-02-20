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
        await supabase.rpc('decrement_hunt_count', { tool_id: toolId })

        revalidatePath('/the-hunt-is-on')
        revalidatePath('/hunted')
        return { hunted: false }
    } else {
        // Hunt
        await supabase.from('hunted_tools').insert({
            user_id: user.id,
            tool_id: toolId
        })
        await supabase.rpc('increment_hunt_count', { tool_id: toolId })

        revalidatePath('/the-hunt-is-on')
        revalidatePath('/hunted')
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
