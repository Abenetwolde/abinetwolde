"use client"

import { useState, useTransition } from "react"
import { createRecentWork, updateRecentWork, deleteRecentWork, reorderRecentWork } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Loader2, Plus, Pencil, Trash2, Save, X, Briefcase } from "lucide-react"
import Image from "next/image"
import type { RecentWork } from "@/lib/types"

interface FormState {
  name: string
  role: string
  short_description: string
  key_achievement: string
  techstack: string
  category: string
  link_visit: string
  link_code: string
  link_video: string
}

const emptyForm = (): FormState => ({
  name: '', role: '', short_description: '', key_achievement: '',
  techstack: '', category: '', link_visit: '', link_code: '', link_video: '',
})

export function RecentWorksManager({ works }: { works: RecentWork[] }) {
  const [items, setItems] = useState([...works].sort((a, b) => a.display_order - b.display_order))
  const [editingId, setEditingId] = useState<string | null>(null) // null = closed, 'new' = new form
  const [form, setForm] = useState<FormState>(emptyForm())
  const [coverImage, setCoverImage] = useState('')
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [showScreenshotUpload, setShowScreenshotUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function openNew() {
    setForm(emptyForm())
    setCoverImage('')
    setScreenshots([])
    setShowScreenshotUpload(false)
    setEditingId('new')
  }

  function openEdit(w: RecentWork) {
    // Populate ALL fields from the clicked item
    setForm({
      name: w.name || '',
      role: w.role || '',
      short_description: w.short_description || '',
      key_achievement: w.key_achievement || '',
      techstack: w.techstack || '',
      category: w.category || '',
      link_visit: w.link_visit || '',
      link_code: w.link_code || '',
      link_video: w.link_video || '',
    })
    setCoverImage(w.image || '')
    setScreenshots(w.images || [])
    setShowScreenshotUpload(false)
    setEditingId(w.id)
  }

  function cancel() { setEditingId(null) }

  function addScreenshot(url: string) {
    setScreenshots(prev => [...prev, url])
    setShowScreenshotUpload(false)
  }
  function removeScreenshot(i: number) {
    setScreenshots(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    setLoading(true); setMessage(null)
    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.set(k, v))
    formData.set('image', coverImage)
    formData.set('images', JSON.stringify(screenshots))

    try {
      if (editingId === 'new') {
        formData.set('display_order', String(items.length))
        await createRecentWork(formData)
        setMessage({ type: 'success', text: 'Recent work added!' })
      } else {
        const current = items.find(i => i.id === editingId)
        formData.set('display_order', String(current?.display_order ?? 0))
        await updateRecentWork(editingId!, formData)
        setMessage({ type: 'success', text: 'Recent work updated!' })
      }
      setEditingId(null)
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed' })
    } finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return
    try {
      await deleteRecentWork(id)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch { alert('Failed to delete') }
  }

  const isEditing = editingId !== null

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.text}
        </div>
      )}

      {!isEditing && (
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Recent Work
        </button>
      )}

      {/* Edit / New Form — fully controlled inputs */}
      {isEditing && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{editingId === 'new' ? 'New Recent Work' : `Editing: ${form.name}`}</h3>
            <button onClick={cancel} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Project / Work Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Your Role *</label>
              <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required placeholder="e.g. Lead Backend Engineer"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Fintech, Healthcare"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tech Stack</label>
              <input value={form.techstack} onChange={e => setForm(f => ({ ...f, techstack: e.target.value }))} placeholder="React, Node.js, PostgreSQL"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Short Description</label>
            <textarea value={form.short_description} onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Key Achievement <span className="text-muted-foreground font-normal">(one sentence)</span></label>
            <input value={form.key_achievement} onChange={e => setForm(f => ({ ...f, key_achievement: e.target.value }))} placeholder="e.g. Reduced API latency by 60%"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Live URL</label>
              <input type="url" value={form.link_visit} onChange={e => setForm(f => ({ ...f, link_visit: e.target.value }))} placeholder="https://..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">GitHub URL</label>
              <input type="url" value={form.link_code} onChange={e => setForm(f => ({ ...f, link_code: e.target.value }))} placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Video URL</label>
              <input type="url" value={form.link_video} onChange={e => setForm(f => ({ ...f, link_video: e.target.value }))} placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Cover Image <span className="text-muted-foreground font-normal">(optional)</span></label>
            <ImageUpload value={coverImage} onChange={setCoverImage} folder="recent-works" />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Screenshots</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

          <div className="flex gap-3">
            <button type="button" onClick={handleSave} disabled={loading || !form.name || !form.role}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
            <button type="button" onClick={cancel}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No recent works yet.</p>}
        {items.map((work, index) => (
          <RecentWorkRow
            key={work.id}
            work={work}
            index={index}
            total={items.length}
            isEditing={editingId === work.id}
            isPending={isPending}
            onEdit={() => openEdit(work)}
            onDelete={() => handleDelete(work.id)}
            onReorder={(newOrder) => {
              // Update display_order for this item
              const updated = items.map(item =>
                item.id === work.id ? { ...item, display_order: newOrder } : item
              ).sort((a, b) => a.display_order - b.display_order)
              setItems(updated)
              startTransition(async () => {
                await reorderRecentWork(work.id, newOrder)
              })
            }}
          />
        ))}
      </div>
    </div>
  )
}

interface RecentWorkRowProps {
  work: RecentWork
  index: number
  total: number
  isEditing: boolean
  isPending: boolean
  onEdit: () => void
  onDelete: () => void
  onReorder: (newOrder: number) => void
}

function RecentWorkRow({ work, index, isEditing, isPending, onEdit, onDelete, onReorder }: RecentWorkRowProps) {
  const [orderInput, setOrderInput] = useState(String(work.display_order + 1))
  const [saving, setSaving] = useState(false)

  async function handleOrderUpdate() {
    const newOrder = parseInt(orderInput) - 1
    if (isNaN(newOrder) || newOrder < 0) return
    setSaving(true)
    onReorder(newOrder)
    setSaving(false)
  }

  return (
    <div className={`flex items-center gap-3 rounded-xl border bg-card p-3 transition-opacity ${isEditing ? 'border-primary/50 opacity-60' : 'border-border'}`}>
      {/* Order number input */}
      <div className="flex items-center gap-1.5 shrink-0">
        <input
          type="number"
          min={1}
          value={orderInput}
          onChange={e => setOrderInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleOrderUpdate() }}
          className="w-12 rounded border border-border bg-background px-2 py-1 text-center text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          title="Display order (1 = first)"
        />
        <button
          onClick={handleOrderUpdate}
          disabled={saving || isPending}
          className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-40 transition-colors"
          title="Apply order"
        >
          {saving ? '…' : '↑↓'}
        </button>
      </div>

      {work.image ? (
        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image src={work.image} alt={work.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Briefcase className="w-4 h-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate text-sm">{work.name}</p>
        <p className="text-xs text-primary truncate">{work.role}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={onEdit} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
