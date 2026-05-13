"use client"

import { useState, useTransition } from "react"
import { createCertification, updateCertification, deleteCertification, reorderCertification } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Loader2, Plus, Pencil, Trash2, Save, X, Award, ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"
import type { Certification } from "@/lib/types"

interface FormState {
  title: string
  issuer: string
  issued_date: string
  address: string
  type: string
  credential_url: string
  description: string
}

const emptyForm = (): FormState => ({
  title: '', issuer: '', issued_date: '', address: '', type: 'online',
  credential_url: '', description: '',
})

export function CertificationsManager({ certifications }: { certifications: Certification[] }) {
  const [items, setItems] = useState([...certifications].sort((a, b) => a.display_order - b.display_order))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function openNew() {
    setForm(emptyForm())
    setImage('')
    setEditingId('new')
  }

  function openEdit(c: Certification) {
    setForm({
      title: c.title || '',
      issuer: c.issuer || '',
      issued_date: c.issued_date || '',
      address: c.address || '',
      type: c.type || 'online',
      credential_url: c.credential_url || '',
      description: (c.description || []).join('\n'),
    })
    setImage(c.image || '')
    setEditingId(c.id)
  }

  function cancel() { setEditingId(null) }

  async function handleSave() {
    setLoading(true); setMessage(null)
    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.set(k, v))
    formData.set('image', image)

    try {
      if (editingId === 'new') {
        formData.set('display_order', String(items.length))
        await createCertification(formData)
        setMessage({ type: 'success', text: 'Certification added!' })
      } else {
        const current = items.find(i => i.id === editingId)
        formData.set('display_order', String(current?.display_order ?? 0))
        await updateCertification(editingId!, formData)
        setMessage({ type: 'success', text: 'Certification updated!' })
      }
      setEditingId(null)
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed' })
    } finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this certification?')) return
    try {
      await deleteCertification(id)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch { alert('Failed to delete') }
  }

  function moveItem(index: number, direction: 'up' | 'down') {
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= items.length) return

    const newItems = [...items]
    ;[newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]]
    const updated = newItems.map((item, i) => ({ ...item, display_order: i }))
    setItems(updated)

    startTransition(async () => {
      await Promise.all([
        reorderCertification(updated[index].id, updated[index].display_order),
        reorderCertification(updated[swapIndex].id, updated[swapIndex].display_order),
      ])
    })
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
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      )}

      {isEditing && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{editingId === 'new' ? 'New Certification' : `Editing: ${form.title}`}</h3>
            <button onClick={cancel} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Issuer *</label>
              <input value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Issued Date</label>
              <input value={form.issued_date} onChange={e => setForm(f => ({ ...f, issued_date: e.target.value }))} placeholder="e.g. Jan 2024"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="online">Online</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium">Address / Location</label>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="e.g. Addis Ababa or Coursera"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium">Credential URL</label>
              <input type="url" value={form.credential_url} onChange={e => setForm(f => ({ ...f, credential_url: e.target.value }))} placeholder="https://..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description (one bullet per line)</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Badge / Logo Image</label>
            <ImageUpload value={image} onChange={setImage} folder="certifications" />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={handleSave} disabled={loading || !form.title || !form.issuer}
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

      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No certifications yet.</p>}
        {items.map((cert, index) => (
          <div key={cert.id} className={`flex items-center gap-3 rounded-xl border bg-card p-4 transition-opacity ${editingId === cert.id ? 'border-primary/50 opacity-60' : 'border-border'}`}>
            <div className="flex flex-col gap-0.5 shrink-0">
              <button onClick={() => moveItem(index, 'up')} disabled={index === 0 || isPending}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors" title="Move up">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1 || isPending}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors" title="Move down">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {cert.image ? (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={cert.image} alt={cert.title} fill className="object-contain p-1" />
              </div>
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Award className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate text-sm">{cert.title}</p>
              <p className="text-xs text-muted-foreground">{cert.issuer}{cert.issued_date ? ` · ${cert.issued_date}` : ''}</p>
              <p className="text-xs text-muted-foreground/60">#{index + 1}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(cert)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cert.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
