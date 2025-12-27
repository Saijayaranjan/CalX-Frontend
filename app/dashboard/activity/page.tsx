"use client"

import { useEffect, useState } from "react"
import { MessageSquare, FileText, Brain, RefreshCw, Clock, Filter, Search, Loader2 } from "lucide-react"
import { getDeviceActivity, getDeviceList } from "@/lib/api"

interface ActivityEvent {
    id: string
    type: "ai_query" | "file_sync" | "chat_message"
    description: string
    timestamp: Date
}

const getEventIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
        case "ai_query":
            return Brain
        case "file_sync":
            return FileText
        case "chat_message":
            return MessageSquare
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
    const [activityData, setActivityData] = useState<ActivityEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchActivity() {
            try {
                setLoading(true)
                // Get first device from device list
                const devices = await getDeviceList()
                if (devices.length === 0) {
                    setError("No devices found")
                    setLoading(false)
                    return
                }

                const device = devices[0]
                const data = await getDeviceActivity(device.deviceId)

                // Convert timestamps to ActivityEvent format
                const events: ActivityEvent[] = []

                if (data.last_chat_message) {
                    events.push({
                        id: "chat",
                        type: "chat_message",
                        description: "Last chat message",
                        timestamp: new Date(data.last_chat_message)
                    })
                }

                if (data.last_file_sync) {
                    events.push({
                        id: "file",
                        type: "file_sync",
                        description: "Last file sync",
                        timestamp: new Date(data.last_file_sync)
                    })
                }

                if (data.last_ai_query) {
                    events.push({
                        id: "ai",
                        type: "ai_query",
                        description: "Last AI query",
                        timestamp: new Date(data.last_ai_query)
                    })
                }

                // Sort by most recent first
                events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

                setActivityData(events)
                setError(null)
            } catch (err) {
                console.error("Failed to fetch activity:", err)
                setError("Failed to load activity log")
            } finally {
                setLoading(false)
            }
        }

        fetchActivity()
    }, [])

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
                        <span className="text-2xl font-bold text-foreground">
                            {activityData.filter(e => e.type === "ai_query").length}
                        </span>
                        <p className="text-xs text-muted-foreground">Recent activity</p>
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
                        <span className="text-2xl font-bold text-foreground">
                            {activityData.filter(e => e.type === "file_sync").length}
                        </span>
                        <p className="text-xs text-muted-foreground">Last sync tracked</p>
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
                        <span className="text-2xl font-bold text-foreground">
                            {activityData.filter(e => e.type === "chat_message").length}
                        </span>
                        <p className="text-xs text-muted-foreground">Recent messages</p>
                    </div>
                </div>
            </div>

            {/* Activity Table */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-muted-foreground">
                        {error}
                    </div>
                ) : activityData.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No activity logged yet. Use your device to see activity here.
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    )
}
