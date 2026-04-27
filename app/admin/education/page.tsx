import { createClient } from "@/lib/supabase/server"
import { EducationManager } from "@/components/admin/education-manager"

async function getEducations() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("educations")
    .select("*")
    .order("display_order", { ascending: true })
  return data || []
}

export default async function EducationPage() {
  const educations = await getEducations()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Education</h1>
        <p className="text-muted-foreground mt-2">Manage your educational background</p>
      </div>

      <EducationManager educations={educations} />
    </div>
  )
}
