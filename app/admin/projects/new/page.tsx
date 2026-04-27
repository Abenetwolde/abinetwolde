import { ProjectForm } from "@/components/admin/project-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewProjectPage() {
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
        <h1 className="text-3xl font-bold text-foreground">Add New Project</h1>
        <p className="text-muted-foreground mt-2">Create a new portfolio project</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <ProjectForm />
      </div>
    </div>
  )
}
