import { createClient } from "@/lib/supabase/server"
import { ProjectForm } from "@/components/admin/project-form"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function getProject(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()
  return data
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
        <p className="text-muted-foreground mt-2">Update project details</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <ProjectForm project={project} />
      </div>
    </div>
  )
}
