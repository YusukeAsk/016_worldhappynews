import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/** ブラウザ（クライアント）用 Supabase クライアント */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください")
  }
  return createSupabaseClient(url, key)
}
