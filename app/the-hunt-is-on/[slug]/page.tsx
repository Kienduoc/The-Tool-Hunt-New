import { getToolBySlug, getRelatedTools } from '@/lib/api/tools'
import { getHuntStatus } from '@/lib/actions/tools'
import HuntButton from '@/components/tools/HuntButton'
import ToolCard from '@/components/tools/ToolCard'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Globe } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const tool = await getToolBySlug(slug)
    if (!tool) return { title: 'Tool Not Found' }
    return {
        title: `${tool.name} | The Tool Hunt`,
        description: tool.description,
    }
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const tool = await getToolBySlug(slug)

    if (!tool) {
        notFound()
    }

    const relatedTools = await getRelatedTools(tool.category, tool.slug)
    const isHunted = await getHuntStatus(tool.id)

    return (
        <div className="container py-12">
            <Link href="/the-hunt-is-on" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to The Hunt
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-card border border-border rounded-2xl flex items-center justify-center p-4 shadow-lg">
                            {tool.logo_url ? (
                                <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-4xl font-bold">{tool.name[0]}</span>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold">{tool.name}</h1>
                            <p className="text-xl text-muted-foreground">{tool.description}</p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <a href={`/api/go/${tool.id}`} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                                        Visit Website <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </a>
                                <HuntButton toolId={tool.id} initialHunted={isHunted} count={tool.hunt_count} />
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="bg-card border border-border rounded-xl p-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-3">About {tool.name}</h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {tool.long_description || tool.description}
                            </p>
                        </div>

                        {/* Use Cases */}
                        {tool.use_cases && tool.use_cases.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold mb-3">Best Used For</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tool.use_cases.map((useCase) => (
                                        <span key={useCase} className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg text-sm font-medium">
                                            {useCase}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Metadata Card */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <h3 className="font-bold border-b border-border pb-2">Tool Details</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Category</span>
                                <span className="font-medium text-foreground">{tool.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pricing</span>
                                <span className="font-medium text-foreground capitalize">{tool.pricing_type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pricing Level</span>
                                <span className="font-medium text-foreground capitalize">{tool.pricing_level || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className="font-medium text-foreground capitalize">{tool.status.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Website</span>
                                <a href={`/api/go/${tool.id}`} target="_blank" rel="noopener" className="text-primary hover:underline flex items-center gap-1">
                                    {new URL(tool.website_url).hostname} <Globe className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Related Tools */}
                    {relatedTools.length > 0 && (
                        <div>
                            <h3 className="font-bold text-xl mb-4">Related Tools</h3>
                            <div className="grid gap-4">
                                {relatedTools.map((rt) => (
                                    <Link key={rt.id} href={`/the-hunt-is-on/${rt.slug}`} className="block group">
                                        <div className="bg-card border border-border rounded-lg p-3 hover:border-primary transition-colors flex items-center gap-3">
                                            <div className="w-10 h-10 bg-background rounded border border-border flex items-center justify-center shrink-0">
                                                {rt.logo_url ? <img src={rt.logo_url} className="w-full h-full object-cover" /> : rt.name[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-medium group-hover:text-primary truncate">{rt.name}</h4>
                                                <span className="text-xs text-muted-foreground capitalize">{rt.pricing_type}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
