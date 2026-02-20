import { createClient } from '@/lib/supabase/client'
import { cache } from 'react'
import { createClient as createServerClient } from '@/lib/supabase/server'

export type VideoWithTools = {
  id: string
  youtube_id: string
  title: string
  description: string
  thumbnail_url: string
  duration: number
  category: string
  channel_name: string
  ai_summary: string | null
  view_count?: number
  created_at: string
  video_tools: {
    tools: {
      name: string
      slug: string
      logo_url: string | null
      description?: string | null
      category?: string
      pricing_type?: string
      use_cases?: string[]
      website_url?: string
      affiliate_url?: string | null
    }
  }[]
  video_timestamps: {
    timestamp: number
    title: string
    description: string | null
  }[]
}

// Ensure the function is cached for the request duration
export const getVideos = cache(async (category?: string) => {
  const supabase = await createServerClient()

  let query = supabase
    .from('videos')
    .select(`
      *,
      video_tools (
        tools (
          name,
          slug,
          logo_url
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching videos:', error)
    return []
  }

  return data as VideoWithTools[]
})

export const getVideoBySlug = cache(async (id: string) => {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('videos')
    .select(`
      *,
      video_tools (
        tools (
          name,
          slug,
          logo_url,
          description,
          category,
          pricing_type,
          use_cases,
          website_url,
          affiliate_url
        )
      ),
      video_timestamps (
        timestamp,
        title,
        description
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching video:', error)
    return null
  }

  return data as VideoWithTools
})
