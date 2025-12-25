"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, MessageSquare, FileText, Brain, Settings, Download, Activity, LogOut, ChevronLeft, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { getToken, getUser, getCurrentDevice, logout } from "@/lib/api"

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Chat", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Files", href: "/dashboard/files", icon: FileText },
    { name: "AI Config", href: "/dashboard/ai-config", icon: Brain },
    { name: "Device Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Update", href: "/dashboard/update", icon: Download },
    { name: "Activity Log", href: "/dashboard/activity", icon: Activity },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [user, setUser] = useState<{ email: string } | null>(null)
    const [deviceId, setDeviceId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check auth on mount
        const token = getToken()
        if (!token) {
            router.push("/login")
            return
        }

        const userData = getUser()
        const device = getCurrentDevice()

        setUser(userData)
        setDeviceId(device)
        setIsLoading(false)
    }, [router])

    const handleLogout = () => {
        logout()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => (
        <div className="flex flex-col h-full bg-background">
            <div className={`h-16 flex items-center ${collapsed ? "justify-center" : "justify-between px-4"}`}>
                <Link href="/" className="flex items-center gap-2 overflow-hidden">
                    {!collapsed && (
                        <span className="text-foreground text-xl font-semibold font-nexa">CalX</span>
                    )}
                    {collapsed && (
                        <span className="text-foreground text-xl font-semibold font-nexa">C</span>
                    )}
                </Link>
                {!collapsed && (
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors hidden md:flex"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}
            </div>

            <nav className="flex-1 py-4 px-2 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                        }`}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {!collapsed && (
                                        <span className="font-medium text-sm">{item.name}</span>
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* User info */}
            {!collapsed && user && (
                <div className="px-4 py-3 border-t border-border">
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    {deviceId && (
                        <p className="text-xs text-primary truncate">{deviceId}</p>
                    )}
                </div>
            )}

            <div className="p-2 border-t border-border">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors`}
                    title={collapsed ? "Sign Out" : undefined}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                        <span className="font-medium text-sm">Sign Out</span>
                    )}
                </button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full border-r border-border hidden md:flex flex-col transition-all duration-300 z-40 ${sidebarCollapsed ? "w-16" : "w-64"
                    }`}
            >
                <NavContent collapsed={sidebarCollapsed} />
            </aside>

            {/* Main Content */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${sidebarCollapsed ? "md:ml-16" : "md:ml-64"
                    }`}
            >
                {/* Top Bar */}
                <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Trigger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64 border-r border-border">
                                <NavContent collapsed={false} />
                            </SheetContent>
                        </Sheet>

                        <h1 className="text-foreground font-semibold">
                            {navItems.find((item) => item.href === pathname)?.name || "Dashboard"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {deviceId ? (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                {deviceId}
                            </div>
                        ) : (
                            <Link
                                href="/bind-device"
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition-colors"
                            >
                                Bind Device
                            </Link>
                        )}
                        <ThemeToggle />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto w-full max-w-[100vw] overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
