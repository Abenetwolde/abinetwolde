import { createClient } from '@/lib/supabase/server'
import { BlogManager } from '@/components/admin/blog-manager'
import type { Blog } from '@/lib/types'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('blogs').select('*').order('display_order')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
        <p className="text-muted-foreground">Manage your blog posts and articles.</p>
      </div>
      <BlogManager blogs={(data || []) as Blog[]} />
    </div>
  )
}
