"use client"

import type React from "react"

const AiProviders: React.FC = () => {
    const providers = [
        { name: "ChatGPT", color: "#10A37F", icon: "G" },
        { name: "Gemini", color: "#4285F4", icon: "✦" },
    ]

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                background: "transparent",
                overflow: "hidden",
            }}
            role="img"
            aria-label="Flexible AI providers selection"
        >
            {/* Provider cards */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                    width: "260px",
                }}
            >
                {providers.map((provider, i) => (
                    <div
                        key={provider.name}
                        style={{
                            padding: "16px",
                            borderRadius: "12px",
                            background: i === 0 ? `${provider.color}15` : "hsl(var(--card))",
                            border: `2px solid ${i === 0 ? provider.color : "hsl(var(--border))"}`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            position: "relative",
                        }}
                    >
                        {/* Selected checkmark */}
                        {i === 0 && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    width: "16px",
                                    height: "16px",
                                    borderRadius: "50%",
                                    background: provider.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M20 6L9 17L4 12"
                                        stroke="white"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        )}

                        {/* Provider icon */}
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "10px",
                                background: `${provider.color}20`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                fontWeight: 700,
                                color: provider.color,
                                fontFamily: "'Geist', sans-serif",
                            }}
                        >
                            {provider.icon}
                        </div>

                        {/* Provider name */}
                        <span
                            style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: i === 0 ? provider.color : "hsl(var(--muted-foreground))",
                                fontFamily: "'Geist', sans-serif",
                            }}
                        >
                            {provider.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Connected status */}
            <div
                style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    background: "hsl(var(--muted))",
                }}
            >
                <div
                    style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#10A37F",
                    }}
                />
                <span
                    style={{
                        fontSize: "11px",
                        color: "hsl(var(--muted-foreground))",
                        fontFamily: "'Geist', sans-serif",
                    }}
                >
                    Connected to ChatGPT
                </span>
            </div>
        </div>
    )
}

export default AiProviders
