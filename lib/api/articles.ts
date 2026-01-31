import { createClient } from '@/lib/supabase/client'
import { cache } from 'react'
import { createClient as createServerClient } from '@/lib/supabase/server'

export type Article = {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    cover_image_url: string | null
    author_id: string
    category: string
    tags: string[]
    published: boolean
    published_at: string
    view_count: number
    created_at: string
    author?: {
        full_name: string
        avatar_url: string
    }
}

export const getArticles = cache(async (category?: string) => {
    const supabase = await createServerClient()

    let query = supabase
        .from('articles')
        .select(`
      *,
      author:profiles(full_name, avatar_url)
    `)
        .eq('published', true)
        .order('published_at', { ascending: false })

    if (category && category !== 'All') {
        query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching articles:', error)
        return []
    }

    return data as Article[]
})

export const getArticleBySlug = cache(async (slug: string) => {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('articles')
        .select(`
      *,
      author:profiles(full_name, avatar_url)
    `)
        .eq('slug', slug)
        .eq('published', true)
        .single()

    if (error) {
        console.error('Error fetching article:', error)
        return null
    }

    return data as Article
})

export const getRecentArticles = cache(async (limit = 3) => {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('articles')
        .select(`
      *,
      author:profiles(full_name, avatar_url)
    `)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching recent articles:', error)
        return []
    }

    return data as Article[]
})
