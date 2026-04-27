"use client"

import { useState } from "react"
import { updateProfile } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Loader2, Save } from "lucide-react"
import type { Profile } from "@/lib/types"

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [heroImage, setHeroImage] = useState(profile?.hero_image || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    formData.set("hero_image", heroImage)
    
    try {
      await updateProfile(formData)
      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          message.type === "success" 
            ? "bg-green-500/10 border border-green-500/20 text-green-500" 
            : "bg-red-500/10 border border-red-500/20 text-red-500"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Name</label>
          <input
            name="name"
            defaultValue={profile?.name || ""}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Titles (comma separated)</label>
          <input
            name="titles"
            defaultValue={profile?.titles?.join(", ") || ""}
            placeholder="Full Stack Developer, Mobile Developer"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Short Description</label>
        <textarea
          name="short_desc"
          defaultValue={profile?.short_desc || ""}
          rows={3}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Hero Image</label>
        <ImageUpload value={heroImage} onChange={setHeroImage} folder="profile" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        Save Changes
      </button>
    </form>
  )
}
