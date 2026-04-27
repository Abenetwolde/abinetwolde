"use client"

import { useState } from "react"
import { createSkill, updateSkill, deleteSkill } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Plus, Pencil, Trash2, X, Loader2, Save } from "lucide-react"
import Image from "next/image"
import type { Skill } from "@/lib/types"

const categories = ["frontend", "backend", "mobile", "tools"]

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat)
    return acc
  }, {} as Record<string, Skill[]>)

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill?")) return
    setDeletingId(id)
    try {
      await deleteSkill(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => setShowAddForm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Skill
      </button>

      {(showAddForm || editingSkill) && (
        <SkillForm
          skill={editingSkill}
          onClose={() => {
            setShowAddForm(false)
            setEditingSkill(null)
          }}
        />
      )}

      {categories.map((category) => (
        <section key={category} className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground capitalize mb-4">{category}</h2>
          
          {groupedSkills[category].length === 0 ? (
            <p className="text-muted-foreground text-sm">No skills in this category</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {groupedSkills[category].map((skill) => (
                <div
                  key={skill.id}
                  className="relative group bg-muted/50 rounded-lg p-4 flex flex-col items-center"
                >
                  {skill.image && (
                    <div className="relative w-12 h-12 mb-2">
                      <Image
                        src={skill.image}
                        alt={skill.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-sm text-foreground text-center">{skill.name}</span>
                  
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => setEditingSkill(skill)}
                      className="p-1 bg-background rounded text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      disabled={deletingId === skill.id}
                      className="p-1 bg-background rounded text-muted-foreground hover:text-red-500"
                    >
                      {deletingId === skill.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}

function SkillForm({ skill, onClose }: { skill: Skill | null; onClose: () => void }) {
  const [image, setImage] = useState(skill?.image || "")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.set("image", image)
    
    try {
      if (skill) {
        await updateSkill(skill.id, formData)
      } else {
        await createSkill(formData)
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{skill ? "Edit Skill" : "Add Skill"}</h3>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name *</label>
            <input
              name="name"
              defaultValue={skill?.name || ""}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <select
              name="category"
              defaultValue={skill?.category || "frontend"}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Order</label>
            <input
              name="display_order"
              type="number"
              defaultValue={skill?.display_order || 0}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Icon/Image</label>
          <ImageUpload value={image} onChange={setImage} folder="skills" />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {skill ? "Update" : "Create"}
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
