'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toggleHuntTool } from '@/lib/actions/tools'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function HuntButton({
    toolId,
    initialHunted,
    count
}: {
    toolId: string
    initialHunted: boolean
    count: number
}) {
    const [hunted, setHunted] = useState(initialHunted)
    const [huntCount, setHuntCount] = useState(count)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async () => {
        setLoading(true)
        // Optimistic update
        const previousState = hunted
        setHunted(!hunted)
        setHuntCount(hunted ? huntCount - 1 : huntCount + 1)

        const result = await toggleHuntTool(toolId)

        if (result.error) {
            if (result.error === 'Unauthorized') {
                router.push('/auth/login')
            } else {
                // Revert on error
                setHunted(previousState)
                setHuntCount(hunted ? huntCount + 1 : huntCount - 1)
            }
        } else {
            setHunted(result.hunted)
        }
        setLoading(false)
    }

    return (
        <Button
            variant={hunted ? "secondary" : "outline"}
            size="lg"
            className={cn(
                "gap-2 transition-all min-w-[140px]",
                hunted && "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 border-red-500/50"
            )}
            onClick={handleToggle}
            disabled={loading}
        >
            <Heart className={cn("w-5 h-5", hunted && "fill-current")} />
            {hunted ? 'Hunted' : 'Hunt Tool'}
            <span className="ml-1 text-xs opacity-70 border-l border-current/20 pl-2">
                {huntCount}
            </span>
        </Button>
    )
}
