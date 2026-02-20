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
    click_count: number
    created_at: string
}

export type ToolFilters = {
    category?: string
    pricing?: string
    status?: string
    search?: string
    sort?: string
}

export const getTools = cache(async (filters: ToolFilters = {}) => {
    const supabase = await createServerClient()

    // Determine sort order
    let orderColumn = 'created_at'
    let ascending = false
    if (filters.sort === 'popular') {
        orderColumn = 'view_count'
    } else if (filters.sort === 'most_hunted') {
        orderColumn = 'hunt_count'
    }

    let query = supabase
        .from('tools')
        .select('*')
        .order(orderColumn, { ascending })

    // Multi-value filter: category (comma-separated)
    if (filters.category && filters.category !== 'All') {
        const cats = filters.category.split(',')
        if (cats.length === 1) {
            query = query.eq('category', cats[0])
        } else {
            query = query.in('category', cats)
        }
    }

    // Multi-value filter: pricing (comma-separated)
    if (filters.pricing && filters.pricing !== 'All') {
        const pricings = filters.pricing.split(',').map(p => p.toLowerCase())
        if (pricings.length === 1) {
            query = query.eq('pricing_type', pricings[0])
        } else {
            query = query.in('pricing_type', pricings)
        }
    }

    // Multi-value filter: status (comma-separated)
    if (filters.status && filters.status !== 'All') {
        const statuses = filters.status.split(',')
        if (statuses.length === 1) {
            query = query.eq('status', statuses[0])
        } else {
            query = query.in('status', statuses)
        }
    }

    // Search in name and description
    if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
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

export const getAllCategories = cache(async () => {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('tools')
        // Fetch all columns to avoid potential issues with specific column selection
        .select('*')
        .order('category')

    if (error) {
        console.error('Error fetching categories:', JSON.stringify(error, null, 2))
        return []
    }

    // Extract unique non-null categories
    const categories = Array.from(new Set(data.map(item => item.category).filter(Boolean)))
    return categories as string[]
})
