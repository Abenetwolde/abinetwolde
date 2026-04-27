"use client"

import { useState } from "react"
import { createSocial, updateSocial, deleteSocial } from "@/lib/actions"
import { Plus, Pencil, Trash2, X, Loader2, Save, Github, Linkedin, Twitter, Mail, Send, Globe } from "lucide-react"
import type { Social } from "@/lib/types"

const iconOptions = [
  { value: "github", label: "GitHub", Icon: Github },
  { value: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { value: "twitter", label: "Twitter/X", Icon: Twitter },
  { value: "email", label: "Email", Icon: Mail },
  { value: "telegram", label: "Telegram", Icon: Send },
  { value: "website", label: "Website", Icon: Globe },
]

function getIcon(iconName: string) {
  const option = iconOptions.find(o => o.value === iconName)
  return option?.Icon || Globe
}

export function SocialsManager({ socials }: { socials: Social[] }) {
  const [editingSocial, setEditingSocial] = useState<Social | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Delete this social link?")) return
    setDeletingId(id)
    try {
      await deleteSocial(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowAddForm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Social Link
      </button>

      {(showAddForm || editingSocial) && (
        <SocialForm
          social={editingSocial}
          onClose={() => {
            setShowAddForm(false)
            setEditingSocial(null)
          }}
        />
      )}

      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        {socials.map((social) => {
          const Icon = getIcon(social.icon)
          return (
            <div
              key={social.id}
              className="p-4 flex items-center gap-4"
            >
              <div className="p-3 bg-muted rounded-lg">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground capitalize">{social.icon}</p>
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary truncate block"
                >
                  {social.link}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingSocial(social)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(social.id)}
                  disabled={deletingId === social.id}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  {deletingId === social.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )
        })}

        {socials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No social links added yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SocialForm({ social, onClose }: { social: Social | null; onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    
    try {
      if (social) {
        await updateSocial(social.id, formData)
      } else {
        await createSocial(formData)
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{social ? "Edit Social Link" : "Add Social Link"}</h3>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform *</label>
            <select
              name="icon"
              defaultValue={social?.icon || "github"}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {iconOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">URL *</label>
            <input
              name="link"
              type="url"
              defaultValue={social?.link || ""}
              required
              placeholder="https://..."
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Order</label>
          <input
            name="display_order"
            type="number"
            defaultValue={social?.display_order || 0}
            className="w-32 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {social ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
