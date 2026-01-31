import Link from 'next/link'
import { ExternalLink, Heart } from 'lucide-react'
import { Tool } from '@/lib/api/tools'
import Button from '@/components/ui/Button'

export default function ToolCard({ tool }: { tool: Tool }) {
    const cleanUrl = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '')
        } catch {
            return url
        }
    }

    return (
        <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full hover:-translate-y-1 duration-300">
            <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center overflow-hidden">
                            {tool.logo_url ? (
                                <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl font-bold">{tool.name[0]}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                <Link href={`/the-hunt-is-on/${tool.slug}`} className="focus:outline-none">
                                    <span className="absolute inset-0 z-10" aria-hidden="true" />
                                    {tool.name}
                                </Link>
                            </h3>
                            <a
                                href={tool.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-muted-foreground hover:text-primary z-20 relative flex items-center gap-1"
                            >
                                {cleanUrl(tool.website_url)} <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                    <button className="z-20 p-2 text-muted-foreground hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {tool.description}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded">
                        {tool.pricing_type}
                    </span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground border border-border rounded">
                        {tool.category}
                    </span>
                </div>
            </div>

            <div className="p-4 bg-muted/30 border-t border-border mt-auto flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{tool.hunt_count}</span> Hunts
                </div>
                <Link href={`/the-hunt-is-on/${tool.slug}`} className="z-20">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Details
                    </Button>
                </Link>
            </div>
        </div>
    )
}
