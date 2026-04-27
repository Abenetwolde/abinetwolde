import { createClient } from "@/lib/supabase/server"
import { ExperienceManager } from "@/components/admin/experience-manager"

async function getExperiences() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("display_order", { ascending: true })
  return data || []
}

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Experience</h1>
        <p className="text-muted-foreground mt-2">Manage your work experience</p>
      </div>

      <ExperienceManager experiences={experiences} />
    </div>
  )
}
