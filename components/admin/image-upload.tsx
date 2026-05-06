"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { X, Loader2, ImageIcon, CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  className?: string
}

export function ImageUpload({ value, onChange, folder = "uploads", className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justUploaded, setJustUploaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setUploading(true)
    setError(null)
    setJustUploaded(false)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath)

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
    setJustUploaded(false)
    setError(null)
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {value ? (
        <div className="space-y-2">
          {/* Preview */}
          <div className="relative group rounded-xl overflow-hidden border border-border bg-muted">
            <div className="relative w-full h-48">
              <Image
                src={value}
                alt="Uploaded image preview"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Success badge */}
            {justUploaded && (
              <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white shadow">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Uploaded!
              </div>
            )}

            {/* Hover actions */}
            <div className="absolute inset-0 flex items-end justify-between p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* URL display */}
          <p className="text-xs text-muted-foreground truncate px-1">{value}</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted/50 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <div className="p-3 bg-muted rounded-full">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Click to upload image</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</span>
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
