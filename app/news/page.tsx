import { getArticles } from '@/lib/api/articles'
import ArticleCard from '@/components/blog/ArticleCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'News & Comparisons | The Tool Hunt',
    description: 'Stay ahead with the latest AI tool news, detailed comparisons, and expert insights.',
}

export default async function NewsPage() {
    const articles = await getArticles()

    return (
        <div className="container py-12">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">News & Comparisons 📰</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Deep dives, battle-tested comparisons, and the latest updates from the AI world.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>

            {articles.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold mb-2">No articles published yet</h3>
                    <p className="text-muted-foreground">Check back soon for the latest AI insights.</p>
                </div>
            )}
        </div>
    )
}
