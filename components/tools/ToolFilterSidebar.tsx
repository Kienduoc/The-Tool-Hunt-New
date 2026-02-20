'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_OPTIONS = [
    { value: 'hot_trend', label: 'Hot Trend', emoji: '🔥' },
    { value: 'hunters_choice', label: "Hunter's Choice", emoji: '💎' },
    { value: 'new_tool', label: 'New Tool', emoji: '✨' },
    { value: 'popular', label: 'Popular', emoji: '🚀' },
]

// Removed hardcoded CATEGORY_OPTIONS in favor of props

const PRICING_OPTIONS = [
    { value: 'free', label: 'Free' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'paid', label: 'Paid' },
]

function FilterSection({ title, children, defaultOpen = true }: {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="space-y-2">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
                {title}
                {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {open && <div className="space-y-1 pt-1">{children}</div>}
        </div>
    )
}

function CheckboxItem({ label, emoji, checked, onChange }: {
    label: string
    emoji?: string
    checked: boolean
    onChange: () => void
}) {
    return (
        <label className="flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors text-sm group">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
            />
            {emoji && <span className="text-sm">{emoji}</span>}
            <span className={cn(
                "transition-colors",
                checked ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
            )}>
                {label}
            </span>
        </label>
    )
}

export default function ToolFilterSidebar({ categories = [] }: { categories?: string[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Parse current multi-value params
    const selectedStatuses = searchParams.get('status')?.split(',') || []
    const selectedCategories = searchParams.get('category')?.split(',') || []
    const selectedPricings = searchParams.get('pricing')?.split(',') || []

    const toggleFilter = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        const current = params.get(key)?.split(',').filter(Boolean) || []

        let updated: string[]
        if (current.includes(value)) {
            updated = current.filter(v => v !== value)
        } else {
            updated = [...current, value]
        }

        if (updated.length === 0) {
            params.delete(key)
        } else {
            params.set(key, updated.join(','))
        }
        router.push(`/the-hunt-is-on?${params.toString()}`, { scroll: false })
    }, [router, searchParams])

    const clearAll = () => {
        router.push('/the-hunt-is-on', { scroll: false })
    }

    const hasFilters = selectedStatuses.length > 0 || selectedCategories.length > 0 || selectedPricings.length > 0

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Filter className="w-4 h-4 text-primary" />
                        Filters
                    </div>
                    {hasFilters && (
                        <button
                            onClick={clearAll}
                            className="text-xs text-primary hover:underline"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {/* Status */}
                <FilterSection title="Status">
                    {STATUS_OPTIONS.map(s => (
                        <CheckboxItem
                            key={s.value}
                            label={s.label}
                            emoji={s.emoji}
                            checked={selectedStatuses.includes(s.value)}
                            onChange={() => toggleFilter('status', s.value)}
                        />
                    ))}
                </FilterSection>

                {/* Category */}
                <FilterSection title="Category">
                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                        {categories.map(cat => (
                            <CheckboxItem
                                key={cat}
                                label={cat}
                                checked={selectedCategories.includes(cat)}
                                onChange={() => toggleFilter('category', cat)}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Pricing */}
                <FilterSection title="Pricing">
                    {PRICING_OPTIONS.map(p => (
                        <CheckboxItem
                            key={p.value}
                            label={p.label}
                            checked={selectedPricings.includes(p.value)}
                            onChange={() => toggleFilter('pricing', p.value)}
                        />
                    ))}
                </FilterSection>
            </div>
        </aside>
    )
}
