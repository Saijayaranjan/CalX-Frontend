// API Configuration for CalX Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://calx-api.vercel.app";

// Token storage keys
const TOKEN_KEY = 'calx_token';
const USER_KEY = 'calx_user';
const DEVICE_KEY = 'calx_device';

// Auth helpers
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(DEVICE_KEY);
}

export function getUser(): { id: string; email: string } | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

export function setUser(user: { id: string; email: string }): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getCurrentDevice(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(DEVICE_KEY);
}

export function setCurrentDevice(deviceId: string): void {
    localStorage.setItem(DEVICE_KEY, deviceId);
}

// API Request helper
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}

// ============================================================================
// Auth API
// ============================================================================

export async function register(email: string, password: string): Promise<{ user_id: string }> {
    const response = await apiRequest<{ success: boolean; data: { user_id: string } }>('/web/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    return response.data;
}

export async function login(email: string, password: string): Promise<{ token: string; user: { id: string; email: string } }> {
    const response = await apiRequest<{ success: boolean; data: { token: string; user: { id: string; email: string } } }>('/web/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    // Store token and user
    setToken(response.data.token);
    setUser(response.data.user);

    return response.data;
}

export function logout(): void {
    removeToken();
    window.location.href = '/login';
}

// ============================================================================
// Device API
// ============================================================================

export interface Device {
    id: string;
    deviceId: string;
    firmwareVersion: string;
    batteryPercent: number;
    online: boolean;
    lastSeen: string | null;
    powerMode: 'NORMAL' | 'LOW';
    textSize: 'SMALL' | 'NORMAL' | 'LARGE';
    keyboard: 'QWERTY' | 'T9';
    screenTimeout: number;
    wifiSsid?: string | null;
    freeStorage?: number | null;
    freeRam?: number | null;
}

export async function getDeviceList(): Promise<Device[]> {
    const response = await apiRequest<{ success: boolean; data: { devices: Device[] } }>('/web/device/list');
    return response.data.devices;
}

export async function bindDevice(bindCode: string): Promise<{ status: string; device_id: string }> {
    const response = await apiRequest<{ success: boolean; data: { status: string; device_id: string } }>('/web/bind/confirm', {
        method: 'POST',
        body: JSON.stringify({ bind_code: bindCode }),
    });
    return response.data;
}

export async function getDeviceActivity(deviceId: string): Promise<{
    last_ai_query: string | null;
    last_file_sync: string | null;
    last_chat_message: string | null;
}> {
    const response = await apiRequest<{ success: boolean; data: { last_ai_query: string | null; last_file_sync: string | null; last_chat_message: string | null } }>(`/web/device/${deviceId}/activity`);
    return response.data;
}

export async function revokeDeviceToken(deviceId: string): Promise<void> {
    await apiRequest<{ success: boolean }>(`/web/device/${deviceId}/revoke-token`, {
        method: 'POST',
    });
}

// ============================================================================
// Settings API
// ============================================================================

export interface DeviceSettings {
    device_id: string;
    power_mode?: 'NORMAL' | 'LOW';
    text_size?: 'SMALL' | 'NORMAL' | 'LARGE';
    keyboard?: 'QWERTY' | 'T9';
    screen_timeout?: number;
    ai_config?: {
        provider?: 'OPENAI' | 'ANTHROPIC' | 'GEMINI' | 'DEEPSEEK' | 'PERPLEXITY' | 'GROQ' | 'OPENROUTER';
        model?: string;
        max_chars?: number;
        temperature?: number;
        api_key?: string;
    };
}

export async function updateDeviceSettings(settings: DeviceSettings): Promise<void> {
    await apiRequest<{ success: boolean }>('/web/device/settings', {
        method: 'POST',
        body: JSON.stringify(settings),
    });
}

// ============================================================================
// Chat API
// ============================================================================

export interface ChatMessage {
    id: string;
    sender: 'DEVICE' | 'WEB';
    content: string;
    createdAt: string;
}

export async function getMessages(deviceId: string, since?: string): Promise<ChatMessage[]> {
    const params = new URLSearchParams({ device_id: deviceId });
    if (since) params.append('since', since);

    const response = await apiRequest<{ success: boolean; data: { messages: ChatMessage[] } }>(`/web/chat/messages?${params}`);
    return response.data.messages;
}

export async function sendMessage(deviceId: string, content: string): Promise<ChatMessage> {
    const response = await apiRequest<{ success: boolean; data: { message: ChatMessage } }>('/web/chat/send', {
        method: 'POST',
        body: JSON.stringify({ device_id: deviceId, content }),
    });
    return response.data.message;
}

// ============================================================================
// File API
// ============================================================================

export interface FileContent {
    content: string;
    char_count: number;
    updated_at: string;
}

export async function uploadFile(deviceId: string, content: string): Promise<{ char_count: number }> {
    const response = await apiRequest<{ success: boolean; data: { char_count: number } }>('/web/file/upload', {
        method: 'POST',
        body: JSON.stringify({ device_id: deviceId, content }),
    });
    return response.data;
}

export async function deleteFile(deviceId: string): Promise<void> {
    await apiRequest<{ success: boolean }>(`/web/file/${deviceId}`, {
        method: 'DELETE',
    });
}

// ============================================================================
// OTA Update API
// ============================================================================

export interface Firmware {
    id: string;
    version: string;
    notes: string | null;
    createdAt: string;
}

export async function triggerOTA(deviceId: string, firmwareId: string): Promise<{ job_id: string }> {
    const response = await apiRequest<{ success: boolean; data: { job_id: string } }>('/web/device/update/trigger', {
        method: 'POST',
        body: JSON.stringify({ device_id: deviceId, firmware_id: firmwareId }),
    });
    return response.data;
}

export async function getFirmwareList(): Promise<Firmware[]> {
    const response = await apiRequest<{ success: boolean; data: { firmware: Firmware[] } }>('/web/device/update/firmware');
    return response.data.firmware;
}

// ============================================================================
// Model Fetching (for AI Config)
// ============================================================================

export async function fetchModelsFromProvider(
    provider: string,
    apiKey: string
): Promise<{ id: string; name: string }[]> {
    // Fetch models directly from provider APIs
    switch (provider) {
        case 'openai':
            return fetchOpenAIModels(apiKey);
        case 'google':
            return fetchGeminiModels(apiKey);
        case 'anthropic':
            return fetchAnthropicModels();
        case 'perplexity':
            return fetchPerplexityModels();
        case 'groq':
            return fetchGroqModels(apiKey);
        case 'deepseek':
            return fetchDeepSeekModels();
        case 'openrouter':
            return fetchOpenRouterModels(apiKey);
        default:
            return [];
    }
}

async function fetchOpenAIModels(apiKey: string): Promise<{ id: string; name: string }[]> {
    const response = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await response.json();
    if (!data.data) return [];

    return data.data
        .filter((m: { id: string }) => m.id.includes('gpt'))
        .map((m: { id: string }) => ({ id: m.id, name: m.id }))
        .slice(0, 10);
}

async function fetchGeminiModels(apiKey: string): Promise<{ id: string; name: string }[]> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if (!data.models) return [];

    return data.models
        .filter((m: { supportedGenerationMethods?: string[] }) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m: { name: string; displayName: string }) => ({
            id: m.name.replace('models/', ''),
            name: m.displayName,
        }))
        .slice(0, 10);
}

async function fetchAnthropicModels(): Promise<{ id: string; name: string }[]> {
    // Anthropic doesn't have a list models API, return known models
    return [
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
    ];
}

async function fetchPerplexityModels(): Promise<{ id: string; name: string }[]> {
    return [
        { id: 'sonar', name: 'Sonar (Default)' },
        { id: 'sonar-pro', name: 'Sonar Pro' },
        { id: 'sonar-reasoning', name: 'Sonar Reasoning' },
    ];
}

async function fetchGroqModels(apiKey: string): Promise<{ id: string; name: string }[]> {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await response.json();
    if (!data.data) return [];

    return data.data.map((m: { id: string }) => ({ id: m.id, name: m.id })).slice(0, 10);
}

async function fetchDeepSeekModels(): Promise<{ id: string; name: string }[]> {
    return [
        { id: 'deepseek-chat', name: 'DeepSeek Chat' },
        { id: 'deepseek-coder', name: 'DeepSeek Coder' },
    ];
}

async function fetchOpenRouterModels(apiKey: string): Promise<{ id: string; name: string }[]> {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await response.json();
    if (!data.data) return [];

    return data.data
        .map((m: { id: string; name: string }) => ({ id: m.id, name: m.name || m.id }))
        .slice(0, 20);
}

export { API_BASE_URL };
