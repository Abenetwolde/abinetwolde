import { createClient } from '@/lib/supabase/server'
import { CertificationsManager } from '@/components/admin/certifications-manager'
import type { Certification } from '@/lib/types'

export default async function AdminCertificationsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('certifications').select('*').order('display_order')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Certifications</h1>
        <p className="text-muted-foreground">Manage your certifications and credentials.</p>
      </div>
      <CertificationsManager certifications={(data || []) as Certification[]} />
    </div>
  )
}
