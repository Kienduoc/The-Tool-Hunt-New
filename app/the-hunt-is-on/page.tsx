import { getTools, getAllCategories } from '@/lib/api/tools'
import { getHuntedToolIds } from '@/lib/api/hunted'
import ToolCard from '@/components/tools/ToolCard'
import ToolFilterSidebar from '@/components/tools/ToolFilterSidebar'
import ToolSearchSort from '@/components/tools/ToolSearchSort'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'The Hunt Is ON! | The Tool Hunt',
    description: 'The Ultimate AI Tools Arsenal. Filter, search, and hunt the best tools.',
}

export default async function TheHuntIsOnPage(props: {
    searchParams: Promise<{
        category?: string
        pricing?: string
        status?: string
        search?: string
        sort?: string
    }>
}) {
    const searchParams = await props.searchParams
    const [tools, huntedIds, categories] = await Promise.all([
        getTools(searchParams),
        getHuntedToolIds(),
        getAllCategories()
    ])

    return (
        <div className="container py-8 md:py-12">
            {/* Hero */}
            <div className="text-center mb-8 space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-secondary inline-block">
                    The Hunt Is ON! 🟢
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                    The Ultimate AI Tools Arsenal. Filter, search, and hunt the best tools.
                </p>
            </div>

            {/* 2-Column Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <Suspense fallback={<div className="w-64 shrink-0" />}>
                    <ToolFilterSidebar categories={categories} />
                </Suspense>

                {/* Main Content */}
                <div className="flex-1 min-w-0 space-y-5">
                    {/* Search + Sort */}
                    <Suspense fallback={<div className="h-20" />}>
                        <ToolSearchSort toolCount={tools.length} />
                    </Suspense>

                    {/* Tool Grid */}
                    {tools.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {tools.map((tool) => (
                                <ToolCard key={tool.id} tool={tool} initialHunted={huntedIds.has(tool.id)} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/40">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-lg font-medium text-foreground">No tools found</p>
                            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search term.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
