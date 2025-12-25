"use client"

import type React from "react"

const AiPoweredCalculations: React.FC = () => {
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
            aria-label="AI-powered calculations chat interface"
        >
            {/* Chat container */}
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "320px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {/* User message */}
                <div
                    style={{
                        alignSelf: "flex-end",
                        maxWidth: "80%",
                        padding: "10px 14px",
                        borderRadius: "16px 16px 4px 16px",
                        background: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                        fontSize: "13px",
                        lineHeight: "1.4",
                        fontFamily: "'Geist', -apple-system, sans-serif",
                    }}
                >
                    What's the compound interest on $5000 at 7% for 5 years?
                </div>

                {/* AI response */}
                <div
                    style={{
                        alignSelf: "flex-start",
                        maxWidth: "85%",
                        padding: "12px 14px",
                        borderRadius: "16px 16px 16px 4px",
                        background: "hsl(var(--muted))",
                        color: "hsl(var(--foreground))",
                        fontSize: "13px",
                        lineHeight: "1.5",
                        fontFamily: "'Geist', -apple-system, sans-serif",
                    }}
                >
                    <div style={{ marginBottom: "8px" }}>
                        Using the formula A = P(1 + r/n)^(nt):
                    </div>
                    <div
                        style={{
                            background: "hsl(var(--background))",
                            padding: "8px 10px",
                            borderRadius: "8px",
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "12px",
                            marginBottom: "8px",
                        }}
                    >
                        A = $5000 × (1.07)^5 = <span style={{ color: "hsl(var(--primary))", fontWeight: 600 }}>$7,012.76</span>
                    </div>
                    <div style={{ opacity: 0.8 }}>
                        Interest earned: $2,012.76 ✨
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AiPoweredCalculations
