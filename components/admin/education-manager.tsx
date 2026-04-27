"use client"

import { useState } from "react"
import { createEducation, updateEducation, deleteEducation } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Plus, Pencil, Trash2, X, Loader2, Save } from "lucide-react"
import Image from "next/image"
import type { Education } from "@/lib/types"

export function EducationManager({ educations }: { educations: Education[] }) {
  const [editingEdu, setEditingEdu] = useState<Education | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Delete this education entry?")) return
    setDeletingId(id)
    try {
      await deleteEducation(id)
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
        Add Education
      </button>

      {(showAddForm || editingEdu) && (
        <EducationForm
          education={editingEdu}
          onClose={() => {
            setShowAddForm(false)
            setEditingEdu(null)
          }}
        />
      )}

      <div className="space-y-4">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="bg-card border border-border rounded-xl p-6 flex gap-4"
          >
            {edu.logo && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                <Image src={edu.logo} alt={edu.institute} fill className="object-contain p-2" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{edu.degree}</h3>
              <p className="text-muted-foreground">{edu.institute}</p>
              <p className="text-sm text-muted-foreground">{edu.duration}</p>
            </div>

            <div className="flex items-start gap-2">
              <button
                onClick={() => setEditingEdu(edu)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                disabled={deletingId === edu.id}
                className="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
              >
                {deletingId === edu.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}

        {educations.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No education added yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function EducationForm({ education, onClose }: { education: Education | null; onClose: () => void }) {
  const [logo, setLogo] = useState(education?.logo || "")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.set("logo", logo)
    
    try {
      if (education) {
        await updateEducation(education.id, formData)
      } else {
        await createEducation(formData)
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{education ? "Edit Education" : "Add Education"}</h3>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Institute *</label>
            <input
              name="institute"
              defaultValue={education?.institute || ""}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Degree *</label>
            <input
              name="degree"
              defaultValue={education?.degree || ""}
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
              defaultValue={education?.duration || ""}
              placeholder="2016 - 2020"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Order</label>
            <input
              name="display_order"
              type="number"
              defaultValue={education?.display_order || 0}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description (one item per line)</label>
          <textarea
            name="description"
            defaultValue={education?.description?.join("\n") || ""}
            rows={3}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Institute Logo</label>
          <ImageUpload value={logo} onChange={setLogo} folder="education" />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {education ? "Update" : "Create"}
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
