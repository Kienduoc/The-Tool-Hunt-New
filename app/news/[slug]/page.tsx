import { getArticleBySlug } from '@/lib/api/articles'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const article = await getArticleBySlug(slug)
    if (!article) return { title: 'Article Not Found' }
    return {
        title: `${article.title} | The Tool Hunt`,
        description: article.excerpt,
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const article = await getArticleBySlug(slug)

    if (!article) {
        notFound()
    }

    return (
        <div className="container py-12 max-w-4xl">
            <Link href="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to News
            </Link>

            <article className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                {/* Cover Image */}
                {article.cover_image_url && (
                    <div className="aspect-[21/9] w-full bg-muted">
                        <img
                            src={article.cover_image_url}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-8 md:p-12">
                    {/* Header */}
                    <header className="mb-10 space-y-6">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 font-medium">
                                {article.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Draft'}
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {article.author?.full_name || 'Hunter'}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                            {article.title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {article.excerpt}
                        </p>
                    </header>

                    <hr className="border-border mb-10" />

                    {/* Content */}
                    <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl">
                        {/* Note: In a real app we'd use a markdown renderer here. For now we just display clean content or handle dangerouslySetInnerHTML if strict control is ensured. */}
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
                            {article.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-lg text-sm">
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </div>
    )
}
