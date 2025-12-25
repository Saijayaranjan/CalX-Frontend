"use client"

import type React from "react"

const DeviceBinding: React.FC = () => {
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
            aria-label="One-click device binding with 6-digit code"
        >
            {/* Central pairing card */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "280px",
                    padding: "24px",
                    borderRadius: "16px",
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                    boxShadow: "0 8px 32px hsl(var(--primary) / 0.1)",
                }}
            >
                {/* Title */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2 17L12 22L22 17"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2 12L12 17L22 12"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "hsl(var(--foreground))",
                            fontFamily: "'Geist', sans-serif",
                        }}
                    >
                        Enter Pairing Code
                    </span>
                </div>

                {/* 6-digit code boxes */}
                <div style={{ display: "flex", gap: "8px" }}>
                    {["4", "7", "2", "", "", ""].map((digit, i) => (
                        <div
                            key={i}
                            style={{
                                width: "36px",
                                height: "44px",
                                borderRadius: "8px",
                                background: i < 3 ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))",
                                border: `2px solid ${i < 3 ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                                fontWeight: 600,
                                fontFamily: "'Geist Mono', monospace",
                                color: i < 3 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                                animation: i === 3 ? "blink 1s ease-in-out infinite" : undefined,
                            }}
                        >
                            {i < 3 ? digit : i === 3 ? "_" : ""}
                        </div>
                    ))}
                </div>

            </div>

            <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
        </div>
    )
}

export default DeviceBinding
