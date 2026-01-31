'use client'

import { ExternalLink } from 'lucide-react'
import Button from '@/components/ui/Button'

interface AffiliateLinkProps {
    toolId: string
    url: string // Can be direct if no ID logic, but typically we want tracking
    label?: string
    className?: string
}

export default function AffiliateLink({ toolId, url, label = "Visit Website", className }: AffiliateLinkProps) {
    // Use the tracking route
    const trackingUrl = `/api/go/${toolId}`

    return (
        <a href={trackingUrl} target="_blank" rel="noopener noreferrer nofollow">
            <Button size="lg" className={`${className} gap-2 shadow-lg shadow-primary/20`}>
                {label} <ExternalLink className="w-4 h-4" />
            </Button>
        </a>
    )
}
