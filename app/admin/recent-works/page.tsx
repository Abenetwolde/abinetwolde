import { createClient } from '@/lib/supabase/server'
import { RecentWorksManager } from '@/components/admin/recent-works-manager'
import type { RecentWork } from '@/lib/types'

export default async function AdminRecentWorksPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('recent_works').select('*').order('display_order')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Recent Work</h1>
        <p className="text-muted-foreground">Manage your featured recent work entries.</p>
      </div>
      <RecentWorksManager works={(data || []) as RecentWork[]} />
    </div>
  )
}
