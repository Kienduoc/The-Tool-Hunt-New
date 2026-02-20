'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { toggleHuntTool } from '@/lib/actions/tools'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function HuntPinButton({
    toolId,
    initialHunted = false
}: {
    toolId: string
    initialHunted?: boolean
}) {
    const [hunted, setHunted] = useState(initialHunted)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setLoading(true)

        const previousState = hunted
        setHunted(!hunted)

        const result = await toggleHuntTool(toolId)

        if (result.error) {
            if (result.error === 'Unauthorized') {
                router.push('/auth/login')
            }
            setHunted(previousState)
        } else {
            setHunted(result.hunted)
        }
        setLoading(false)
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={cn(
                "p-1.5 transition-all shrink-0 ml-1 rounded-md",
                hunted
                    ? "text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
            title={hunted ? 'Remove from Hunted' : 'Hunt this tool'}
        >
            <MapPin className={cn("w-4 h-4", hunted && "fill-current")} />
        </button>
    )
}
