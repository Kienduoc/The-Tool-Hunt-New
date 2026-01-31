import { getTools } from '@/lib/api/tools'
import { getArticles } from '@/lib/api/articles'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Static routes
    const routes = [
        '',
        '/the-hunt-is-on',
        '/hunt-like-a-pro',
        '/news',
        '/auth/login',
        '/auth/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic Tool routes
    const tools = await getTools()
    const toolRoutes = tools.map((tool) => ({
        url: `${baseUrl}/the-hunt-is-on/${tool.slug}`,
        lastModified: new Date(tool.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Dynamic Article routes
    const articles = await getArticles()
    const articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/news/${article.slug}`,
        lastModified: new Date(article.published_at || article.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [...routes, ...toolRoutes, ...articleRoutes]
}
