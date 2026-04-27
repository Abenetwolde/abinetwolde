import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/admin/profile-form"
import { AboutForm } from "@/components/admin/about-form"

async function getProfileData() {
  const supabase = await createClient()
  
  const [profileRes, aboutRes] = await Promise.all([
    supabase.from("profile").select("*").single(),
    supabase.from("about").select("*").single(),
  ])

  return {
    profile: profileRes.data,
    about: aboutRes.data,
  }
}

export default async function ProfilePage() {
  const { profile, about } = await getProfileData()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile & About</h1>
        <p className="text-muted-foreground mt-2">Edit your personal information and bio</p>
      </div>

      <div className="space-y-8">
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Profile Information</h2>
          <ProfileForm profile={profile} />
        </section>

        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">About Section</h2>
          <AboutForm about={about} />
        </section>
      </div>
    </div>
  )
}
