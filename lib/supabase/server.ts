import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/** サーバー用 Supabase クライアント（記事の保存・コメントの操作に使用） */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY（または NEXT_PUBLIC_SUPABASE_ANON_KEY）を設定してください"
    )
  }
  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
  })
}
