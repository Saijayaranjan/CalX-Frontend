"use client"

import { MessageSquare, FileText, Brain, RefreshCw, Clock, Filter, Search } from "lucide-react"

interface ActivityEvent {
    id: string
    type: "ai_query" | "file_sync" | "chat_message" | "settings_sync"
    description: string
    timestamp: Date
}

const activityData: ActivityEvent[] = [
    {
        id: "1",
        type: "chat_message",
        description: 'Sent chat message: "Calculate 2^64"',
        timestamp: new Date(Date.now() - 60000),
    },
    {
        id: "2",
        type: "ai_query",
        description: "AI query: Integral of x^2",
        timestamp: new Date(Date.now() - 60000 * 3),
    },
    {
        id: "3",
        type: "file_sync",
        description: "File synced: notes.txt (2.1 KB)",
        timestamp: new Date(Date.now() - 60000 * 15),
    },
    {
        id: "4",
        type: "settings_sync",
        description: "Device settings synchronized",
        timestamp: new Date(Date.now() - 60000 * 45),
    },
    {
        id: "5",
        type: "ai_query",
        description: "AI query: Compound interest formula",
        timestamp: new Date(Date.now() - 60000 * 60),
    },
    {
        id: "6",
        type: "chat_message",
        description: 'Received device message: "Ready for commands"',
        timestamp: new Date(Date.now() - 60000 * 90),
    },
    {
        id: "7",
        type: "file_sync",
        description: "File synced: formulas.txt (1.8 KB)",
        timestamp: new Date(Date.now() - 60000 * 120),
    },
    {
        id: "8",
        type: "ai_query",
        description: "AI query: Solve quadratic equation",
        timestamp: new Date(Date.now() - 60000 * 180),
    },
]

const getEventIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
        case "ai_query":
            return Brain
        case "file_sync":
            return FileText
        case "chat_message":
            return MessageSquare
        case "settings_sync":
            return RefreshCw
        default:
            return MessageSquare
    }
}

const getEventColor = (type: ActivityEvent["type"]) => {
    switch (type) {
        case "ai_query":
            return "text-purple-400 bg-purple-400/10"
        case "file_sync":
            return "text-blue-400 bg-blue-400/10"
        case "chat_message":
            return "text-primary bg-primary/10"
        case "settings_sync":
            return "text-orange-400 bg-orange-400/10"
        default:
            return "text-muted-foreground bg-muted"
    }
}

const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function ActivityLogPage() {
    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-foreground">Activity Log</h2>
                <p className="text-muted-foreground">Recent device events and synchronization history</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Brain className="w-20 h-20" />
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <Brain className="w-4 h-4 text-purple-500" />
                        </div>
                        <span className="text-sm font-medium">AI Queries</span>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-foreground">128</span>
                        <p className="text-xs text-muted-foreground">+12% from last week</p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileText className="w-20 h-20" />
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="text-sm font-medium">Files Synced</span>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-foreground">14</span>
                        <p className="text-xs text-muted-foreground">Last sync 15m ago</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <MessageSquare className="w-20 h-20" />
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Messages</span>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-foreground">58</span>
                        <p className="text-xs text-muted-foreground">Active interactions</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-2">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium whitespace-nowrap border border-primary/20">All Events</button>
                    <button className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted/50 whitespace-nowrap transition-colors">Errors</button>
                    <button className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted/50 whitespace-nowrap transition-colors">Warnings</button>
                </div>
            </div>

            {/* Activity Table */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/20">
                            <tr className="border-b border-border">
                                <th className="text-left px-8 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Type
                                </th>
                                <th className="text-left px-8 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Description
                                </th>
                                <th className="text-right px-8 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {activityData.map((event) => {
                                const Icon = getEventIcon(event.type)
                                const colorClass = getEventColor(event.type)
                                return (
                                    <tr
                                        key={event.id}
                                        className="hover:bg-muted/50 transition-colors group cursor-default"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl ${colorClass} flex items-center justify-center`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className="capitalize text-sm font-medium text-foreground">
                                                    {event.type.replace("_", " ")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm text-foreground/80">{event.description}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-sm font-mono">
                                                    {formatTimestamp(event.timestamp)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-center">
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-semibold">
                    Load More History
                </button>
            </div>
        </div>
    )
}
