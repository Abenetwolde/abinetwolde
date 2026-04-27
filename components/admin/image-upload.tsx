"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
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
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setUploading(true)
    setError(null)

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function handleRemove() {
    onChange("")
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
        <div className="relative group">
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/70 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted/50 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <div className="p-3 bg-muted rounded-full">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Click to upload image</span>
              <span className="text-xs text-muted-foreground">Max 5MB</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
