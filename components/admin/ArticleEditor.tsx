'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { Article } from '@/lib/api/articles'

export default function ArticleEditor({ action }: { action: any }) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        await action(formData)
        setLoading(false)
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-4xl bg-card border border-border p-8 rounded-xl">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input name="title" required className="w-full px-4 py-2 bg-background border border-border rounded-lg text-lg font-bold" placeholder="Article Title" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select name="category" className="w-full px-4 py-2 bg-background border border-border rounded-lg">
                            <option value="General">General</option>
                            <option value="Tutorial">Tutorial</option>
                            <option value="Comparison">Comparison</option>
                            <option value="News">News</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                        <input name="cover_image_url" type="url" className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                    <textarea name="excerpt" required rows={3} className="w-full px-4 py-2 bg-background border border-border rounded-lg" placeholder="Short summary for cards..." />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Content (Markdown/HTML)</label>
                    <textarea name="content" required rows={15} className="w-full px-4 py-2 bg-background border border-border rounded-lg font-mono text-sm" placeholder="# Header..." />
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" name="published" id="published" className="w-4 h-4 rounded border-border" />
                    <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
                </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
                <Button disabled={loading}>
                    {loading ? 'Publishing...' : 'Create Article'}
                </Button>
            </div>
        </form>
    )
}
