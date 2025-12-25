"use client"

import type React from "react"

const FirmwareUpdate: React.FC = () => {
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
            aria-label="OTA firmware update progress"
        >
            {/* Update card */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "280px",
                    padding: "20px",
                    borderRadius: "16px",
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: "hsl(var(--primary) / 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 3V15M12 15L8 11M12 15L16 11"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "hsl(var(--foreground))",
                                fontFamily: "'Geist', sans-serif",
                            }}
                        >
                            Firmware Update
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "12px",
                                color: "hsl(var(--muted-foreground))",
                                fontFamily: "'Geist', sans-serif",
                            }}
                        >
                            v2.1.0 → v2.2.0
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "11px",
                                color: "hsl(var(--muted-foreground))",
                                fontFamily: "'Geist', sans-serif",
                            }}
                        >
                            Downloading...
                        </span>
                        <span
                            style={{
                                fontSize: "11px",
                                color: "hsl(var(--primary))",
                                fontWeight: 500,
                                fontFamily: "'Geist Mono', monospace",
                            }}
                        >
                            67%
                        </span>
                    </div>
                    <div
                        style={{
                            height: "8px",
                            borderRadius: "4px",
                            background: "hsl(var(--muted))",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: "67%",
                                height: "100%",
                                borderRadius: "4px",
                                background: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)",
                                animation: "progress 2s ease-in-out infinite",
                            }}
                        />
                    </div>
                </div>

                {/* Update notes */}
                <div
                    style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "hsl(var(--muted) / 0.5)",
                        fontSize: "11px",
                        color: "hsl(var(--muted-foreground))",
                        fontFamily: "'Geist', sans-serif",
                        lineHeight: "1.5",
                    }}
                >
                    <div style={{ fontWeight: 500, marginBottom: "4px", color: "hsl(var(--foreground))" }}>What's new:</div>
                    <div>• Improved AI response speed</div>
                    <div>• Better battery optimization</div>
                    <div>• Bug fixes</div>
                </div>

            </div>

            <style jsx>{`
        @keyframes progress {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
        </div>
    )
}

export default FirmwareUpdate
