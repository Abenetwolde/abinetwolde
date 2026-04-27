"use client"

import { useState } from "react"
import { createExperience, updateExperience, deleteExperience } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Plus, Pencil, Trash2, X, Loader2, Save } from "lucide-react"
import Image from "next/image"
import type { Experience } from "@/lib/types"

export function ExperienceManager({ experiences }: { experiences: Experience[] }) {
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Delete this experience?")) return
    setDeletingId(id)
    try {
      await deleteExperience(id)
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
        Add Experience
      </button>

      {(showAddForm || editingExp) && (
        <ExperienceForm
          experience={editingExp}
          onClose={() => {
            setShowAddForm(false)
            setEditingExp(null)
          }}
        />
      )}

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-card border border-border rounded-xl p-6 flex gap-4"
          >
            {exp.logo && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                <Image src={exp.logo} alt={exp.company} fill className="object-contain p-2" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{exp.position}</h3>
              <p className="text-muted-foreground">{exp.company}</p>
              <p className="text-sm text-muted-foreground">{exp.duration}</p>
              {exp.description && exp.description.length > 0 && (
                <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
                  {exp.description.slice(0, 2).map((item, i) => (
                    <li key={i} className="truncate">{item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-start gap-2">
              <button
                onClick={() => setEditingExp(exp)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                disabled={deletingId === exp.id}
                className="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
              >
                {deletingId === exp.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No experience added yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ExperienceForm({ experience, onClose }: { experience: Experience | null; onClose: () => void }) {
  const [logo, setLogo] = useState(experience?.logo || "")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.set("logo", logo)
    
    try {
      if (experience) {
        await updateExperience(experience.id, formData)
      } else {
        await createExperience(formData)
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{experience ? "Edit Experience" : "Add Experience"}</h3>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company *</label>
            <input
              name="company"
              defaultValue={experience?.company || ""}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Position *</label>
            <input
              name="position"
              defaultValue={experience?.position || ""}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration</label>
            <input
              name="duration"
              defaultValue={experience?.duration || ""}
              placeholder="Jan 2023 - Present"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Order</label>
            <input
              name="display_order"
              type="number"
              defaultValue={experience?.display_order || 0}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description (one item per line)</label>
          <textarea
            name="description"
            defaultValue={experience?.description?.join("\n") || ""}
            rows={4}
            placeholder="Led development of..."
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Company Logo</label>
          <ImageUpload value={logo} onChange={setLogo} folder="companies" />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {experience ? "Update" : "Create"}
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
