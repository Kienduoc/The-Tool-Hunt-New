import ArticleEditor from '@/components/admin/ArticleEditor'
import { createArticle } from '@/lib/actions/admin/articles'

export default function NewArticlePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Write New Article</h1>
            <ArticleEditor action={createArticle} />
        </div>
    )
}
