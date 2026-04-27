import { createClient } from "@/lib/supabase/server"
import { SkillsManager } from "@/components/admin/skills-manager"

async function getSkills() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("category")
    .order("display_order", { ascending: true })
  return data || []
}

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Skills</h1>
        <p className="text-muted-foreground mt-2">Manage your technical skills</p>
      </div>

      <SkillsManager skills={skills} />
    </div>
  )
}
