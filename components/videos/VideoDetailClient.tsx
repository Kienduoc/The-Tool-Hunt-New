'use client'

import { useRef, useCallback, Fragment } from 'react'
import VideoPlayer, { VideoPlayerHandle } from './VideoPlayer'
import { MapPin, ExternalLink } from 'lucide-react'

type Tool = {
    name: string
    slug: string
    logo_url: string | null
    description?: string | null
    category?: string
    pricing_type?: string
    use_cases?: string[]
    website_url?: string
    affiliate_url?: string | null
}

type Props = {
    videoId: string
    aiSummary: string | null
    description: string | null
    tools: { tools: Tool }[]
    children?: React.ReactNode
}

/**
 * Parse description text:
 * - Bold lines that look like section headers (short lines ending with no period, or known patterns)
 * - Turn [MM:SS] or [HH:MM:SS] patterns into blue clickable buttons
 */
function parseDescription(text: string, onTimestampClick: (seconds: number) => void) {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()

        // Skip empty lines - render as spacing
        if (!trimmed) {
            elements.push(<div key={`space-${i}`} className="h-2" />)
            continue
        }

        // Detect section headers:
        // Lines that are short (< 60 chars), don't end with period, and look like titles
        const isHeader = (
            trimmed.length < 80 &&
            !trimmed.endsWith('.') &&
            !trimmed.endsWith(',') &&
            !trimmed.match(/^\[/) && // not starting with timestamp
            (
                /^(Key Highlights|Brief Overview|Conclusion|Introduction|Summary|Final|Getting Started|For Beginners|For Professionals|Special Mention|Best Free|The Strategy|Three Key Traits)/i.test(trimmed) ||
                /^Level \d/i.test(trimmed) ||
                /\[\d{1,2}:\d{2}(:\d{2})?\]\s*$/.test(trimmed) || // line ending with timestamp
                /^[A-Z][A-Za-z\s&\-:]+(\[\d{1,2}:\d{2}\])?$/.test(trimmed) // Title Case lines
            )
        )

        // Parse timestamps within the line
        const parsedLine = parseTimestamps(trimmed, onTimestampClick, i)

        if (isHeader) {
            elements.push(
                <p key={`line-${i}`} className="font-bold text-foreground mt-3 mb-1">
                    {parsedLine}
                </p>
            )
        } else {
            elements.push(
                <p key={`line-${i}`} className="text-muted-foreground mb-1">
                    {parsedLine}
                </p>
            )
        }
    }

    return elements
}

function parseTimestamps(text: string, onTimestampClick: (seconds: number) => void, lineKey: number) {
    // Match [MM:SS] or [HH:MM:SS] patterns
    const regex = /\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index))
        }

        const timeStr = match[1]
        const seconds = parseTimeToSeconds(timeStr)

        parts.push(
            <button
                key={`ts-${lineKey}-${match.index}`}
                onClick={() => onTimestampClick(seconds)}
                className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors hover:underline"
            >
                [{timeStr}]
            </button>
        )

        lastIndex = regex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex))
    }

    return parts.length > 1 ? <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</> : text
}

function parseTimeToSeconds(time: string): number {
    const parts = time.split(':').map(Number)
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if (parts.length === 2) return parts[0] * 60 + parts[1]
    return 0
}

export default function VideoDetailClient({ videoId, aiSummary, description, tools, children }: Props) {
    const playerRef = useRef<VideoPlayerHandle>(null)

    const handleSeek = useCallback((seconds: number) => {
        playerRef.current?.seekTo(seconds)
    }, [])

    const toolCount = tools?.length ?? 0
    const contentText = aiSummary || description

    return (
        <>
            {/* ── 2-Column: Video + Tools Sidebar ── */}
            <div className={`grid gap-6 mb-6 ${toolCount > 0 ? 'grid-cols-1 lg:grid-cols-[1fr_320px]' : 'grid-cols-1'}`}>
                {/* Video Player */}
                <div>
                    <VideoPlayer ref={playerRef} videoId={videoId} />
                </div>

                {/* Tools Sidebar */}
                {toolCount > 0 && (
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            🛠️ Các Tool ({toolCount})
                        </h3>
                        <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {tools.map(({ tools: tool }) => (
                                <div
                                    key={tool.slug}
                                    className="bg-card border border-border rounded-lg p-3 flex items-start gap-3 hover:border-primary/30 transition-colors group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
                                        {tool.logo_url ? (
                                            <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-bold text-muted-foreground">
                                                {tool.name.substring(0, 2).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold truncate leading-tight mb-0.5">{tool.name}</h4>
                                        {tool.category && (
                                            <span className="text-xs text-muted-foreground block mb-1.5">{tool.category}</span>
                                        )}
                                        {tool.description && (
                                            <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                                                {tool.description}
                                            </p>
                                        )}
                                    </div>
                                    <a
                                        href={tool.affiliate_url || tool.website_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-colors shrink-0 opacity-0 group-hover:opacity-100 mt-0.5"
                                        title="Visit website"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Title / Meta (passed as children from server component) ── */}
            {children}

            {/* ── Description with parsed headings & timestamps ── */}
            {contentText && (
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span>📝</span> Mô tả
                    </h2>
                    <div className="columns-1 md:columns-2 gap-8 text-[15px] leading-relaxed">
                        {parseDescription(contentText, handleSeek)}
                    </div>
                </div>
            )}
        </>
    )
}
