const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseClient: any = null

async function getClient() {
  if (!supabaseUrl || !supabaseKey) return null
  if (!supabaseClient) {
    const { createClient } = await import('@supabase/supabase-js')
    supabaseClient = createClient(supabaseUrl, supabaseKey)
  }
  return supabaseClient
}

export async function getUnreadCount(section: string): Promise<number> {
  try {
    const client = await getClient()
    if (!client) return 0
    const { data } = await client
      .from('read_status')
      .select('unread_count')
      .eq('section', section)
      .single()
    return data?.unread_count ?? 0
  } catch {
    return 0
  }
}

export async function markAsRead(section: string): Promise<void> {
  try {
    const client = await getClient()
    if (!client) return
    await client
      .from('read_status')
      .update({ unread_count: 0, last_read_at: new Date().toISOString() })
      .eq('section', section)
  } catch {}
}
