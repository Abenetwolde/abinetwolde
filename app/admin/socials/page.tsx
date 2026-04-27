import { createClient } from "@/lib/supabase/server"
import { SocialsManager } from "@/components/admin/socials-manager"

async function getSocials() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("socials")
    .select("*")
    .order("display_order", { ascending: true })
  return data || []
}

export default async function SocialsPage() {
  const socials = await getSocials()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Social Links</h1>
        <p className="text-muted-foreground mt-2">Manage your social media links</p>
      </div>

      <SocialsManager socials={socials} />
    </div>
  )
}
