'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Video, Loader2, CheckCircle, AlertCircle, PlayCircle, Plus } from 'lucide-react'

export default function VideoProcessorPage() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<any | null>(null)
    const [logs, setLogs] = useState<string[]>([])
    const router = useRouter()

    const handleProcess = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setResult(null)
        setLogs(['Initializing...'])

        try {
            const res = await fetch('/api/admin/process-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl: url, autoPublish: true }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Processing failed')
            }

            setResult(data)
            setLogs((prev) => [...prev, 'Processing completed successfully!'])
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            setLogs((prev) => [...prev, `Error: ${err.message}`])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">AI Video Processor 🤖</h1>
                <p className="text-muted-foreground">
                    Enter a YouTube URL to automatically extract metadata, summarize content, detect timestamps, and identify tools.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <form onSubmit={handleProcess} className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">YouTube URL</label>
                            <input
                                type="url"
                                required
                                placeholder="https://youtube.com/watch?v=..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <Button disabled={loading} className="w-full h-12 text-lg font-bold gap-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                            {loading ? 'Processing...' : 'Process Video'}
                        </Button>

                        {loading && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
                                Processing takes about 30-60 seconds...
                            </div>
                        )}
                    </form>

                    {/* Logs */}
                    <div className="bg-muted rounded-xl p-4 h-64 overflow-y-auto border border-border font-mono text-sm">
                        {logs.length === 0 && <span className="text-muted-foreground opacity-50">System ready...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="mb-1 text-muted-foreground">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            <div>
                                <p className="font-bold">Processing Failed</p>
                                <p className="text-sm opacity-90">{error}</p>
                            </div>
                        </div>
                    )}

                    {result && result.data && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-3 mb-4">
                            <CheckCircle className="w-6 h-6" />
                            <p className="font-bold text-lg">Processing Complete!</p>
                        </div>
                    )}

                    {result && result.data && (
                        <div className="space-y-4">
                            {/* Video Card */}
                            <div className="bg-card border border-border rounded-xl p-4 flex gap-4">
                                <img src={result.data.video.thumbnail_url} className="w-32 h-20 object-cover rounded-lg bg-muted" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-foreground truncate">{result.data.video.title}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs px-2 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20">
                                            {result.data.video.category}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{result.data.timestamps.length} timestamps</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tools Created */}
                            <div className="bg-card border border-border rounded-xl p-4">
                                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Tools Created ({result.data.tools.created.length})
                                </h3>
                                <div className="space-y-2">
                                    {result.data.tools.created.map((tool: any) => (
                                        <div key={tool.id} className="flex items-center justify-between p-2 rounded bg-muted/50 border border-border text-sm">
                                            <span className="font-medium">{tool.name}</span>
                                            <span className="text-xs text-muted-foreground">{tool.category}</span>
                                        </div>
                                    ))}
                                    {result.data.tools.created.length === 0 && (
                                        <p className="text-sm text-muted-foreground italic">No new tools created.</p>
                                    )}
                                </div>
                            </div>

                            {/* Tools Matched */}
                            <div className="bg-card border border-border rounded-xl p-4">
                                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Tools Matched ({result.data.tools.existing.length})
                                </h3>
                                <div className="space-y-2">
                                    {result.data.tools.existing.map((tool: any) => (
                                        <div key={tool.id} className="flex items-center justify-between p-2 rounded bg-muted/50 border border-border text-sm">
                                            <span className="font-medium">{tool.name}</span>
                                            <span className="text-xs text-green-500">Linked</span>
                                        </div>
                                    ))}
                                    {result.data.tools.existing.length === 0 && (
                                        <p className="text-sm text-muted-foreground italic">No existing tools matched.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
