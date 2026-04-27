import { createClient } from "@/lib/supabase/server"
import { ProjectsList } from "@/components/admin/projects-list"
import Link from "next/link"
import { Plus } from "lucide-react"

async function getProjects() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
  return data || []
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </Link>
      </div>

      <ProjectsList projects={projects} />
    </div>
  )
}
