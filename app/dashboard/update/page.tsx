"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, AlertTriangle, CheckCircle, Cpu, Download, History, Zap } from "lucide-react"

export default function UpdatePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [updateComplete, setUpdateComplete] = useState(false)
    const [error, setError] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const currentVersion = "1.2.4"
    const releaseDate = "December 20, 2024"

    // Simulated battery level - in production this comes from device
    const batteryLevel = 72 // Change this to test: e.g., 25 for low battery
    const isBatteryLow = batteryLevel < 30

    const handleFileSelect = (file: File) => {
        setError("")
        setUpdateComplete(false)

        if (!file.name.endsWith(".bin")) {
            setError("Invalid file type. Please select a .bin firmware file.")
            return
        }

        setSelectedFile(file)
    }

    const handleUpdate = async () => {
        if (!selectedFile) return

        setIsUpdating(true)
        setProgress(0)
        setError("")

        // Simulate OTA update progress
        for (let i = 0; i <= 100; i += 2) {
            await new Promise((resolve) => setTimeout(resolve, 100))
            setProgress(i)
        }

        setIsUpdating(false)
        setUpdateComplete(true)
        setSelectedFile(null)
    }

    const handleCancel = () => {
        setSelectedFile(null)
        setError("")
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-foreground">Firmware Update</h2>
                <p className="text-muted-foreground">Manage and update your CalX device firmware</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Col: Status & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Current Version Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Cpu className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Current Version</h3>
                                <p className="text-sm font-mono text-muted-foreground">v{currentVersion}</p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <span className="text-green-500 font-medium">Active</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Installed</span>
                                <span className="text-foreground">{releaseDate}</span>
                            </div>
                        </div>

                        <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-0" variant="outline">
                            Check for Updates
                        </Button>
                    </div>

                    {/* Quick Tips */}
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            Update Tips
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-1.5" />
                                Keep device powered on during update
                            </li>
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-1.5" />
                                Ensure stable Wi-Fi connection
                            </li>
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-1.5" />
                                Device will auto-restart when done
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Col: Update Interface */}
                <div className="lg:col-span-2">
                    <div className="rounded-3xl border border-border bg-card p-8 h-full flex flex-col justify-center min-h-[400px]">

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {updateComplete && (
                            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                Firmware update completed successfully! Your device is restarting...
                            </div>
                        )}

                        {!isUpdating ? (
                            <div className="flex flex-col items-center text-center">
                                {!selectedFile ? (
                                    <>
                                        <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                                            <Download className="w-10 h-10 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            Manual Firmware Update
                                        </h3>
                                        <p className="text-muted-foreground mb-8 max-w-md">
                                            Upload a standard .bin firmware file not available via OTA. Warning: Only flash official firmware.
                                        </p>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                            accept=".bin"
                                            className="hidden"
                                        />
                                        <Button
                                            size="lg"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="rounded-full px-8"
                                        >
                                            Select Firmware File
                                        </Button>
                                    </>
                                ) : (
                                    <div className="w-full max-w-md space-y-6">
                                        <div className="p-6 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                                            <div className="text-left">
                                                <p className="font-semibold text-foreground">{selectedFile.name}</p>
                                                <p className="text-sm font-mono text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <Button variant="ghost" onClick={handleCancel} className="text-muted-foreground hover:text-destructive">
                                                Cancel
                                            </Button>
                                        </div>

                                        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-left">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-sm text-yellow-500/90 leading-relaxed">
                                                    Do not disconnect your device during the update process. Doing so may brick your device.
                                                </p>
                                            </div>
                                        </div>

                                        {isBatteryLow && (
                                            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-left">
                                                <div className="flex items-start gap-3">
                                                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-destructive">Battery too low for update</p>
                                                        <p className="text-xs text-destructive/80 mt-1">
                                                            Battery must be above 30% to perform firmware update. Current: {batteryLevel}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <Button
                                            onClick={handleUpdate}
                                            size="lg"
                                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isBatteryLow}
                                        >
                                            {isBatteryLow ? "Battery Too Low" : "Start Installation"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full max-w-md mx-auto space-y-8 text-center">
                                <div className="space-y-4">
                                    <span className="text-5xl font-mono font-bold text-foreground tracking-tight">
                                        {progress}%
                                    </span>
                                    <p className="text-muted-foreground animate-pulse">
                                        {progress < 30 ? "Preparing device..." : progress < 80 ? "Flashing firmware..." : "Finalizing..."}
                                    </p>
                                </div>

                                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <p className="text-xs text-destructive font-medium">
                                    Please waiting... Do not power off
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
