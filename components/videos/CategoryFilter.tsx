'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const categories = ['All', 'Tutorial', 'Review', 'Comparison', 'News']

export default function CategoryFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentCategory = searchParams.get('category') || 'All'

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams)
        if (category === 'All') {
            params.delete('category')
        } else {
            params.set('category', category)
        }
        router.push(`/hunt-like-a-pro?${params.toString()}`)
    }

    return (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                        currentCategory === category
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                            : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    )
}
