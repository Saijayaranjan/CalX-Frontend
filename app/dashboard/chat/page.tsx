"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Bot, User, Clock, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getMessages, sendMessage, getCurrentDevice, getToken, type ChatMessage } from "@/lib/api"

interface Message {
    id: string
    sender: "WEB" | "DEVICE"
    content: string
    timestamp: Date
}

export default function ChatPage() {
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [deviceId, setDeviceId] = useState<string | null>(null)
    const [error, setError] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const MAX_MESSAGE_LENGTH = 2500
    const WARNING_THRESHOLD = 2000
    const isOverLimit = input.length > MAX_MESSAGE_LENGTH
    const isNearLimit = input.length > WARNING_THRESHOLD && input.length <= MAX_MESSAGE_LENGTH

    useEffect(() => {
        if (!getToken()) {
            router.push("/login")
            return
        }

        const device = getCurrentDevice()
        setDeviceId(device)

        if (device) {
            fetchMessages(device)
        }
    }, [router])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const fetchMessages = async (device: string) => {
        setIsFetching(true)
        setError("")
        try {
            const data = await getMessages(device)
            setMessages(data.map((m: ChatMessage) => ({
                id: m.id,
                sender: m.sender,
                content: m.content,
                timestamp: new Date(m.createdAt),
            })))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch messages")
        } finally {
            setIsFetching(false)
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const handleSend = async () => {
        if (!input.trim() || isOverLimit || !deviceId) return

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: "WEB",
            content: input.trim(),
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)
        setError("")

        try {
            const response = await sendMessage(deviceId, userMessage.content)
            // Update the message with the server ID
            setMessages((prev) =>
                prev.map(m => m.id === userMessage.id
                    ? { ...m, id: response.id }
                    : m
                )
            )
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send message")
            // Remove the failed message
            setMessages((prev) => prev.filter(m => m.id !== userMessage.id))
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const clearChat = () => {
        setMessages([])
    }

    const refreshMessages = () => {
        if (deviceId) {
            fetchMessages(deviceId)
        }
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Device Chat</h2>
                    <p className="text-muted-foreground">
                        Send messages to your CalX device
                        {deviceId && <span className="text-primary ml-2">({deviceId})</span>}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" className="text-muted-foreground" onClick={refreshMessages} disabled={isFetching}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={clearChat}>
                        <Trash2 className="w-4 h-4 mr-2" /> Clear
                    </Button>
                </div>
            </div>

            {!deviceId && (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                    <p className="text-sm">No device bound. Please <a href="/bind-device" className="underline">bind a device</a> first.</p>
                </div>
            )}

            {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                {/* Chat Window - Spans 3 cols */}
                <div className="lg:col-span-3 rounded-3xl border border-border bg-card overflow-hidden flex flex-col shadow-sm">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <Bot className="w-16 h-16 mb-4" />
                                <p className="text-lg font-medium">No messages yet</p>
                                <p className="text-sm">Start a conversation with your device</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-4 ${message.sender === "WEB" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === "WEB" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                        {message.sender === "WEB" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>

                                    <div className={`flex flex-col max-w-[70%] ${message.sender === "WEB" ? "items-end" : "items-start"}`}>
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className="text-xs font-semibold text-foreground/80">
                                                {message.sender === "WEB" ? "You" : "CalX Device"}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatTime(message.timestamp)}
                                            </span>
                                        </div>
                                        <div
                                            className={`px-5 py-3.5 rounded-2xl font-mono text-sm leading-relaxed ${message.sender === "WEB"
                                                ? "bg-primary/10 text-foreground rounded-tr-sm"
                                                : "bg-muted/50 border border-border text-foreground rounded-tl-sm"
                                                }`}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {isLoading && (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="bg-muted/50 border border-border px-5 py-4 rounded-2xl rounded-tl-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
                        <div className="flex gap-3 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={deviceId ? "Type a message to CalX..." : "Bind a device first"}
                                className="flex-1 pl-5 pr-12 py-4 rounded-xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                disabled={isLoading || !deviceId}
                                autoFocus
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading || isOverLimit || !deviceId}
                                className="absolute right-2 top-2 bottom-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 aspect-square p-0"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="flex justify-between items-center mt-2 px-1">
                            <span className="text-[10px] text-muted-foreground">Press Enter to send</span>
                            <span className={`text-[10px] font-mono ${isOverLimit ? 'text-destructive font-medium' : isNearLimit ? 'text-yellow-500 font-medium' : 'text-muted-foreground'}`}>
                                {input.length}/{MAX_MESSAGE_LENGTH}{isNearLimit && !isOverLimit && ' ⚠️'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Info & Tips */}
                <div className="hidden lg:flex lg:col-span-1 flex-col gap-6">
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Device Chat</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs text-muted-foreground">Real-time sync</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Messages sent here will appear on your CalX device.
                            Device responses will sync automatically.
                        </p>
                    </div>

                    <div className="flex-1 rounded-3xl border border-border bg-gradient-to-br from-card to-muted/20 p-6">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            Quick Messages
                        </h4>
                        <div className="space-y-3">
                            {[
                                "Check battery status",
                                "What's today's date?",
                                "Set a reminder",
                                "Calculate 15% tip on $85",
                                "Convert 100km to miles"
                            ].map((cmd, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(cmd)}
                                    disabled={!deviceId}
                                    className="w-full text-left p-3 rounded-xl bg-background border border-border hover:border-primary/50 text-xs font-mono text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
                                >
                                    {cmd}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
