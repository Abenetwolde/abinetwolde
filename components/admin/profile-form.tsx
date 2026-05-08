"use client"

import { useState } from "react"
import { updateProfile } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Loader2, Save, Plus, X } from "lucide-react"
import type { Profile } from "@/lib/types"

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [heroImage, setHeroImage] = useState(profile?.hero_image || "")
  const [stats, setStats] = useState<{ label: string; value: string }[]>(
    profile?.hero_stats || []
  )
  const [availability, setAvailability] = useState(profile?.availability || 'available')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  function addStat() {
    setStats([...stats, { label: '', value: '' }])
  }
  function removeStat(i: number) {
    setStats(stats.filter((_, idx) => idx !== i))
  }
  function updateStat(i: number, field: 'label' | 'value', val: string) {
    setStats(stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    formData.set("hero_image", heroImage)
    formData.set("availability", availability)
    formData.set("hero_stats", JSON.stringify(stats))

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

      {/* Hero headline & subtitle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Hero Headline <span className="text-muted-foreground font-normal">(large title, e.g. "Backend & infra engineer for systems")</span>
        </label>
        <input
          name="hero_headline"
          defaultValue={profile?.hero_headline || ""}
          placeholder="Backend & infra engineer for systems"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Hero Accent Line <span className="text-muted-foreground font-normal">(shown in primary color, e.g. "that can't fail")</span>
        </label>
        <input
          name="hero_subtitle"
          defaultValue={profile?.hero_subtitle || ""}
          placeholder="that can't fail"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
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

      {/* Availability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Availability Status</label>
          <select
            value={availability}
            onChange={e => setAvailability(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Availability Label <span className="text-muted-foreground font-normal">(e.g. "1 project at a time")</span></label>
          <input
            name="availability_label"
            defaultValue={profile?.availability_label || ""}
            placeholder="1 project at a time"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Hero Stat Cards <span className="text-muted-foreground font-normal">(e.g. Location, Years, etc.)</span>
          </label>
          <button type="button" onClick={addStat} className="flex items-center gap-1 text-sm text-primary hover:underline">
            <Plus className="w-4 h-4" /> Add stat
          </button>
        </div>
        {stats.map((stat, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input
              value={stat.value}
              onChange={(e) => updateStat(i, 'value', e.target.value)}
              placeholder="Value (e.g. DUBAI, UAE)"
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              value={stat.label}
              onChange={(e) => updateStat(i, 'label', e.target.value)}
              placeholder="Label (e.g. Overlap with US, EU & Asia)"
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button type="button" onClick={() => removeStat(i)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {stats.length === 0 && (
          <p className="text-xs text-muted-foreground">No stat cards yet. Click "Add stat" to add one.</p>
        )}
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
