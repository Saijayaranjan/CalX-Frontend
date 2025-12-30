"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Battery, Monitor, Type, Keyboard, Wifi, Brain, HardDrive, Download, Settings2 } from "lucide-react"

interface DeviceSettings {
    // Internet
    wifiSsid?: string;
    bleInternet: boolean;
    hotspotEnabled: boolean;
    // AI Config
    responseLength: string;
    formatting: string;
    temperature: string;
    // Keyboard
    keyboard: string;
    keyRepeat: string;
    longPressDelay: string;
    shiftBehavior: string;
    // Display
    theme: string;
    textSize: string;
    contrast: string;
    screenTimeout: number;
    // Power
    powerMode: string;
    sleepBehavior: string;
    batteryPercent: number;
    // Update
    autoUpdate: boolean;
    updateChannel: string;
    firmwareVersion: string;
    // Advanced
    debugMode: boolean;
}

const defaultSettings: DeviceSettings = {
    wifiSsid: "",
    bleInternet: false,
    hotspotEnabled: false,
    responseLength: "NORMAL",
    formatting: "PLAIN",
    temperature: "MEDIUM",
    keyboard: "T9",
    keyRepeat: "SLOW",
    longPressDelay: "MEDIUM",
    shiftBehavior: "HOLD",
    theme: "DARK",
    textSize: "NORMAL",
    contrast: "MEDIUM",
    screenTimeout: 30,
    powerMode: "NORMAL",
    sleepBehavior: "AUTO",
    batteryPercent: 0,
    autoUpdate: true,
    updateChannel: "STABLE",
    firmwareVersion: "v1.0.0",
    debugMode: false,
};

export default function DeviceSettingsPage() {
    const [settings, setSettings] = useState<DeviceSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get device ID from localStorage or context
        const storedDeviceId = localStorage.getItem("calx_device_id");
        if (storedDeviceId) {
            setDeviceId(storedDeviceId);
            fetchSettings(storedDeviceId);
        } else {
            setLoading(false);
            setError("No device bound. Please bind a device first.");
        }
    }, []);

    const fetchSettings = async (id: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/devices/${id}`);
            if (!res.ok) throw new Error("Failed to fetch settings");
            const data = await res.json();
            setSettings({ ...defaultSettings, ...data });
            setLastSync(new Date());
            setError(null);
        } catch (err) {
            console.error("Failed to fetch settings:", err);
            setError("Failed to load settings from server");
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        if (!deviceId) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/devices/${deviceId}/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (!res.ok) throw new Error("Failed to save");
            setLastSync(new Date());
            setError(null);
        } catch (err) {
            console.error("Failed to save settings:", err);
            setError("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handleSync = async () => {
        if (!deviceId) return;
        setIsSyncing(true);
        await fetchSettings(deviceId);
        setIsSyncing(false);
    };

    const formatTime = (date: Date | null) => {
        if (!date) return "Never";
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const updateSetting = <K extends keyof DeviceSettings>(key: K, value: DeviceSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error && !deviceId) {
        return (
            <div className="rounded-3xl border border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-foreground">Device Settings</h2>
                <p className="text-muted-foreground">Configure settings synced to your CalX device</p>
            </div>

            {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
                    {error}
                </div>
            )}

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
                <div className="flex gap-3">
                    <Button onClick={handleSync} disabled={isSyncing} variant="outline" className="rounded-full">
                        {isSyncing ? "Syncing..." : "Refresh"}
                    </Button>
                    <Button onClick={saveSettings} disabled={saving} className="rounded-full px-6">
                        {saving ? "Saving..." : "Save Settings"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Internet Settings */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                            <Wifi className="w-5 h-5 text-cyan-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Internet</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">WiFi Network</label>
                            <input
                                type="text"
                                value={settings.wifiSsid || ""}
                                onChange={(e) => updateSetting("wifiSsid", e.target.value)}
                                placeholder="Not connected"
                                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                            <span className="text-sm text-foreground">BLE Internet</span>
                            <button
                                onClick={() => updateSetting("bleInternet", !settings.bleInternet)}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.bleInternet ? "bg-primary" : "bg-muted"}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.bleInternet ? "translate-x-6" : "translate-x-0.5"}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Config */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-violet-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">AI Configuration</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Response Length</label>
                            <div className="flex gap-2">
                                {["SHORT", "NORMAL", "LONG"].map((len) => (
                                    <button
                                        key={len}
                                        onClick={() => updateSetting("responseLength", len)}
                                        className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${settings.responseLength === len ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                                    >
                                        {len.charAt(0) + len.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Formatting</label>
                            <div className="flex gap-2">
                                {[{ value: "PLAIN", label: "Plain" }, { value: "MATH_SAFE", label: "Math-Safe" }].map((fmt) => (
                                    <button
                                        key={fmt.value}
                                        onClick={() => updateSetting("formatting", fmt.value)}
                                        className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${settings.formatting === fmt.value ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                                    >
                                        {fmt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Temperature</label>
                            <div className="flex gap-2">
                                {["LOW", "MEDIUM", "HIGH"].map((temp) => (
                                    <button
                                        key={temp}
                                        onClick={() => updateSetting("temperature", temp)}
                                        className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${settings.temperature === temp ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                                    >
                                        {temp.charAt(0) + temp.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Keyboard Settings */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Keyboard className="w-5 h-5 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Keyboard</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Keyboard Type</label>
                            <div className="flex gap-3">
                                {["T9", "QWERTY"].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => updateSetting("keyboard", type)}
                                        className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${settings.keyboard === type ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Key Repeat</label>
                            <div className="flex gap-2">
                                {["OFF", "SLOW", "FAST"].map((speed) => (
                                    <button
                                        key={speed}
                                        onClick={() => updateSetting("keyRepeat", speed)}
                                        className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${settings.keyRepeat === speed ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                                    >
                                        {speed.charAt(0) + speed.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
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
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Theme</label>
                            <div className="flex gap-3">
                                {["DARK", "LIGHT"].map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() => updateSetting("theme", theme)}
                                        className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${settings.theme === theme ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                                    >
                                        {theme.charAt(0) + theme.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Text Size</label>
                            <div className="flex gap-2">
                                {[{ value: "SMALL", label: "Small (4 lines)" }, { value: "NORMAL", label: "Normal (3 lines)" }, { value: "LARGE", label: "Large (2 lines)" }].map((size) => (
                                    <button
                                        key={size.value}
                                        onClick={() => updateSetting("textSize", size.value)}
                                        className={`flex-1 py-2 px-1 rounded-xl border text-xs font-medium transition-all ${settings.textSize === size.value ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Screen Timeout</label>
                            <select
                                value={settings.screenTimeout}
                                onChange={(e) => updateSetting("screenTimeout", parseInt(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                            >
                                <option value={15}>15 seconds</option>
                                <option value={30}>30 seconds</option>
                                <option value={60}>1 minute</option>
                                <option value={120}>2 minutes</option>
                                <option value={0}>Never</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Power Settings */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Battery className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Power</h3>
                            <p className="text-xs text-muted-foreground">Battery: {settings.batteryPercent}%</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Power Mode</label>
                            <div className="flex gap-3">
                                {[{ value: "NORMAL", label: "Normal", desc: "Balanced" }, { value: "LOW", label: "Low Power", desc: "Extended battery" }].map((mode) => (
                                    <button
                                        key={mode.value}
                                        onClick={() => updateSetting("powerMode", mode.value)}
                                        className={`flex-1 py-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${settings.powerMode === mode.value ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                                    >
                                        <span>{mode.label}</span>
                                        <span className="text-xs opacity-70">{mode.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Device Info */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
                            <HardDrive className="w-5 h-5 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Device</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between p-3 rounded-xl bg-muted/20">
                            <span className="text-sm text-muted-foreground">Firmware</span>
                            <span className="text-sm font-medium text-foreground">{settings.firmwareVersion}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-xl bg-muted/20">
                            <span className="text-sm text-muted-foreground">Device ID</span>
                            <span className="text-sm font-mono text-foreground">{deviceId?.slice(0, 8)}...</span>
                        </div>
                    </div>
                </div>

                {/* Update Settings */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Download className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Updates</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                            <span className="text-sm text-foreground">Auto Update</span>
                            <button
                                onClick={() => updateSetting("autoUpdate", !settings.autoUpdate)}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.autoUpdate ? "bg-primary" : "bg-muted"}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.autoUpdate ? "translate-x-6" : "translate-x-0.5"}`} />
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Update Channel</label>
                            <div className="flex gap-3">
                                {["STABLE", "BETA"].map((channel) => (
                                    <button
                                        key={channel}
                                        onClick={() => updateSetting("updateChannel", channel)}
                                        className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${settings.updateChannel === channel ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}
                                    >
                                        {channel.charAt(0) + channel.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Settings */}
                <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <Settings2 className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Advanced</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                            <span className="text-sm text-foreground">Debug Mode</span>
                            <button
                                onClick={() => updateSetting("debugMode", !settings.debugMode)}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.debugMode ? "bg-primary" : "bg-muted"}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.debugMode ? "translate-x-6" : "translate-x-0.5"}`} />
                            </button>
                        </div>
                        <Button variant="destructive" className="w-full rounded-xl">
                            Factory Reset
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
