"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Cpu, Zap, Key, Loader2, Check, AlertCircle } from "lucide-react"
import { updateDeviceSettings, fetchModelsFromProvider, getCurrentDevice, getToken } from "@/lib/api"
import { useRouter } from "next/navigation"

// AI Provider configurations
const AI_PROVIDERS = [
    { id: "OPENAI", name: "ChatGPT (OpenAI)", placeholder: "sk-...", apiId: "openai" },
    { id: "ANTHROPIC", name: "Claude (Anthropic)", placeholder: "sk-ant-...", apiId: "anthropic" },
    { id: "GEMINI", name: "Google (Gemini)", placeholder: "AIza...", apiId: "google" },
    { id: "DEEPSEEK", name: "DeepSeek", placeholder: "sk-...", apiId: "deepseek" },
    { id: "PERPLEXITY", name: "Perplexity", placeholder: "pplx-...", apiId: "perplexity" },
    { id: "GROQ", name: "Groq", placeholder: "gsk_...", apiId: "groq" },
    { id: "OPENROUTER", name: "OpenRouter", placeholder: "sk-or-...", apiId: "openrouter" },
]

export default function AIConfigPage() {
    const router = useRouter()
    const [selectedProvider, setSelectedProvider] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [models, setModels] = useState<{ id: string; name: string }[]>([])
    const [selectedModel, setSelectedModel] = useState("")
    const [isFetchingModels, setIsFetchingModels] = useState(false)
    const [fetchError, setFetchError] = useState("")
    const [maxTokens, setMaxTokens] = useState(512)
    const [temperature, setTemperature] = useState(0.7)
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [saveError, setSaveError] = useState("")
    const [deviceId, setDeviceId] = useState<string | null>(null)

    useEffect(() => {
        // Check auth
        if (!getToken()) {
            router.push("/login")
            return
        }

        // Get current device
        const device = getCurrentDevice()
        setDeviceId(device)
    }, [router])

    // Reset models when provider changes
    useEffect(() => {
        setModels([])
        setSelectedModel("")
        setApiKey("")
        setFetchError("")
    }, [selectedProvider])

    const handleFetchModels = async () => {
        if (!apiKey.trim()) {
            setFetchError("Please enter an API key")
            return
        }

        const provider = AI_PROVIDERS.find(p => p.id === selectedProvider)
        if (!provider) return

        setIsFetchingModels(true)
        setFetchError("")

        try {
            const fetchedModels = await fetchModelsFromProvider(provider.apiId, apiKey)
            setModels(fetchedModels)
            if (fetchedModels.length > 0) {
                setSelectedModel(fetchedModels[0].id)
            }
        } catch {
            setFetchError("Failed to fetch models. Please check your API key.")
        } finally {
            setIsFetchingModels(false)
        }
    }

    const handleSave = async () => {
        if (!deviceId) {
            setSaveError("No device selected. Please bind a device first.")
            return
        }

        if (!selectedProvider || !selectedModel || !apiKey) {
            setSaveError("Please select a provider, model, and enter an API key")
            return
        }

        setIsSaving(true)
        setSaveError("")

        try {
            await updateDeviceSettings({
                device_id: deviceId,
                ai_config: {
                    provider: selectedProvider as 'OPENAI' | 'ANTHROPIC' | 'GEMINI' | 'DEEPSEEK' | 'PERPLEXITY' | 'GROQ' | 'OPENROUTER',
                    model: selectedModel,
                    max_chars: maxTokens * 4, // Convert tokens to approximate chars
                    temperature: temperature,
                    api_key: apiKey,
                },
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Failed to save settings")
        } finally {
            setIsSaving(false)
        }
    }

    const currentProvider = AI_PROVIDERS.find(p => p.id === selectedProvider)

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-foreground">AI Configuration</h2>
                <p className="text-muted-foreground">
                    Configure AI settings for your CalX device
                    {deviceId && <span className="text-primary ml-2">({deviceId})</span>}
                </p>
            </div>

            {!deviceId && (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                    <p className="text-sm">No device bound. Please <a href="/bind-device" className="underline">bind a device</a> first.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Provider & API Key Card */}
                <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    {/* Provider Selection */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">AI Provider</h3>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-foreground">
                                Select Provider
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {AI_PROVIDERS.map((provider) => (
                                    <div
                                        key={provider.id}
                                        onClick={() => setSelectedProvider(provider.id)}
                                        className={`cursor-pointer rounded-xl border p-3 sm:p-4 transition-all text-center ${selectedProvider === provider.id
                                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                            : "border-border hover:border-border/80 hover:bg-muted/30"
                                            }`}
                                    >
                                        <span className="font-medium text-foreground text-sm">{provider.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* API Key Input */}
                    {selectedProvider && (
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <Key className="w-5 h-5 text-green-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">API Key</h3>
                            </div>

                            <div className="space-y-3">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder={currentProvider?.placeholder || "Enter your API key"}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors font-mono text-sm"
                                />

                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handleFetchModels}
                                        disabled={isFetchingModels || !apiKey.trim()}
                                        className="rounded-xl"
                                    >
                                        {isFetchingModels ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Fetching Models...
                                            </>
                                        ) : (
                                            "Fetch Available Models"
                                        )}
                                    </Button>

                                    {models.length > 0 && (
                                        <span className="text-sm text-green-500 flex items-center gap-1">
                                            <Check className="w-4 h-4" />
                                            {models.length} models found
                                        </span>
                                    )}
                                </div>

                                {fetchError && (
                                    <div className="flex items-center gap-2 text-sm text-destructive">
                                        <AlertCircle className="w-4 h-4" />
                                        {fetchError}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Model Selection */}
                    {models.length > 0 && (
                        <div className="relative z-10 space-y-4">
                            <label className="block text-sm font-medium text-foreground">
                                Select Model
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                                {models.map((model) => (
                                    <div
                                        key={model.id}
                                        onClick={() => setSelectedModel(model.id)}
                                        className={`cursor-pointer rounded-xl border p-4 transition-all ${selectedModel === model.id
                                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                            : "border-border hover:border-border/80 hover:bg-muted/30"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-foreground">{model.name}</span>
                                            {selectedModel === model.id && (
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 font-mono">{model.id}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Parameters Column */}
                <div className="space-y-6">
                    {/* Parameters Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Parameters</h3>
                        </div>

                        {/* Max Response Length */}
                        <div>
                            <div className="flex justify-between mb-3">
                                <label className="text-sm font-medium text-foreground">Max Length</label>
                                <span className="text-sm font-mono text-muted-foreground">{maxTokens} tokens</span>
                            </div>
                            <input
                                type="range"
                                min={64}
                                max={2048}
                                step={64}
                                value={maxTokens}
                                onChange={(e) => setMaxTokens(Number(e.target.value))}
                                className="w-full accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>Short</span>
                                <span>Long</span>
                            </div>
                        </div>

                        {/* Temperature */}
                        <div>
                            <div className="flex justify-between mb-3">
                                <label className="text-sm font-medium text-foreground">Temperature</label>
                                <span className="text-sm font-mono text-muted-foreground">{temperature.toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={2}
                                step={0.1}
                                value={temperature}
                                onChange={(e) => setTemperature(Number(e.target.value))}
                                className="w-full accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>Precise</span>
                                <span>Creative</span>
                            </div>
                        </div>
                    </div>

                    {/* API Key Security Notice */}
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your API key is stored securely on our servers and used only to make AI requests on behalf of your CalX device.
                        </p>
                        <div className="mt-4 p-3 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground font-mono">
                            🔒 Encrypted Storage
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-6 rounded-3xl border border-border bg-card">
                {saveError && (
                    <span className="text-sm text-destructive font-medium">
                        {saveError}
                    </span>
                )}
                {saved && (
                    <span className="text-sm text-green-500 font-medium animate-in fade-in slide-in-from-right-4">
                        Settings saved successfully!
                    </span>
                )}
                <Button
                    onClick={handleSave}
                    disabled={isSaving || !selectedModel || !deviceId}
                    size="lg"
                    className="w-full sm:w-auto rounded-xl px-8"
                >
                    {isSaving ? "Saving..." : "Save Configuration"}
                </Button>
            </div>
        </div>
    )
}
