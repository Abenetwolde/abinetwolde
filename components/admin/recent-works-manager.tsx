"use client"

import { useState } from "react"
import { createRecentWork, updateRecentWork, deleteRecentWork } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Loader2, Plus, Pencil, Trash2, Save, X, Briefcase } from "lucide-react"
import Image from "next/image"
import type { RecentWork } from "@/lib/types"

const empty = (): Partial<RecentWork> => ({
  name: '', role: '', short_description: '', key_achievement: '',
  techstack: '', category: '', image: null, images: [],
  link_visit: '', link_code: '', link_video: '', display_order: 0,
})

export function RecentWorksManager({ works }: { works: RecentWork[] }) {
  const [items, setItems] = useState(works)
  const [editing, setEditing] = useState<Partial<RecentWork> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [showScreenshotUpload, setShowScreenshotUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function openNew() { setEditing(empty()); setCoverImage(''); setScreenshots([]); setIsNew(true) }
  function openEdit(w: RecentWork) {
    setEditing(w); setCoverImage(w.image || ''); setScreenshots(w.images || [])
    setIsNew(false)
  }
  function cancel() { setEditing(null); setIsNew(false) }

  function addScreenshot(url: string) {
    setScreenshots(prev => [...prev, url])
    setShowScreenshotUpload(false)
  }
  function removeScreenshot(i: number) {
    setScreenshots(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSave(formData: FormData) {
    setLoading(true); setMessage(null)
    formData.set('image', coverImage)
    formData.set('images', JSON.stringify(screenshots))
    try {
      if (isNew) {
        await createRecentWork(formData)
        setMessage({ type: 'success', text: 'Recent work added!' })
      } else {
        await updateRecentWork(editing!.id!, formData)
        setMessage({ type: 'success', text: 'Recent work updated!' })
      }
      setEditing(null); setIsNew(false)
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed' })
    } finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return
    try {
      await deleteRecentWork(id)
      setItems(items.filter(i => i.id !== id))
    } catch { alert('Failed to delete') }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <Plus className="w-4 h-4" /> Add Recent Work
      </button>

      {editing && (
        <form action={handleSave} className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h3 className="font-semibold text-foreground">{isNew ? 'New Recent Work' : 'Edit Recent Work'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Project / Work Name *</label>
              <input name="name" defaultValue={editing.name || ''} required className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Your Role *</label>
              <input name="role" defaultValue={editing.role || ''} required placeholder="e.g. Lead Backend Engineer" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <input name="category" defaultValue={editing.category || ''} placeholder="e.g. Fintech, Healthcare" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tech Stack</label>
              <input name="techstack" defaultValue={editing.techstack || ''} placeholder="React, Node.js, PostgreSQL" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Short Description</label>
            <textarea name="short_description" defaultValue={editing.short_description || ''} rows={3} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Key Achievement <span className="text-muted-foreground font-normal">(one sentence)</span></label>
            <input name="key_achievement" defaultValue={editing.key_achievement || ''} placeholder="e.g. Reduced API latency by 60% serving 2M+ users" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Live URL</label>
              <input name="link_visit" type="url" defaultValue={editing.link_visit || ''} placeholder="https://..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">GitHub URL</label>
              <input name="link_code" type="url" defaultValue={editing.link_code || ''} placeholder="https://github.com/..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Video URL</label>
              <input name="link_video" type="url" defaultValue={editing.link_video || ''} placeholder="https://youtube.com/..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          {/* Cover image */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Cover Image <span className="text-muted-foreground font-normal">(optional — shown in card header)</span></label>
            <ImageUpload value={coverImage} onChange={setCoverImage} folder="recent-works" />
          </div>

          {/* Screenshots */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Screenshots <span className="text-muted-foreground font-normal">(shown in lightbox when "View Screenshots" is clicked)</span></label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {screenshots.map((src, i) => (
                <div key={i} className="relative group">
                  <div className="relative h-20 overflow-hidden rounded-lg border border-border bg-muted">
                    <Image src={src} alt={`Screenshot ${i + 1}`} fill className="object-cover" />
                  </div>
                  <button type="button" onClick={() => removeScreenshot(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {showScreenshotUpload ? (
                <ImageUpload onChange={addScreenshot} folder="recent-works/screenshots" className="h-20" />
              ) : (
                <button type="button" onClick={() => setShowScreenshotUpload(true)}
                  className="h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          <input name="display_order" type="hidden" defaultValue={editing.display_order || 0} />

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
            <button type="button" onClick={cancel} className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No recent works yet.</p>}
        {items.map((work) => (
          <div key={work.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            {work.image ? (
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={work.image} alt={work.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Briefcase className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{work.name}</p>
              <p className="text-sm text-primary truncate">{work.role}</p>
              <p className="text-xs text-muted-foreground">{(work.images || []).length} screenshot{(work.images || []).length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(work)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(work.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
