'use client'

import YouTube, { YouTubePlayer } from 'react-youtube'
import { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react'

export type VideoPlayerHandle = {
    seekTo: (seconds: number) => void
}

const VideoPlayer = forwardRef<VideoPlayerHandle, { videoId: string }>(
    function VideoPlayer({ videoId }, ref) {
        const [isReady, setIsReady] = useState(false)
        const playerRef = useRef<YouTubePlayer | null>(null)

        useImperativeHandle(ref, () => ({
            seekTo: (seconds: number) => {
                playerRef.current?.seekTo(seconds, true)
            },
        }))

        const opts = {
            height: '100%',
            width: '100%',
            playerVars: {
                autoplay: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3,
                disablekb: 0,
                fs: 0,
            },
        }

        const handleReady = useCallback((event: { target: YouTubePlayer }) => {
            playerRef.current = event.target
            setIsReady(true)
        }, [])

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
                    onReady={handleReady}
                    className="w-full h-full absolute inset-0"
                />
            </div>
        )
    }
)

export default VideoPlayer
