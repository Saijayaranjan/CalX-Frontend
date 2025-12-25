import { NextRequest, NextResponse } from "next/server"

// Provider configurations
const PROVIDER_CONFIGS: Record<string, { modelsEndpoint: string; authHeader: string; responseParser: (data: unknown) => { id: string; name: string }[] }> = {
    openai: {
        modelsEndpoint: "https://api.openai.com/v1/models",
        authHeader: "Bearer",
        responseParser: (data: unknown) => {
            const d = data as { data: { id: string }[] }
            // Filter to only show chat models
            const chatModels = d.data
                .filter((m) => m.id.includes("gpt") || m.id.includes("o1") || m.id.includes("chatgpt"))
                .map((m) => ({ id: m.id, name: m.id }))
                .sort((a, b) => a.id.localeCompare(b.id))
            return chatModels.slice(0, 20) // Limit to 20 models
        },
    },
    anthropic: {
        modelsEndpoint: "https://api.anthropic.com/v1/models",
        authHeader: "x-api-key",
        responseParser: (data: unknown) => {
            const d = data as { data: { id: string; display_name?: string }[] }
            return d.data.map((m) => ({
                id: m.id,
                name: m.display_name || m.id,
            }))
        },
    },
    google: {
        modelsEndpoint: "https://generativelanguage.googleapis.com/v1beta/models",
        authHeader: "key", // Uses query param instead
        responseParser: (data: unknown) => {
            const d = data as { models: { name: string; displayName: string }[] }
            return d.models
                .filter((m) => m.name.includes("gemini"))
                .map((m) => ({
                    id: m.name.replace("models/", ""),
                    name: m.displayName,
                }))
        },
    },
    deepseek: {
        modelsEndpoint: "https://api.deepseek.com/models",
        authHeader: "Bearer",
        responseParser: (data: unknown) => {
            const d = data as { data: { id: string }[] }
            return d.data.map((m) => ({ id: m.id, name: m.id }))
        },
    },
    perplexity: {
        modelsEndpoint: "https://api.perplexity.ai/models",
        authHeader: "Bearer",
        responseParser: (data: unknown) => {
            const d = data as { data?: { id: string }[]; models?: string[] }
            if (d.data) {
                return d.data.map((m) => ({ id: m.id, name: m.id }))
            }
            if (d.models) {
                return d.models.map((m) => ({ id: m, name: m }))
            }
            return []
        },
    },
    groq: {
        modelsEndpoint: "https://api.groq.com/openai/v1/models",
        authHeader: "Bearer",
        responseParser: (data: unknown) => {
            const d = data as { data: { id: string }[] }
            return d.data.map((m) => ({ id: m.id, name: m.id }))
        },
    },
    openrouter: {
        modelsEndpoint: "https://openrouter.ai/api/v1/models",
        authHeader: "Bearer",
        responseParser: (data: unknown) => {
            const d = data as { data: { id: string; name?: string }[] }
            return d.data
                .slice(0, 30) // Limit results
                .map((m) => ({ id: m.id, name: m.name || m.id }))
        },
    },
}

// Fallback models for providers that don't have a models endpoint or when API fails
const FALLBACK_MODELS: Record<string, { id: string; name: string }[]> = {
    openai: [
        { id: "gpt-4o", name: "GPT-4o" },
        { id: "gpt-4o-mini", name: "GPT-4o Mini" },
        { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
        { id: "gpt-4", name: "GPT-4" },
        { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    ],
    anthropic: [
        { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
        { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku" },
        { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
        { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
        { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
    ],
    google: [
        { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash" },
        { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
        { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
        { id: "gemini-1.0-pro", name: "Gemini 1.0 Pro" },
    ],
    deepseek: [
        { id: "deepseek-chat", name: "DeepSeek Chat" },
        { id: "deepseek-coder", name: "DeepSeek Coder" },
    ],
    perplexity: [
        { id: "llama-3.1-sonar-huge-128k-online", name: "Sonar Huge (Online)" },
        { id: "llama-3.1-sonar-large-128k-online", name: "Sonar Large (Online)" },
        { id: "llama-3.1-sonar-small-128k-online", name: "Sonar Small (Online)" },
    ],
    groq: [
        { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
        { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant" },
        { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
        { id: "gemma2-9b-it", name: "Gemma 2 9B" },
    ],
    openrouter: [
        { id: "openai/gpt-4o", name: "GPT-4o" },
        { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
        { id: "google/gemini-pro-1.5", name: "Gemini 1.5 Pro" },
        { id: "meta-llama/llama-3.1-405b-instruct", name: "Llama 3.1 405B" },
    ],
    local: [
        { id: "custom", name: "Custom Model" },
    ],
}

export async function POST(request: NextRequest) {
    try {
        const { provider, apiKey } = await request.json()

        if (!provider || !apiKey) {
            return NextResponse.json(
                { error: "Provider and API key are required" },
                { status: 400 }
            )
        }

        // Handle local/custom provider
        if (provider === "local") {
            return NextResponse.json({ models: FALLBACK_MODELS.local })
        }

        const config = PROVIDER_CONFIGS[provider]
        if (!config) {
            return NextResponse.json(
                { error: "Unknown provider", models: FALLBACK_MODELS[provider] || [] },
                { status: 400 }
            )
        }

        try {
            // Build the request
            let url = config.modelsEndpoint
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            }

            // Different auth methods
            if (config.authHeader === "key") {
                // Google uses query param
                url = `${url}?key=${apiKey}`
            } else if (config.authHeader === "x-api-key") {
                // Anthropic uses x-api-key header
                headers["x-api-key"] = apiKey
                headers["anthropic-version"] = "2023-06-01"
            } else {
                // Most use Bearer token
                headers["Authorization"] = `Bearer ${apiKey}`
            }

            const response = await fetch(url, {
                method: "GET",
                headers,
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error(`API error for ${provider}:`, errorText)
                // Return fallback models on API error
                return NextResponse.json({
                    models: FALLBACK_MODELS[provider] || [],
                    warning: "Could not fetch models from API, showing common models",
                })
            }

            const data = await response.json()
            const models = config.responseParser(data)

            if (models.length === 0) {
                return NextResponse.json({
                    models: FALLBACK_MODELS[provider] || [],
                    warning: "No models returned from API, showing common models",
                })
            }

            return NextResponse.json({ models })
        } catch (fetchError) {
            console.error(`Fetch error for ${provider}:`, fetchError)
            // Return fallback models on network error
            return NextResponse.json({
                models: FALLBACK_MODELS[provider] || [],
                warning: "Network error, showing common models",
            })
        }
    } catch (error) {
        console.error("Error in fetch-models:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
