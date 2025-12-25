"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { login, register } from "@/lib/api"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [isRegisterMode, setIsRegisterMode] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            if (isRegisterMode) {
                await register(email, password)
                // After registration, log in
                await login(email, password)
            } else {
                await login(email, password)
            }
            router.push("/dashboard")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="w-full py-4 px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-foreground text-xl font-semibold font-nexa">CalX</span>
                </Link>
                <ThemeToggle />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Login Card */}
                    <div
                        className="rounded-2xl border border-border p-8"
                        style={{
                            background: "rgba(231, 236, 235, 0.04)",
                        }}
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-foreground text-2xl font-semibold mb-2 font-nexa">
                                {isRegisterMode ? "Create account" : "Welcome back"}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {isRegisterMode ? "Create your CalX account" : "Sign in to your CalX dashboard"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {isRegisterMode && (
                                    <p className="text-xs text-muted-foreground">
                                        Password must be at least 8 characters
                                    </p>
                                )}
                            </div>

                            {!isRegisterMode && (
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 text-muted-foreground">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary/50"
                                        />
                                        Remember me
                                    </label>
                                    <a href="#" className="text-primary hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-3 rounded-lg font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? (isRegisterMode ? "Creating account..." : "Signing in...") : (isRegisterMode ? "Create account" : "Sign in")}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            {isRegisterMode ? (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => setIsRegisterMode(false)}
                                        className="text-primary hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don&apos;t have an account?{" "}
                                    <button
                                        onClick={() => setIsRegisterMode(true)}
                                        className="text-primary hover:underline"
                                    >
                                        Create one
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Device Binding Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/bind-device"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Have a device code? Bind your device →
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
