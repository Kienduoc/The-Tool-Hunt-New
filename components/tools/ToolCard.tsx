import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Tool } from '@/lib/api/tools'
import { cn } from '@/lib/utils'
import HuntPinButton from './HuntPinButton'

const pricingColors: Record<string, string> = {
    free: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    freemium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    paid: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

const statusEmoji: Record<string, string> = {
    hot_trend: '🔥',
    hunters_choice: '💎',
    new_tool: '✨',
    popular: '🚀',
}

export default function ToolCard({ tool, initialHunted = false }: { tool: Tool; initialHunted?: boolean }) {
    const pricingLabel = tool.pricing_type.charAt(0).toUpperCase() + tool.pricing_type.slice(1)
    const pricingClass = pricingColors[tool.pricing_type] || 'bg-muted text-muted-foreground border-border'
    const emoji = statusEmoji[tool.status]

    return (
        <div className="group bg-card/60 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all flex flex-col h-full duration-300">
            <div className="p-5 flex-1 space-y-3">
                {/* Header: Logo + Name + Category + Pin */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                            {tool.logo_url ? (
                                <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-base font-bold text-primary">{tool.name.substring(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-base group-hover:text-primary transition-colors truncate">
                                {tool.name}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">{tool.category}</p>
                        </div>
                    </div>
                    {emoji && (
                        <span className="text-sm shrink-0 ml-2" title={tool.status}>{emoji}</span>
                    )}
                    <HuntPinButton toolId={tool.id} initialHunted={initialHunted} />
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                    {tool.description}
                </p>

                {/* Badges: Pricing + Complexity */}
                <div className="flex flex-wrap gap-1.5">
                    <span className={cn("px-2 py-0.5 text-xs rounded-md border font-medium", pricingClass)}>
                        {pricingLabel}
                    </span>
                    {tool.pricing_level && (
                        <span className="px-2 py-0.5 text-xs rounded-md border border-border text-muted-foreground bg-muted/50">
                            {tool.pricing_level.charAt(0).toUpperCase() + tool.pricing_level.slice(1)}
                        </span>
                    )}
                </div>

                {/* Use Cases */}
                {tool.use_cases && tool.use_cases.length > 0 && (
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Use cases:</p>
                        <div className="flex flex-wrap gap-1">
                            {tool.use_cases.slice(0, 4).map((uc, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs rounded bg-muted/50 text-muted-foreground border border-border/50">
                                    {uc}
                                </span>
                            ))}
                            {tool.use_cases.length > 4 && (
                                <span className="px-2 py-0.5 text-xs rounded text-muted-foreground">
                                    +{tool.use_cases.length - 4}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* CTA */}
            <div className="p-4 mt-auto">
                <a
                    href={tool.affiliate_url || tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary rounded-lg text-sm font-semibold transition-all duration-200"
                >
                    Visit Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Link
                    href={`/the-hunt-is-on/${tool.slug}`}
                    className="block text-center text-xs text-muted-foreground hover:text-primary mt-2 transition-colors"
                >
                    View details →
                </Link>
            </div>
        </div>
    )
}
