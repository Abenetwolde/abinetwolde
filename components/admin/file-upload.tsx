"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { X, Loader2, FileText, CheckCircle2, Download, ExternalLink } from "lucide-react"

interface FileUploadProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  accept?: string
  label?: string
  maxSizeMB?: number
  className?: string
}

export function FileUpload({
  value,
  onChange,
  folder = "files",
  accept = ".pdf,.doc,.docx",
  label = "Click to upload file",
  maxSizeMB = 10,
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justUploaded, setJustUploaded] = useState(false)
  const [fileName, setFileName] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Extract filename from URL for display
  function getDisplayName(url: string) {
    if (fileName) return fileName
    try {
      const parts = new URL(url).pathname.split("/")
      const raw = parts[parts.length - 1]
      // Strip the timestamp prefix (e.g. "1234567890-abc123.pdf" → "abc123.pdf")
      return decodeURIComponent(raw).replace(/^\d+-[a-z0-9]+-/, "")
    } catch {
      return "Uploaded file"
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be less than ${maxSizeMB}MB`)
      return
    }

    setUploading(true)
    setError(null)
    setJustUploaded(false)

    try {
      const fileExt = file.name.split(".").pop()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const fileName = `${Date.now()}-${safeName}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, { contentType: file.type })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath)

      setFileName(file.name)
      onChange(publicUrl)
      setJustUploaded(true)
      setTimeout(() => setJustUploaded(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function handleRemove() {
    onChange("")
    setFileName("")
    setJustUploaded(false)
    setError(null)
  }

  const isPDF = value?.toLowerCase().includes(".pdf") || accept.includes("pdf")

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />

      {value ? (
        <div className="space-y-2">
          {/* File preview card */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {getDisplayName(value)}
              </p>
              <p className="text-xs text-muted-foreground">
                {isPDF ? "PDF Document" : "Document"}
              </p>
              {justUploaded && (
                <p className="flex items-center gap-1 text-xs text-green-500 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Uploaded successfully
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Preview"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                title="Replace"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 py-8 hover:border-primary/50 hover:bg-muted/50 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <div className="p-3 bg-muted rounded-full">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">
                {accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")} up to {maxSizeMB}MB
              </span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
          <X className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  )
}
