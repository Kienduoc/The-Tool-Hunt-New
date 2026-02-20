'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

const SORT_OPTIONS = [
    { value: 'newest', label: '✨ Newest' },
    { value: 'popular', label: '👁 Most Viewed' },
    { value: 'most_hunted', label: '🎯 Most Hunted' },
]

export default function ToolSearchSort({ toolCount }: { toolCount: number }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [debouncedSearch] = useDebounce(searchTerm, 300)
    const currentSort = searchParams.get('sort') || 'newest'

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (debouncedSearch) {
            params.set('search', debouncedSearch)
        } else {
            params.delete('search')
        }
        router.push(`/the-hunt-is-on?${params.toString()}`, { scroll: false })
    }, [debouncedSearch, router, searchParams])

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === 'newest') {
            params.delete('sort')
        } else {
            params.set('sort', value)
        }
        router.push(`/the-hunt-is-on?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by name, use case (e.g., blogging, video creation...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-card/60 backdrop-blur-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm placeholder:text-muted-foreground"
                />
            </div>

            {/* Count + Sort */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{toolCount}</span> tools
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
                    <select
                        value={currentSort}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                    >
                        {SORT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
