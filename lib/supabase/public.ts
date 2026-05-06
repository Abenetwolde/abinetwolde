import { createClient as createBrowserClient } from '@supabase/supabase-js'

/**
 * A cookie-free Supabase client for public read-only data.
 * Safe to use inside unstable_cache() since it doesn't call cookies().
 */
export function createPublicClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
