"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Battery, Monitor, Type, Keyboard } from "lucide-react"

export default function DeviceSettingsPage() {
    const [powerMode, setPowerMode] = useState<"normal" | "low">("normal")
    const [screenTimeout, setScreenTimeout] = useState("30s")
    const [textSize, setTextSize] = useState<"small" | "normal" | "large">("normal")
    const [keyboardType, setKeyboardType] = useState<"qwerty" | "t9">("qwerty")
    const [isSyncing, setIsSyncing] = useState(false)
    const [lastSync, setLastSync] = useState(new Date())

    const handleSync = async () => {
        setIsSyncing(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setLastSync(new Date())
        setIsSyncing(false)
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-foreground">Device Settings</h2>
                <p className="text-muted-foreground">Configure settings synced to your CalX device</p>
            </div>

            {/* Sync Bar */}
            <div className="rounded-3xl border border-border bg-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <RefreshCw className={`w-5 h-5 text-primary ${isSyncing ? "animate-spin" : ""}`} />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">Settings Sync</p>
                        <p className="text-xs text-muted-foreground">Last synced: {formatTime(lastSync)}</p>
                    </div>
                </div>
                <Button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="rounded-full px-6"
                >
                    {isSyncing ? "Syncing..." : "Sync Now"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Power Mode */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Battery className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Power Management</h3>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-muted-foreground">Power Mode</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPowerMode("normal")}
                                className={`flex-1 px-4 py-8 rounded-2xl border text-sm font-medium transition-all flex flex-col items-center gap-2 ${powerMode === "normal"
                                    ? "bg-primary/5 border-primary text-primary"
                                    : "border-border text-muted-foreground hover:bg-muted/50"
                                    }`}
                            >
                                <span className="text-lg">Normal</span>
                                <span className="text-xs opacity-70">Balanced performance</span>
                            </button>
                            <button
                                onClick={() => setPowerMode("low")}
                                className={`flex-1 px-4 py-8 rounded-2xl border text-sm font-medium transition-all flex flex-col items-center gap-2 ${powerMode === "low"
                                    ? "bg-primary/5 border-primary text-primary"
                                    : "border-border text-muted-foreground hover:bg-muted/50"
                                    }`}
                            >
                                <span className="text-lg">Low Power</span>
                                <span className="text-xs opacity-70">Extends battery life</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Display Settings */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Display</h3>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-muted-foreground">Screen Timeout</label>
                        <select
                            value={screenTimeout}
                            onChange={(e) => setScreenTimeout(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="15s">15 seconds</option>
                            <option value="30s">30 seconds</option>
                            <option value="1m">1 minute</option>
                            <option value="5m">5 minutes</option>
                            <option value="never">Never</option>
                        </select>
                    </div>
                </div>

                {/* Interface Settings */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Type className="w-5 h-5 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Interface</h3>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-muted-foreground">Text Size</label>
                        <div className="flex gap-3">
                            {(["small", "normal", "large"] as const).map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setTextSize(size)}
                                    className={`flex-1 py-4 rounded-xl border text-sm font-medium transition-all ${textSize === size
                                        ? "bg-primary/5 border-primary text-primary"
                                        : "border-border text-muted-foreground hover:bg-muted/50"
                                        }`}
                                >
                                    <span className={size === "small" ? "text-xs" : size === "large" ? "text-lg" : "text-sm"}>Aa</span>
                                    <span className="block text-[10px] mt-1 opacity-70 capitalize">{size}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input Settings */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Keyboard className="w-5 h-5 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Input Method</h3>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-muted-foreground">Keyboard Layout</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setKeyboardType("qwerty")}
                                className={`flex-1 py-4 rounded-xl border text-sm font-medium transition-all ${keyboardType === "qwerty"
                                    ? "bg-primary/5 border-primary text-primary"
                                    : "border-border text-muted-foreground hover:bg-muted/50"
                                    }`}
                            >
                                QWERTY
                            </button>
                            <button
                                onClick={() => setKeyboardType("t9")}
                                className={`flex-1 py-4 rounded-xl border text-sm font-medium transition-all ${keyboardType === "t9"
                                    ? "bg-primary/5 border-primary text-primary"
                                    : "border-border text-muted-foreground hover:bg-muted/50"
                                    }`}
                            >
                                T9 Numeric
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
