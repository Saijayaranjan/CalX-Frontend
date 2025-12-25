"use client"

import { Cpu, Battery, Wifi, Monitor, HardDrive, Zap } from "lucide-react"

const specs = [
    {
        icon: Cpu,
        title: "Processor",
        value: "ESP32-WROOM-32",
        description: "Dual-core Xtensa LX6",
    },
    {
        icon: Battery,
        title: "Battery",
        value: "500mAh Li-Po",
        description: "7 days standby",
    },
    {
        icon: Wifi,
        title: "Connectivity",
        value: "WiFi 802.11 b/g/n",
        description: "2.4GHz band support",
    },
    {
        icon: Monitor,
        title: "Display",
        value: '0.91" OLED',
        description: "128×32 resolution",
    },
    {
        icon: HardDrive,
        title: "Storage",
        value: "4KB User Storage",
        description: "Cloud-fetched text",
    },
    {
        icon: Zap,
        title: "Power Modes",
        value: "Normal / Low Power",
        description: "Optimized for battery life",
    },
]

export function SpecsSection() {
    return (
        <section id="specs-section" className="w-full px-5 py-16 md:py-24 flex flex-col justify-center items-center">
            <div className="w-full max-w-[1100px] flex flex-col items-center gap-12">
                <div className="text-center">
                    <h2 className="text-foreground text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4">
                        Technical Specifications
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg md:text-xl font-medium max-w-[600px] mx-auto px-2">
                        Built with quality components for reliable everyday use
                    </p>
                </div>

                <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-6">
                    {specs.map((spec) => (
                        <div
                            key={spec.title}
                            className="relative overflow-hidden rounded-2xl border border-border p-4 sm:p-6 flex flex-col gap-3"
                            style={{
                                background: "rgba(231, 236, 235, 0.04)",
                            }}
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <spec.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">{spec.title}</p>
                                <p className="text-foreground text-xl font-semibold mt-1">{spec.value}</p>
                                <p className="text-muted-foreground text-sm mt-1">{spec.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
