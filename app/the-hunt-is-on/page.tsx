import { getTools } from '@/lib/api/tools'
import ToolCard from '@/components/tools/ToolCard'
import ToolFilters from '@/components/tools/ToolFilters'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'The Hunt Is ON! | The Tool Hunt',
    description: 'Proactively hunt for the best AI tools. Search, filter, and discover your next power-up.',
}

export default async function TheHuntIsOnPage({
    searchParams,
}: {
    searchParams: { category?: string; pricing?: string; status?: string; search?: string }
}) {
    const tools = await getTools(searchParams)

    return (
        <div className="container py-12">
            <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block">
                    The Hunt Is ON! 🎯
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Explore our curated arsenal of AI tools.
                    Filter by price, category, or just hunt for something new.
                </p>
            </div>

            <ToolFilters />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>

            {tools.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card">
                    <p className="text-lg font-medium text-foreground">No tools found matching your criteria.</p>
                    <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                </div>
            )}
        </div>
    )
}
