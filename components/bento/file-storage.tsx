"use client"

import type React from "react"

const FileStorage: React.FC = () => {
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
            aria-label="File storage and sync interface"
        >
            {/* Notes card */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "300px",
                    padding: "16px",
                    borderRadius: "14px",
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path d="M14 2V8H20" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "hsl(var(--foreground))",
                                fontFamily: "'Geist', sans-serif",
                            }}
                        >
                            Quick Notes
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            background: "hsl(var(--muted))",
                        }}
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M20 6L9 17L4 12"
                                stroke="#22C55E"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span
                            style={{
                                fontSize: "10px",
                                color: "#22C55E",
                                fontFamily: "'Geist', sans-serif",
                            }}
                        >
                            Synced
                        </span>
                    </div>
                </div>

                {/* Note items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                        { title: "WiFi Password", content: "Home_Network_2024", time: "2 min ago" },
                        { title: "Shopping List", content: "Milk, Eggs, Bread...", time: "1 hour ago" },
                    ].map((note, i) => (
                        <div
                            key={i}
                            style={{
                                padding: "10px 12px",
                                borderRadius: "8px",
                                background: i === 0 ? "hsl(var(--primary) / 0.08)" : "hsl(var(--muted) / 0.5)",
                                border: i === 0 ? "1px solid hsl(var(--primary) / 0.2)" : "1px solid transparent",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <span
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: "hsl(var(--foreground))",
                                        fontFamily: "'Geist', sans-serif",
                                    }}
                                >
                                    {note.title}
                                </span>
                                <span
                                    style={{
                                        fontSize: "10px",
                                        color: "hsl(var(--muted-foreground))",
                                        fontFamily: "'Geist', sans-serif",
                                    }}
                                >
                                    {note.time}
                                </span>
                            </div>
                            <span
                                style={{
                                    fontSize: "11px",
                                    color: "hsl(var(--muted-foreground))",
                                    fontFamily: "'Geist Mono', monospace",
                                }}
                            >
                                {note.content}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Storage indicator */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span
                            style={{
                                fontSize: "10px",
                                color: "hsl(var(--muted-foreground))",
                                fontFamily: "'Geist', sans-serif",
                            }}
                        >
                            Storage used
                        </span>
                        <span
                            style={{
                                fontSize: "10px",
                                color: "hsl(var(--foreground))",
                                fontWeight: 500,
                                fontFamily: "'Geist Mono', monospace",
                            }}
                        >
                            2.8KB / 4KB
                        </span>
                    </div>
                    <div
                        style={{
                            height: "4px",
                            borderRadius: "2px",
                            background: "hsl(var(--muted))",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: "70%",
                                height: "100%",
                                borderRadius: "2px",
                                background: "hsl(var(--primary))",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileStorage
