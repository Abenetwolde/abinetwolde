"use client"

import { useState } from "react"
import { deleteProject } from "@/lib/actions"
import { Pencil, Trash2, ExternalLink, Github, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Project } from "@/lib/types"

export function ProjectsList({ projects }: { projects: Project[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return
    
    setDeletingId(id)
    try {
      await deleteProject(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-card border border-border rounded-xl">
        <p className="text-muted-foreground">No projects yet. Add your first project!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
        >
          {project.images?.[0] && (
            <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={project.images[0]}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{project.techstack}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.link_visit && (
              <a
                href={project.link_visit}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            {project.link_code && (
              <a
                href={project.link_code}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            <Link
              href={`/admin/projects/${project.id}`}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="w-5 h-5" />
            </Link>
            <button
              onClick={() => handleDelete(project.id)}
              disabled={deletingId === project.id}
              className="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {deletingId === project.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
