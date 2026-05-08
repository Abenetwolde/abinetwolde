"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProject, updateProject } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Loader2, Save, Plus, X } from "lucide-react"
import Image from "next/image"
import type { Project } from "@/lib/types"

const categories = ["web", "mobile", "bot", "other"]

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>(project?.images || [])
  const [coverImage, setCoverImage] = useState(project?.cover_image || '')
  const [features, setFeatures] = useState<string[]>(project?.features || [])
  const [featureInput, setFeatureInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)

  function addImage(url: string) {
    setImages([...images, url])
    setShowImageUpload(false)
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index))
  }

  function addFeature() {
    const trimmed = featureInput.trim()
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed])
      setFeatureInput("")
    }
  }

  function removeFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index))
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    formData.set("images", JSON.stringify(images))
    formData.set("features", JSON.stringify(features))
    formData.set("cover_image", coverImage)
    
    try {
      if (project) {
        await updateProject(project.id, formData)
        setMessage({ type: "success", text: "Project updated successfully!" })
      } else {
        await createProject(formData)
        router.push("/admin/projects")
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to save" })
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
          <label className="text-sm font-medium text-foreground">Project Name *</label>
          <input
            name="name"
            defaultValue={project?.name || ""}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Category *</label>
          <select
            name="category"
            defaultValue={project?.category || "web"}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Tech Stack</label>
        <input
          name="techstack"
          defaultValue={project?.techstack || ""}
          placeholder="React, Node.js, MongoDB"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea
          name="description"
          defaultValue={project?.description || ""}
          rows={4}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Cover Image <span className="text-muted-foreground font-normal">(shown as card thumbnail)</span></label>
        <ImageUpload value={coverImage} onChange={setCoverImage} folder="projects/covers" />
      </div>

      {/* Features */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Features</label>
        <p className="text-xs text-muted-foreground">Add key features — each will appear as a bullet point on your portfolio.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature() } }}
            placeholder="e.g. Real-time notifications"
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="button"
            onClick={addFeature}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="flex-1 text-foreground">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Live URL</label>
          <input
            name="link_visit"
            type="url"
            defaultValue={project?.link_visit || ""}
            placeholder="https://..."
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">GitHub URL</label>
          <input
            name="link_code"
            type="url"
            defaultValue={project?.link_code || ""}
            placeholder="https://github.com/..."
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Video URL</label>
          <input
            name="link_video"
            type="url"
            defaultValue={project?.link_video || ""}
            placeholder="https://youtube.com/..."
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Display Order</label>
        <input
          name="display_order"
          type="number"
          defaultValue={project?.display_order || 0}
          className="w-32 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">Project Images</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <div className="relative h-24 rounded-lg overflow-hidden border border-border">
                <Image src={img} alt={`Project image ${index + 1}`} fill className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {showImageUpload ? (
            <ImageUpload 
              onChange={addImage} 
              folder="projects" 
              className="h-24"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowImageUpload(true)}
              className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors"
            >
              <Plus className="w-6 h-6 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {project ? "Save Changes" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
