import Link from 'next/link'
import { Article } from '@/lib/api/articles'
import { Calendar, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ArticleCard({ article }: { article: Article }) {
    return (
        <Link href={`/news/${article.slug}`} className="group flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
            {/* Cover Image */}
            <div className="aspect-video bg-muted relative overflow-hidden">
                {article.cover_image_url ? (
                    <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-secondary text-4xl font-bold">
                        {article.title[0]}
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-full text-xs font-medium">
                        {article.category}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                    {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                        {article.author?.avatar_url ? (
                            <img src={article.author.avatar_url} className="w-6 h-6 rounded-full object-cover" alt={article.author.full_name} />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-3 h-3" />
                            </div>
                        )}
                        <span>{article.author?.full_name || 'Hunter'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.published_at ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true }) : 'Draft'}
                    </div>
                </div>
            </div>
        </Link>
    )
}
