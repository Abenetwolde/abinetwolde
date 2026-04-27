import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { 
  User, 
  FolderKanban, 
  Code2, 
  Briefcase, 
  GraduationCap,
  Share2,
  ArrowRight
} from "lucide-react"

async function getStats() {
  const supabase = await createClient()
  
  const [projects, skills, experiences, educations, socials] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact" }),
    supabase.from("skills").select("id", { count: "exact" }),
    supabase.from("experiences").select("id", { count: "exact" }),
    supabase.from("educations").select("id", { count: "exact" }),
    supabase.from("socials").select("id", { count: "exact" }),
  ])

  return {
    projects: projects.count || 0,
    skills: skills.count || 0,
    experiences: experiences.count || 0,
    educations: educations.count || 0,
    socials: socials.count || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Projects", count: stats.projects, icon: FolderKanban, href: "/admin/projects", color: "bg-blue-500/10 text-blue-500" },
    { label: "Skills", count: stats.skills, icon: Code2, href: "/admin/skills", color: "bg-green-500/10 text-green-500" },
    { label: "Experiences", count: stats.experiences, icon: Briefcase, href: "/admin/experience", color: "bg-purple-500/10 text-purple-500" },
    { label: "Education", count: stats.educations, icon: GraduationCap, href: "/admin/education", color: "bg-orange-500/10 text-orange-500" },
    { label: "Social Links", count: stats.socials, icon: Share2, href: "/admin/socials", color: "bg-pink-500/10 text-pink-500" },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your portfolio content</p>
      </div>

      {/* Quick access to profile */}
      <Link 
        href="/admin/profile"
        className="block mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl hover:border-primary/40 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Profile & About</h2>
              <p className="text-muted-foreground">Edit your personal information and bio</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </Link>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-3xl font-bold text-foreground">{card.count}</p>
            <p className="text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
