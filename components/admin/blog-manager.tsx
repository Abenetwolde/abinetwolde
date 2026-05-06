"use client"

import { useState } from "react"
import { createBlog, updateBlog, deleteBlog } from "@/lib/actions"
import { ImageUpload } from "./image-upload"
import { Loader2, Plus, Pencil, Trash2, Save, X, FileText, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Blog } from "@/lib/types"

const empty = (): Partial<Blog> => ({
  title: '', slug: '', summary: '', content: '', cover_image: null,
  tags: [], url: '', published_at: '', display_order: 0,
})

export function BlogManager({ blogs }: { blogs: Blog[] }) {
  const [items, setItems] = useState(blogs)
  const [editing, setEditing] = useState<Partial<Blog> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [preview, setPreview] = useState(false)

  function openNew() { setEditing(empty()); setCoverImage(''); setIsNew(true); setPreview(false) }
  function openEdit(b: Blog) { setEditing(b); setCoverImage(b.cover_image || ''); setIsNew(false); setPreview(false) }
  function cancel() { setEditing(null); setIsNew(false); setPreview(false) }

  async function handleSave(formData: FormData) {
    setLoading(true); setMessage(null)
    formData.set('cover_image', coverImage)
    try {
      if (isNew) {
        await createBlog(formData)
        setMessage({ type: 'success', text: 'Blog post created!' })
      } else {
        await updateBlog(editing!.id!, formData)
        setMessage({ type: 'success', text: 'Blog post updated!' })
      }
      setEditing(null); setIsNew(false)
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed' })
    } finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this blog post?')) return
    try {
      await deleteBlog(id)
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
        <Plus className="w-4 h-4" /> New Blog Post
      </button>

      {/* Editor */}
      {editing && (
        <form action={handleSave} className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{isNew ? 'New Blog Post' : 'Edit Blog Post'}</h3>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="w-4 h-4" />
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Title *</label>
            <input
              name="title"
              defaultValue={editing.title || ''}
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Slug <span className="text-muted-foreground font-normal">(auto-generated if empty)</span></label>
            <input
              name="slug"
              defaultValue={editing.slug || ''}
              placeholder="my-blog-post-title"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground">URL: /blog/<span className="text-primary">{editing.slug || 'auto-generated'}</span></p>
          </div>

          {/* Summary */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Summary <span className="text-muted-foreground font-normal">(shown on listing card)</span></label>
            <textarea
              name="summary"
              defaultValue={editing.summary || ''}
              rows={2}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Full content */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Content <span className="text-muted-foreground font-normal">(Markdown supported)</span>
            </label>
            <div className="rounded-lg border border-border overflow-hidden">
              {/* Markdown toolbar hint */}
              <div className="flex gap-3 border-b border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
                <span><strong>**bold**</strong></span>
                <span><em>*italic*</em></span>
                <span># Heading</span>
                <span>- list item</span>
                <span>`code`</span>
                <span>```code block```</span>
                <span>[link](url)</span>
                <span>![img](url)</span>
              </div>
              <textarea
                name="content"
                defaultValue={editing.content || ''}
                rows={20}
                placeholder={`# Introduction\n\nWrite your blog post here using Markdown...\n\n## Section 1\n\nYour content...\n\n## Section 2\n\nMore content...`}
                className="w-full px-4 py-3 bg-background text-sm font-mono focus:outline-none resize-y"
              />
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Published Date</label>
              <input
                name="published_at"
                defaultValue={editing.published_at || ''}
                placeholder="e.g. Jan 15, 2024"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Original URL <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input
                name="url"
                type="url"
                defaultValue={editing.url || ''}
                placeholder="https://medium.com/..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tags <span className="text-muted-foreground font-normal">(comma separated)</span></label>
            <input
              name="tags"
              defaultValue={(editing.tags || []).join(', ')}
              placeholder="React, TypeScript, Next.js"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Cover image */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Cover Image</label>
            <ImageUpload value={coverImage} onChange={setCoverImage} folder="blog" />
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
        {items.length === 0 && <p className="text-sm text-muted-foreground">No blog posts yet.</p>}
        {items.map((post) => (
          <div key={post.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            {post.cover_image ? (
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{post.title}</p>
              <p className="text-xs text-muted-foreground">/blog/{post.slug || post.id}</p>
              {post.published_at && <p className="text-xs text-muted-foreground">{post.published_at}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/blog/${post.slug || post.id}`}
                target="_blank"
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="View post"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button onClick={() => openEdit(post)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
