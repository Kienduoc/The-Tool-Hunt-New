'use client'

import { useState, useEffect, useCallback } from 'react'
import Button from '@/components/ui/Button'
import { CheckCircle, XCircle, Eye, Loader2, Video, Clock, ChevronDown, ChevronUp, Save } from 'lucide-react'

interface PendingReview {
    id: string
    type: string
    status: string
    source: string
    raw_data: any
    admin_notes: string | null
    created_at: string
}

export default function ReviewQueuePage() {
    const [reviews, setReviews] = useState<PendingReview[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [editingData, setEditingData] = useState<Record<string, any>>({})

    const fetchReviews = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/review?status=${filter}`)
            const data = await res.json()
            setReviews(data.data || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [filter])

    useEffect(() => { fetchReviews() }, [fetchReviews])

    const handleAction = async (reviewId: string, action: 'approve' | 'reject') => {
        setActionLoading(reviewId)
        try {
            const editedData = editingData[reviewId] || null
            const res = await fetch('/api/admin/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId, action, editedData })
            })
            const data = await res.json()
            if (data.success) {
                setReviews(prev => prev.filter(r => r.id !== reviewId))
                setExpandedId(null)
            } else {
                alert('Error: ' + data.error)
            }
        } catch (e: any) {
            alert('Action failed: ' + e.message)
        } finally {
            setActionLoading(null)
        }
    }

    const startEditing = (review: PendingReview) => {
        if (!editingData[review.id]) {
            setEditingData(prev => ({ ...prev, [review.id]: JSON.parse(JSON.stringify(review.raw_data)) }))
        }
        setExpandedId(expandedId === review.id ? null : review.id)
    }

    const updateField = (reviewId: string, path: string[], value: any) => {
        setEditingData(prev => {
            const data = JSON.parse(JSON.stringify(prev[reviewId] || {}))
            let obj = data
            for (let i = 0; i < path.length - 1; i++) {
                obj = obj[path[i]]
            }
            obj[path[path.length - 1]] = value
            return { ...prev, [reviewId]: data }
        })
    }

    const getDisplayData = (review: PendingReview) => {
        return editingData[review.id] || review.raw_data
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Review Queue</h1>
                    <p className="text-muted-foreground text-sm">Duyệt nội dung AI đã phân tích trước khi đưa vào hệ thống</p>
                </div>
                <button
                    onClick={fetchReviews}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    Refresh
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
                {(['pending', 'approved', 'rejected'] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${filter === status
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Empty State */}
            {!loading && reviews.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">Không có mục nào đang chờ duyệt.</p>
                </div>
            )}

            {/* Review Items */}
            <div className="space-y-4">
                {reviews.map(review => {
                    const data = getDisplayData(review)
                    const isExpanded = expandedId === review.id
                    const isLoading = actionLoading === review.id

                    return (
                        <div key={review.id} className="bg-card border border-border rounded-xl overflow-hidden">
                            {/* Header */}
                            <div className="p-4 flex items-center gap-4">
                                {/* Thumbnail */}
                                {data?.metadata?.thumbnailUrl && (
                                    <img
                                        src={data.metadata.thumbnailUrl}
                                        alt={data.metadata?.title || 'Video'}
                                        className="w-32 h-20 object-cover rounded-lg bg-muted flex-shrink-0"
                                    />
                                )}

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium capitalize">{review.type}</span>
                                        <span className="text-xs text-muted-foreground">{review.source}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold truncate">{data?.metadata?.title || 'Untitled'}</h3>
                                    <p className="text-sm text-muted-foreground truncate">{data?.metadata?.channelName}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => startEditing(review)}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                        title="Expand/Edit"
                                    >
                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>

                                    {filter === 'pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() => handleAction(review.id, 'approve')}
                                                disabled={isLoading}
                                                className="gap-1"
                                            >
                                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                Duyệt
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAction(review.id, 'reject')}
                                                disabled={isLoading}
                                                className="gap-1 text-red-500 hover:text-red-600 border-red-500/20 hover:border-red-500/40"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Từ chối
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Expanded: Editable Details */}
                            {isExpanded && (
                                <div className="border-t border-border p-6 space-y-6 bg-muted/30">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <input
                                            value={data?.metadata?.title || ''}
                                            onChange={(e) => updateField(review.id, ['metadata', 'title'], e.target.value)}
                                            className="w-full p-2 border border-border rounded-md bg-background font-semibold"
                                        />
                                    </div>

                                    {/* AI Summary */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">AI Summary</label>
                                        <textarea
                                            value={data?.summary?.summary || ''}
                                            onChange={(e) => updateField(review.id, ['summary', 'summary'], e.target.value)}
                                            className="w-full h-40 p-3 border border-border rounded-md bg-background text-sm leading-relaxed"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Category</label>
                                            <input
                                                value={data?.summary?.category || ''}
                                                onChange={(e) => updateField(review.id, ['summary', 'category'], e.target.value)}
                                                className="w-full p-2 border border-border rounded-md bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Channel</label>
                                            <input
                                                value={data?.metadata?.channelName || ''}
                                                onChange={(e) => updateField(review.id, ['metadata', 'channelName'], e.target.value)}
                                                className="w-full p-2 border border-border rounded-md bg-background"
                                            />
                                        </div>
                                    </div>

                                    {/* Timestamps */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Timestamps ({data?.timestamps?.length || 0})</label>
                                        <div className="space-y-1 max-h-48 overflow-y-auto">
                                            {(data?.timestamps || []).map((ts: any, i: number) => (
                                                <div key={i} className="flex gap-2 items-center text-sm">
                                                    <span className="w-16 text-xs font-mono bg-muted px-1 py-0.5 rounded text-center">
                                                        {Math.floor(ts.timestamp / 60)}:{String(ts.timestamp % 60).padStart(2, '0')}
                                                    </span>
                                                    <span className="flex-1 truncate">{ts.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Detected Tools */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Detected Tools ({data?.detectedTools?.length || 0})</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(data?.detectedTools || []).map((tool: any, i: number) => (
                                                <div key={i} className="bg-background p-2 rounded-lg border border-border text-sm flex justify-between items-center">
                                                    <span className="font-medium">{tool.name}</span>
                                                    <span className="text-xs bg-muted px-1 rounded capitalize">{tool.pricingType}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
