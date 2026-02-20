'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Plus, Save, Eye, Edit } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function AIWriterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [step, setStep] = useState<'input' | 'preview'>('input')

    // Form State
    const [topic, setTopic] = useState('')
    const [type, setType] = useState('Toplist')
    const [targetKeyword, setTargetKeyword] = useState('')

    // Generated Content State
    const [article, setArticle] = useState<any>(null)

    const handleGenerate = async () => {
        if (!topic || !targetKeyword) return

        setLoading(true)
        try {
            const res = await fetch('/api/admin/generate-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, type, targetKeyword })
            })

            const data = await res.json()
            if (data.success) {
                setArticle(data.data)
                setStep('preview')
            } else {
                alert('Error: ' + data.error)
            }
        } catch (e) {
            console.error(e)
            alert('Failed to generate article')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (published: boolean) => {
        if (!article) return
        setSaving(true)

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                alert('Unauthorized')
                return
            }

            const { error } = await supabase.from('articles').insert({
                ...article,
                author_id: user.id,
                published,
                published_at: published ? new Date().toISOString() : null
            })

            if (error) throw error

            alert(published ? 'Article published!' : 'Draft saved!')
            router.push('/admin/articles')
        } catch (e: any) {
            console.error(e)
            alert('Failed to save: ' + e.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">AI Content Writer</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Input */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="font-semibold text-lg">1. Topic & Keywords</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Topic / Title Idea</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full p-2 border border-border rounded-md bg-background"
                                placeholder="e.g., Best AI Tools for Coding"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full p-2 border border-border rounded-md bg-background"
                                >
                                    <option value="Toplist">Toplist (Top 5...)</option>
                                    <option value="Comparison">Comparison (A vs B)</option>
                                    <option value="General">General Guide</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Keyword</label>
                                <input
                                    type="text"
                                    value={targetKeyword}
                                    onChange={(e) => setTargetKeyword(e.target.value)}
                                    className="w-full p-2 border border-border rounded-md bg-background"
                                    placeholder="e.g., ai coding assistant"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={loading || !topic || !targetKeyword}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Generate Draft
                                </>
                            )}
                        </Button>
                    </div>

                    {article && (
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                            <h2 className="font-semibold text-lg">3. Metadata Preview</h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SEO Title</label>
                                <input
                                    type="text"
                                    value={article.seo_title}
                                    onChange={(e) => setArticle({ ...article, seo_title: e.target.value })}
                                    className="w-full p-2 border border-border rounded-md bg-background text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Description</label>
                                <textarea
                                    value={article.seo_description}
                                    onChange={(e) => setArticle({ ...article, seo_description: e.target.value })}
                                    className="w-full p-2 border border-border rounded-md bg-background text-sm h-20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug</label>
                                <input
                                    type="text"
                                    value={article.slug}
                                    onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                                    className="w-full p-2 border border-border rounded-md bg-background text-sm font-mono"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Editor & Preview */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-[calc(100vh-12rem)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-lg">2. Editor & Preview</h2>
                        <div className="flex gap-2 bg-muted p-1 rounded-lg">
                            <button
                                onClick={() => setStep('input')}
                                className={`flex items-center px-3 py-1 rounded-md text-sm transition-colors ${step === 'input' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </button>
                            <button
                                onClick={() => setStep('preview')}
                                className={`flex items-center px-3 py-1 rounded-md text-sm transition-colors ${step === 'preview' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </button>
                        </div>
                        {article && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handleSave(false)}
                                    disabled={saving}
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    onClick={() => handleSave(true)}
                                    disabled={saving}
                                >
                                    Publish
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto border border-border rounded-md bg-background scrollbar-hide">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 p-8">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <p>AI is writing your article...</p>
                                <p className="text-xs text-muted-foreground/60">This typically takes 10-20 seconds.</p>
                            </div>
                        ) : article ? (
                            step === 'input' ? (
                                <div className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Article Title</label>
                                        <input
                                            type="text"
                                            value={article.title}
                                            onChange={(e) => setArticle({ ...article, title: e.target.value })}
                                            className="w-full p-2 border border-border rounded-md bg-background font-bold text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Cover Image URL</label>
                                        <input
                                            type="text"
                                            value={article.cover_image_url || ''}
                                            onChange={(e) => setArticle({ ...article, cover_image_url: e.target.value })}
                                            className="w-full p-2 border border-border rounded-md bg-background text-sm font-mono text-muted-foreground"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <label className="text-sm font-medium">Content (Markdown)</label>
                                        <textarea
                                            value={article.content}
                                            onChange={(e) => setArticle({ ...article, content: e.target.value })}
                                            className="w-full p-4 border border-border rounded-md bg-background font-mono text-sm min-h-[500px] leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="prose prose-invert max-w-none p-8">
                                    <h1>{article.title}</h1>
                                    {article.cover_image_url && (
                                        <img src={article.cover_image_url} alt={article.title} className="w-full h-64 object-cover rounded-lg mb-8" />
                                    )}
                                    <ReactMarkdown>{article.content}</ReactMarkdown>
                                </div>
                            )
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 space-y-4">
                                <p>Generate an article to start editing, or create manually.</p>
                                <Button
                                    variant="outline"
                                    className="ml-2"
                                    onClick={() => {
                                        setArticle({
                                            title: '',
                                            slug: '',
                                            content: '',
                                            seo_title: '',
                                            seo_description: '',
                                            tags: [],
                                            category: type,
                                            cover_image_url: ''
                                        })
                                        setStep('input')
                                    }}
                                >
                                    Start Blank Article
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
