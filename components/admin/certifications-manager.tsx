"use client"

import { useState } from "react"
import { createCertification, updateCertification, deleteCertification } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Loader2, Plus, Pencil, Trash2, Save, X, Award } from "lucide-react"
import Image from "next/image"
import type { Certification } from "@/lib/types"

const empty = (): Partial<Certification> => ({
  title: '', issuer: '', issued_date: '', address: '', type: 'online', image: null,
  credential_url: '', description: [], display_order: 0,
})

export function CertificationsManager({ certifications }: { certifications: Certification[] }) {
  const [items, setItems] = useState(certifications)
  const [editing, setEditing] = useState<Partial<Certification> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function openNew() { setEditing(empty()); setImage(''); setIsNew(true) }
  function openEdit(c: Certification) { setEditing(c); setImage(c.image || ''); setIsNew(false) }
  function cancel() { setEditing(null); setIsNew(false) }

  async function handleSave(formData: FormData) {
    setLoading(true); setMessage(null)
    formData.set('image', image)
    try {
      if (isNew) {
        await createCertification(formData)
        setMessage({ type: 'success', text: 'Certification added!' })
      } else {
        await updateCertification(editing!.id!, formData)
        setMessage({ type: 'success', text: 'Certification updated!' })
      }
      setEditing(null); setIsNew(false)
      // Refresh list
      const res = await fetch('/api/certifications').catch(() => null)
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed' })
    } finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this certification?')) return
    try {
      await deleteCertification(id)
      setItems(items.filter(i => i.id !== id))
    } catch (e) {
      alert('Failed to delete')
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <Plus className="w-4 h-4" /> Add Certification
      </button>

      {/* Form */}
      {editing && (
        <form action={handleSave} className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold text-foreground">{isNew ? 'New Certification' : 'Edit Certification'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title *</label>
              <input name="title" defaultValue={editing.title || ''} required className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Issuer *</label>
              <input name="issuer" defaultValue={editing.issuer || ''} required className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Issued Date</label>
              <input name="issued_date" defaultValue={editing.issued_date || ''} placeholder="e.g. Jan 2024" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Type</label>
              <select name="type" defaultValue={editing.type || 'online'} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="online">Online</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Address / Location</label>
              <input name="address" defaultValue={editing.address || ''} placeholder="e.g. Addis Ababa, Ethiopia or Coursera" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Credential URL</label>
              <input name="credential_url" type="url" defaultValue={editing.credential_url || ''} placeholder="https://..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description (one bullet per line)</label>
            <textarea name="description" defaultValue={(editing.description || []).join('\n')} rows={3} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Badge / Logo Image</label>
            <ImageUpload value={image} onChange={setImage} folder="certifications" />
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

      {/* List */}
      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No certifications yet.</p>}
        {items.map((cert) => (
          <div key={cert.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
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
              <p className="font-medium text-foreground truncate">{cert.title}</p>
              <p className="text-sm text-muted-foreground">{cert.issuer}{cert.issued_date ? ` · ${cert.issued_date}` : ''}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(cert)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cert.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
