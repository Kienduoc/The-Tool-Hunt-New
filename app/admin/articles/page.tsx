import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { deleteArticle } from '@/lib/actions/admin/articles'

export default async function AdminArticlesPage() {
    const supabase = await createClient()
    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Articles</h1>
                <Link
                    href="/admin/articles/new"
                    className="inline-flex items-center justify-center gap-2 rounded-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4 py-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Write Article
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Views</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles?.map((article) => (
                            <tr key={article.id} className="border-b border-border hover:bg-muted/30">
                                <td className="px-6 py-4 font-medium max-w-sm truncate">{article.title}</td>
                                <td className="px-6 py-4">{article.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full border ${article.published ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        }`}>
                                        {article.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{article.view_count}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <form action={deleteArticle.bind(null, article.id)}>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {articles?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    No articles found. Start writing!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
