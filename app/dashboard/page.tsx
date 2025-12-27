"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Battery, Wifi, Clock, Cpu, RefreshCw, Unlink, Check, AlertCircle, Plus } from "lucide-react"
import { getDeviceList, revokeDeviceToken, getCurrentDevice, setCurrentDevice, getToken, type Device } from "@/lib/api"

export default function DashboardOverview() {
    const router = useRouter()
    const [devices, setDevices] = useState<Device[]>([])
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [isUnbinding, setIsUnbinding] = useState(false)

    useEffect(() => {
        if (!getToken()) {
            router.push("/login")
            return
        }

        fetchDevices()
    }, [router])

    const fetchDevices = async () => {
        setIsLoading(true)
        setError("")
        try {
            const deviceList = await getDeviceList()
            setDevices(deviceList)

            // Select current device or first device
            const currentId = getCurrentDevice()
            const currentDevice = deviceList.find(d => d.deviceId === currentId) || deviceList[0]
            if (currentDevice) {
                setSelectedDevice(currentDevice)
                setCurrentDevice(currentDevice.deviceId)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch devices")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectDevice = (device: Device) => {
        setSelectedDevice(device)
        setCurrentDevice(device.deviceId)
    }

    const handleUnbind = async () => {
        if (!selectedDevice) return

        if (!confirm(`Are you sure you want to unbind ${selectedDevice.deviceId}? You'll need to re-bind it.`)) {
            return
        }

        setIsUnbinding(true)
        try {
            await revokeDeviceToken(selectedDevice.deviceId)
            await fetchDevices()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to unbind device")
        } finally {
            setIsUnbinding(false)
        }
    }

    const formatLastSeen = (date: string | null) => {
        if (!date) return "Never"
        const d = new Date(date)
        const now = new Date()
        const diff = now.getTime() - d.getTime()

        if (diff < 60000) return "Just now"
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
        return d.toLocaleDateString()
    }

    if (isLoading) {
        return (
            <div className="w-full max-w-[1600px] mx-auto flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    if (devices.length === 0) {
        return (
            <div className="w-full max-w-[1600px] mx-auto space-y-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold text-foreground">Device Overview</h2>
                    <p className="text-muted-foreground">No devices bound to your account</p>
                </div>

                <div className="rounded-3xl border-2 border-dashed border-border p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                        <Cpu className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No CalX Device</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        Bind your CalX device to get started. Youll need the 4-character code displayed on your device.
                    </p>
                    <Link
                        href="/bind-device"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Bind Device
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-foreground">Device Overview</h2>
                <p className="text-muted-foreground">Monitor your CalX device status and information</p>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Device Selector (if multiple) */}
            {devices.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {devices.map((device) => (
                        <button
                            key={device.id}
                            onClick={() => handleSelectDevice(device)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors whitespace-nowrap ${selectedDevice?.id === device.id
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${device.online ? "bg-green-500" : "bg-muted-foreground"}`} />
                            {device.deviceId}
                        </button>
                    ))}
                    <Link
                        href="/bind-device"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Device
                    </Link>
                </div>
            )}

            {selectedDevice && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Main Identity Card - Spans 2 columns */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 rounded-3xl border border-border bg-gradient-to-br from-background to-muted/20 p-6 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${selectedDevice.online
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-muted text-muted-foreground border-border"
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedDevice.online ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                                {selectedDevice.online ? "Online" : "Offline"}
                            </div>
                        </div>

                        <div className="flex gap-4 items-start z-10">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                <Cpu className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-foreground">{selectedDevice.deviceId}</h3>
                                <p className="text-sm text-muted-foreground">ESP32-WROOM-32 • CalX Device</p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4 text-xs font-mono text-muted-foreground/70">
                            <span>FW: v{selectedDevice.firmwareVersion}</span>
                            <span>•</span>
                            <span>MODE: {selectedDevice.powerMode}</span>
                        </div>
                    </div>

                    {/* Battery Stat Card */}
                    <div className="col-span-1 rounded-3xl border border-border bg-card p-6 flex flex-col justify-between relative overflow-hidden hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-start">
                            <span className="text-muted-foreground font-medium flex items-center gap-2"><Battery className="w-4 h-4" /> Battery</span>
                            <span className="text-2xl font-bold text-foreground">{selectedDevice.batteryPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full mt-4 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ease-out ${selectedDevice.batteryPercent > 50 ? "bg-primary" :
                                    selectedDevice.batteryPercent > 20 ? "bg-yellow-500" : "bg-destructive"
                                    }`}
                                style={{ width: `${selectedDevice.batteryPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* WiFi Stat Card */}
                    <div className="col-span-1 rounded-3xl border border-border bg-card p-6 flex flex-col justify-between relative overflow-hidden hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-start">
                            <span className="text-muted-foreground font-medium flex items-center gap-2"><Wifi className="w-4 h-4" /> Status</span>
                            <span className={`text-lg font-bold ${selectedDevice.online ? "text-green-500" : "text-muted-foreground"}`}>
                                {selectedDevice.online ? "Connected" : "Offline"}
                            </span>
                        </div>
                        <div className="mt-4 flex items-end gap-1 h-8">
                            <div className={`w-1.5 h-3 rounded-sm ${selectedDevice.online ? "bg-primary/30" : "bg-muted"}`} />
                            <div className={`w-1.5 h-4 rounded-sm ${selectedDevice.online ? "bg-primary/60" : "bg-muted"}`} />
                            <div className={`w-1.5 h-6 rounded-sm ${selectedDevice.online ? "bg-primary" : "bg-muted"}`} />
                            <div className={`w-1.5 h-8 rounded-sm ${selectedDevice.online ? "bg-primary" : "bg-muted"}`} />
                        </div>
                    </div>

                    {/* Quick Actions Panel - Spans 2 columns */}
                    <div className="col-span-1 md:col-span-2 rounded-3xl border border-border bg-card p-6 flex flex-col gap-4">
                        <h4 className="font-medium text-foreground">Quick Actions</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button
                                onClick={fetchDevices}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-muted/30 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all group"
                            >
                                <RefreshCw className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                <span className="text-xs font-medium">Refresh</span>
                            </button>
                            <Link
                                href="/dashboard/ai-config"
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-muted/30 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all group"
                            >
                                <Cpu className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                <span className="text-xs font-medium">AI Config</span>
                            </Link>
                            <Link
                                href="/dashboard/chat"
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-muted/30 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all group"
                            >
                                <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-xs font-medium">Chat</span>
                            </Link>
                            <button
                                onClick={handleUnbind}
                                disabled={isUnbinding}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-muted/30 hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all group disabled:opacity-50"
                            >
                                <Unlink className={`w-5 h-5 text-muted-foreground group-hover:text-destructive ${isUnbinding ? 'animate-spin' : ''}`} />
                                <span className="text-xs font-medium">{isUnbinding ? 'Unbinding...' : 'Unbind'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Last Seen */}
                    <div className="col-span-1 rounded-3xl border border-border bg-card p-6 flex flex-col justify-center gap-1 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <Clock className="w-4 h-4" /> Last Seen
                        </div>
                        <div className="text-xl font-semibold text-foreground">
                            {formatLastSeen(selectedDevice.lastSeen)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {selectedDevice.lastSeen ? new Date(selectedDevice.lastSeen).toLocaleString() : 'Never connected'}
                        </p>
                    </div>

                    {/* Firmware */}
                    <div className="col-span-1 rounded-3xl border border-border bg-card p-6 flex flex-col justify-center gap-1 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <Cpu className="w-4 h-4" /> Firmware
                        </div>
                        <div className="text-xl font-semibold text-foreground">v{selectedDevice.firmwareVersion}</div>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Up to date
                        </p>
                    </div>

                    {/* WiFi Network */}
                    <div className="col-span-1 rounded-3xl border border-border bg-card p-6 flex flex-col justify-center gap-1 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <Wifi className="w-4 h-4" /> WiFi Network
                        </div>
                        <div className="text-lg font-semibold text-foreground truncate">
                            {selectedDevice.wifiSsid || 'Not connected'}
                        </div>
                        <p className="text-xs text-muted-foreground">Current network</p>
                    </div>

                    {/* Storage */}
                    <div className="col-span-1 rounded-3xl border border-border bg-card p-6 flex flex-col justify-center gap-1 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                            Storage
                        </div>
                        <div className="text-xl font-semibold text-foreground">
                            {selectedDevice.freeStorage ? `${Math.round(selectedDevice.freeStorage / 1024)}KB` : 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">Available</p>
                    </div>

                    {/* RAM */}
                    <div className="col-span-1 rounded-3xl border border-border bg-card p-6 flex flex-col justify-center gap-1 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <Cpu className="w-4 h-4" /> RAM
                        </div>
                        <div className="text-xl font-semibold text-foreground">
                            {selectedDevice.freeRam ? `${Math.round(selectedDevice.freeRam / 1024)}KB` : 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">Free memory</p>
                    </div>
                </div>
            )}
        </div>
    )
}
