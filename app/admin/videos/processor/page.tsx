'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Video, Loader2, CheckCircle, AlertCircle, Eye, ArrowRight } from 'lucide-react'

export default function VideoProcessorPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [url, setUrl] = useState('')
    const [logs, setLogs] = useState<string[]>([])
    const [result, setResult] = useState<any>(null)

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setResult(null)
        setLogs(['Starting analysis...'])

        try {
            // Step 1: Analyze
            setLogs(prev => [...prev, 'Fetching metadata & transcript...'])
            const analyzeRes = await fetch('/api/admin/analyze-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl: url }),
            })
            const analyzeData = await analyzeRes.json()
            if (!analyzeData.success) throw new Error(analyzeData.error)

            setLogs(prev => [...prev, 'AI analysis complete!'])

            // Step 2: Save to pending_reviews queue
            setLogs(prev => [...prev, 'Saving to Review Queue...'])
            const queueRes = await fetch('/api/admin/review-queue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'video',
                    source: 'manual',
                    rawData: analyzeData.data,
                }),
            })
            const queueData = await queueRes.json()
            if (!queueData.success) throw new Error(queueData.error)

            setResult(analyzeData.data)
            setLogs(prev => [...prev, 'Added to Review Queue. Go review and approve!'])
        } catch (err: any) {
            setError(err.message)
            setLogs(prev => [...prev, `Error: ${err.message}`])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">AI Video Processor</h1>
                <p className="text-muted-foreground">
                    Analyze a YouTube video with AI. Results go to the <strong>Review Queue</strong> for approval.
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleAnalyze} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">YouTube URL</label>
                    <input
                        type="url"
                        required
                        placeholder="https://youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                    />
                </div>
                <Button disabled={loading} className="w-full h-12 text-lg font-bold gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                    {loading ? 'Analyzing...' : 'Analyze Video'}
                </Button>
            </form>

            {/* Logs */}
            {logs.length > 0 && (
                <div className="bg-muted rounded-xl p-4 max-h-40 overflow-y-auto border border-border font-mono text-xs">
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1 text-muted-foreground">{log}</div>
                    ))}
                </div>
            )}

            {/* Success: Preview & Go to Review */}
            {result && (
                <div className="bg-card border border-border rounded-xl p-6 space-y-4 animate-in fade-in">
                    <div className="flex items-center gap-3 text-green-500">
                        <CheckCircle className="w-6 h-6" />
                        <h2 className="text-lg font-bold">Analysis Complete!</h2>
                    </div>

                    {/* Quick Preview */}
                    <div className="flex gap-4">
                        {result.metadata?.thumbnailUrl && (
                            <img src={result.metadata.thumbnailUrl} className="w-40 h-24 object-cover rounded-lg bg-muted" />
                        )}
                        <div className="flex-1">
                            <h3 className="font-semibold">{result.metadata?.title}</h3>
                            <p className="text-sm text-muted-foreground">{result.metadata?.channelName}</p>
                            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                                <span className="bg-muted px-2 py-0.5 rounded">{result.summary?.category}</span>
                                <span className="bg-muted px-2 py-0.5 rounded">{result.timestamps?.length || 0} timestamps</span>
                                <span className="bg-muted px-2 py-0.5 rounded">{result.detectedTools?.length || 0} tools</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button onClick={() => router.push('/admin/review-queue')} className="flex-1 gap-2">
                            <Eye className="w-4 h-4" />
                            Go to Review Queue
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" onClick={() => { setUrl(''); setResult(null); setLogs([]) }}>
                            Process Another
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
