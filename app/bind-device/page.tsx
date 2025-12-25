"use client"

import { useState, useRef, KeyboardEvent, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calculator, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { bindDevice, getToken, setCurrentDevice } from "@/lib/api"

export default function BindDevicePage() {
    const router = useRouter()
    const [code, setCode] = useState(["", "", "", ""])  // 4 characters as per spec
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [boundDeviceId, setBoundDeviceId] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        // Check if user is logged in
        setIsLoggedIn(!!getToken())
    }, [])

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(-1)
        }

        // Only allow alphanumeric
        if (!/^[a-zA-Z0-9]*$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value.toUpperCase()
        setCode(newCode)

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        const fullCode = code.join("")
        if (fullCode.length !== 4) {
            setError("Please enter a complete 4-character code")
            setIsLoading(false)
            return
        }

        // Check if user is logged in
        if (!getToken()) {
            setError("Please log in first to bind a device")
            setIsLoading(false)
            return
        }

        try {
            const result = await bindDevice(fullCode)
            setBoundDeviceId(result.device_id)
            setCurrentDevice(result.device_id)
            setSuccess(true)

            // Redirect to dashboard after a delay
            setTimeout(() => {
                router.push("/dashboard")
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to bind device")
        } finally {
            setIsLoading(false)
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4)
        const newCode = [...code]
        for (let i = 0; i < pastedData.length; i++) {
            newCode[i] = pastedData[i]
        }
        setCode(newCode)
        if (pastedData.length === 4) {
            inputRefs.current[3]?.focus()
        } else if (pastedData.length > 0) {
            inputRefs.current[pastedData.length]?.focus()
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="w-full py-4 px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Calculator className="h-6 w-6 text-primary" />
                    <span className="text-foreground text-xl font-semibold font-nexa">CalX</span>
                </Link>
                <ThemeToggle />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Back Link */}
                    <Link
                        href={isLoggedIn ? "/dashboard" : "/login"}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {isLoggedIn ? "Back to dashboard" : "Back to login"}
                    </Link>

                    {/* Bind Device Card */}
                    <div
                        className="rounded-2xl border border-border p-8"
                        style={{
                            background: "rgba(231, 236, 235, 0.04)",
                        }}
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-foreground text-2xl font-semibold mb-2">Bind Your Device</h1>
                            <p className="text-muted-foreground text-sm">
                                Enter the 4-character code displayed on your CalX device
                            </p>
                        </div>

                        {success ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-foreground text-xl font-semibold mb-2">Device Connected!</h2>
                                <p className="text-muted-foreground text-sm mb-2">
                                    {boundDeviceId}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    Redirecting to your dashboard...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                {/* Code Input Grid - 4 characters */}
                                <div className="flex justify-center gap-3" onPaste={handlePaste}>
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { inputRefs.current[index] = el }}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-14 h-16 text-center text-2xl font-mono font-semibold rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors uppercase"
                                        />
                                    ))}
                                </div>

                                <p className="text-center text-xs text-muted-foreground">
                                    Find the code on your CalX device under Settings → Bind Device
                                </p>

                                <Button
                                    type="submit"
                                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-3 rounded-lg font-medium"
                                    disabled={isLoading || code.join("").length !== 4}
                                >
                                    {isLoading ? "Connecting..." : "Connect Device"}
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* Bottom Link */}
                    {!isLoggedIn && (
                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Need to log in first? Sign in here →
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
