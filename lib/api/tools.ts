import { createClient } from '@/lib/supabase/client'
import { cache } from 'react'
import { createClient as createServerClient } from '@/lib/supabase/server'

export type Tool = {
    id: string
    name: string
    slug: string
    description: string
    long_description: string | null
    logo_url: string | null
    website_url: string
    affiliate_url: string | null
    category: string
    pricing_type: string
    pricing_level: string | null
    status: string
    use_cases: string[]
    hunt_count: number
    view_count: number
    created_at: string
}

export type ToolFilters = {
    category?: string
    pricing?: string
    status?: string
    search?: string
}

export const getTools = cache(async (filters: ToolFilters = {}) => {
    const supabase = await createServerClient()

    let query = supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false })

    if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category)
    }

    if (filters.pricing && filters.pricing !== 'All') {
        query = query.eq('pricing_type', filters.pricing.toLowerCase())
    }

    if (filters.status && filters.status !== 'All') {
        // Convert friendly status to DB value if needed, or assume exact match
        // 'Hot' -> 'hot_trend', etc.
        // For now assuming direct mapping or managed by UI
        query = query.eq('status', filters.status)
    }

    if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching tools:', error)
        return []
    }

    return data as Tool[]
})

export const getToolBySlug = cache(async (slug: string) => {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching tool:', error)
        return null
    }

    return data as Tool
})

export const getRelatedTools = cache(async (category: string, currentSlug: string) => {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('category', category)
        .neq('slug', currentSlug)
        .limit(3)

    if (error) {
        console.error('Error fetching related tools:', error)
        return []
    }

    return data as Tool[]
})
