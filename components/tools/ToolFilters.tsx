'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useDebounce } from 'use-debounce'

const pricingTypes = ['All', 'Free', 'Freemium', 'Paid']
const categories = ['All', 'Development', 'Design', 'Marketing', 'Writing', 'Productivity']

export default function ToolFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [debouncedSearch] = useDebounce(searchTerm, 300)

    const currentPricing = searchParams.get('pricing') || 'All'
    const currentCategory = searchParams.get('category') || 'All'

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (debouncedSearch) {
            params.set('search', debouncedSearch)
        } else {
            params.delete('search')
        }
        router.push(`/the-hunt-is-on?${params.toString()}`)
    }, [debouncedSearch, router, searchParams])

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === 'All') {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`/the-hunt-is-on?${params.toString()}`)
    }

    return (
        <div className="space-y-6 mb-10">
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search for tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2">
                    <span className="text-sm font-medium mr-2 self-center text-muted-foreground">Category:</span>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleFilterChange('category', cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-sm transition-all border",
                                currentCategory === cat
                                    ? "bg-secondary/10 border-secondary text-secondary font-medium"
                                    : "border-transparent hover:bg-muted text-muted-foreground"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="w-px h-8 bg-border hidden md:block"></div>

                {/* Pricing Filter */}
                <div className="flex flex-wrap justify-center gap-2">
                    <span className="text-sm font-medium mr-2 self-center text-muted-foreground">Pricing:</span>
                    {pricingTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleFilterChange('pricing', type)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-sm transition-all border",
                                currentPricing === type
                                    ? "bg-primary/10 border-primary text-primary font-medium"
                                    : "border-transparent hover:bg-muted text-muted-foreground"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
