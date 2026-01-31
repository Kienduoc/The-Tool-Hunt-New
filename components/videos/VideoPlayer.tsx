'use client'

import YouTube from 'react-youtube'
import { useState } from 'react'

export default function VideoPlayer({ videoId }: { videoId: string }) {
    const [isReady, setIsReady] = useState(false)

    // Options for the player
    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
    }

    return (
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-border">
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                    <span className="text-muted-foreground">Loading Player...</span>
                </div>
            )}
            <YouTube
                videoId={videoId}
                opts={opts}
                onReady={() => setIsReady(true)}
                className="w-full h-full absolute inset-0"
            />
        </div>
    )
}
