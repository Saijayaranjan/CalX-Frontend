"use client"

import { Cloud, RefreshCw } from "lucide-react"

const CloudSync = () => {
    return (
        <div
            className="w-full h-full relative overflow-hidden flex items-center justify-center"
            role="img"
            aria-label="Real-time cloud sync"
        >
            {/* Simple centered cloud icon with sync indicator */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <Cloud className="w-20 h-20 text-primary/60" strokeWidth={1.5} />
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border">
                        <RefreshCw className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        </div>
    )
}

export default CloudSync
