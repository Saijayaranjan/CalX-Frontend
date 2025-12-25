"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, FileText, Trash2, RefreshCw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { uploadFile, deleteFile, getCurrentDevice, getToken } from "@/lib/api"

export default function FilesPage() {
    const router = useRouter()
    const [deviceId, setDeviceId] = useState<string | null>(null)
    const [file, setFile] = useState<{
        name: string
        content: string
        lastUpdated: Date
    } | null>(null)

    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const MAX_CHARS = 4000

    useEffect(() => {
        if (!getToken()) {
            router.push("/login")
            return
        }

        const device = getCurrentDevice()
        setDeviceId(device)
    }, [router])

    const handleFileSelect = (selectedFile: File) => {
        setError("")
        setSuccess("")

        if (!selectedFile.name.endsWith(".txt")) {
            setError("Only .txt files are allowed")
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const content = e.target?.result as string
            if (content.length > MAX_CHARS) {
                setError(`File exceeds maximum size of ${MAX_CHARS} characters (${content.length} chars)`)
                return
            }
            setFile({
                name: selectedFile.name,
                content: content,
                lastUpdated: new Date(),
            })
            setHasChanges(true)
        }
        reader.readAsText(selectedFile)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            handleFileSelect(droppedFile)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleContentChange = (newContent: string) => {
        if (!file) return
        if (newContent.length <= MAX_CHARS) {
            setFile({ ...file, content: newContent })
            setHasChanges(true)
        }
    }

    const handleSave = async () => {
        if (!file || !deviceId) return

        setIsUploading(true)
        setError("")
        setSuccess("")

        try {
            await uploadFile(deviceId, file.content)
            setFile({ ...file, lastUpdated: new Date() })
            setHasChanges(false)
            setSuccess("File synced to device successfully!")
            setTimeout(() => setSuccess(""), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload file")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async () => {
        if (!deviceId) return

        setIsDeleting(true)
        setError("")

        try {
            await deleteFile(deviceId)
            setFile(null)
            setHasChanges(false)
            setSuccess("File deleted from device")
            setTimeout(() => setSuccess(""), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete file")
        } finally {
            setIsDeleting(false)
        }
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-foreground">File Storage</h2>
                <p className="text-muted-foreground">
                    Upload a text file to sync to your CalX device
                    {deviceId && <span className="text-primary ml-2">({deviceId})</span>}
                </p>
            </div>

            {!deviceId && (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                    <p className="text-sm">No device bound. Please <a href="/bind-device" className="underline">bind a device</a> first.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Upload & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {error && (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Check if file exists to determine view */}
                    {!file ? (
                        <div
                            className={`h-[300px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center p-8 transition-colors ${isDragging
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/50"
                                }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                accept=".txt"
                                className="hidden"
                            />
                            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                                <Upload className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                Drop text file here
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">
                                or click to browse (TXT files only, max {MAX_CHARS} characters)
                            </p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="rounded-full px-6"
                                disabled={!deviceId}
                            >
                                Select File
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-7 h-7 text-primary" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-semibold text-lg text-foreground truncate" title={file.name}>{file.name}</h3>
                                    <p className="text-xs text-muted-foreground">TXT Document</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Size</span>
                                    <span className="font-mono text-foreground">{file.content.length} chars</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Last Synced</span>
                                    <span className="text-foreground">{formatDate(file.lastUpdated)}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Storage Usage</span>
                                        <span className="text-muted-foreground">{Math.round((file.content.length / MAX_CHARS) * 100)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${file.content.length > MAX_CHARS * 0.9
                                                ? "bg-destructive"
                                                : file.content.length > MAX_CHARS * 0.7
                                                    ? "bg-yellow-500"
                                                    : "bg-primary"
                                                }`}
                                            style={{ width: `${(file.content.length / MAX_CHARS) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Button
                                    onClick={handleSave}
                                    className="w-full"
                                    disabled={!hasChanges || isUploading || !deviceId}
                                >
                                    {isUploading ? (
                                        <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                                    ) : (
                                        <><Save className="w-4 h-4 mr-2" /> {hasChanges ? 'Sync to Device' : 'Synced'}</>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    className="w-full hover:bg-destructive/10 hover:text-destructive"
                                    variant="outline"
                                    disabled={isDeleting || !deviceId}
                                >
                                    {isDeleting ? (
                                        <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Deleting...</>
                                    ) : (
                                        <><Trash2 className="w-4 h-4 mr-2" /> Delete</>
                                    )}
                                </Button>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                    accept=".txt"
                                    className="hidden"
                                />
                                <Button
                                    variant="ghost"
                                    className="w-full text-muted-foreground"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Replace with another file
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: File Editor */}
                <div className="lg:col-span-2 h-full min-h-[500px]">
                    {file ? (
                        <div className="h-full rounded-3xl border border-border bg-card overflow-hidden flex flex-col">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex justify-between items-center">
                                <span className="font-mono text-xs text-muted-foreground">EDIT FILE</span>
                                <div className="flex items-center gap-4">
                                    {hasChanges && (
                                        <span className="text-xs text-yellow-500">Unsaved changes</span>
                                    )}
                                    <span className="font-mono text-xs text-muted-foreground">
                                        {file.content.length}/{MAX_CHARS}
                                    </span>
                                </div>
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={file.content}
                                onChange={(e) => handleContentChange(e.target.value)}
                                className="flex-1 p-6 font-mono text-sm leading-relaxed text-foreground/90 bg-transparent resize-none focus:outline-none"
                                placeholder="Start typing your notes..."
                            />
                        </div>
                    ) : (
                        <div className="h-full rounded-3xl border border-border border-dashed bg-muted/5 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <FileText className="w-16 h-16 opacity-20 mb-4" />
                            <p className="text-lg">No file selected</p>
                            <p className="text-sm opacity-60">Upload a file to edit and sync to your device</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
