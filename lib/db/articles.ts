import { createServerClient } from "@/lib/supabase/server"
import type { HappyNewsArticle } from "@/lib/types"

/** DBの記事行 → HappyNewsArticle に変換 */
function rowToArticle(row: Record<string, unknown>): HappyNewsArticle {
  return {
    id: String(row.id),
    title: String(row.title),
    summary: String(row.summary ?? ""),
    location: String(row.location ?? ""),
    country: String(row.country ?? ""),
    countryCode: String(row.country_code ?? ""),
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
    genre: row.genre as HappyNewsArticle["genre"],
    genreColor: String(row.genre_color ?? ""),
    paperStyle: String(row.paper_style ?? ""),
    tapePosition: row.tape_position as HappyNewsArticle["tapePosition"],
    tornEdge: row.torn_edge as HappyNewsArticle["tornEdge"],
    rotation: row.rotation as HappyNewsArticle["rotation"],
    image: String(row.image ?? ""),
    url: String(row.url ?? ""),
    publishedAt: String(row.published_at ?? ""),
    sourceName: String(row.source_name ?? ""),
    content: row.content != null ? String(row.content) : undefined,
    contentTranslated: row.content_translated != null ? String(row.content_translated) : undefined,
  }
}

/** HappyNewsArticle → DB 用オブジェクトに変換 */
function articleToRow(a: HappyNewsArticle): Record<string, unknown> {
  return {
    id: a.id,
    title: a.title,
    summary: a.summary,
    location: a.location,
    country: a.country,
    country_code: a.countryCode,
    lat: a.lat,
    lng: a.lng,
    genre: a.genre,
    genre_color: a.genreColor,
    paper_style: a.paperStyle,
    tape_position: a.tapePosition,
    torn_edge: a.tornEdge,
    rotation: a.rotation,
    image: a.image,
    url: a.url,
    published_at: a.publishedAt,
    source_name: a.sourceName,
    content: a.content ?? null,
    content_translated: a.contentTranslated ?? null,
  }
}

/** Supabase が利用可能か */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  )
}

/** 記事一覧をDBから取得 */
export async function getArticlesFromDb(max: number): Promise<HappyNewsArticle[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(max)
    if (error) {
      console.warn("[db/articles] select error:", error.message, error.cause ?? "")
      return []
    }
    return (data ?? []).map((row) => rowToArticle(row))
  } catch (e) {
    const err = e as Error
    console.warn("[db/articles] getArticlesFromDb error:", err.message, err.cause ?? "")
    return []
  }
}

/** IDで1件取得 */
export async function getArticleByIdFromDb(id: string): Promise<HappyNewsArticle | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("articles").select("*").eq("id", id).single()
    if (error || !data) return null
    return rowToArticle(data)
  } catch (e) {
    console.warn("[db/articles] getArticleByIdFromDb error:", e)
    return null
  }
}

/** 今日（JST）登録された記事数を取得 */
export async function countArticlesCreatedToday(): Promise<number> {
  if (!isSupabaseConfigured()) return 0
  try {
    const now = new Date()
    const jstOffsetMs = 9 * 60 * 60 * 1000
    const jstTime = now.getTime() + jstOffsetMs
    const jstDateOnly = Math.floor(jstTime / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000)
    const startOfTodayJST = new Date(jstDateOnly - jstOffsetMs).toISOString()

    const supabase = createServerClient()
    const { count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfTodayJST)
    if (error) {
      console.warn("[db/articles] count today error:", error.message)
      return 0
    }
    return count ?? 0
  } catch (e) {
    console.warn("[db/articles] countArticlesCreatedToday error:", e)
    return 0
  }
}

/** 記事をDBに保存（既存なら更新） */
export async function upsertArticleToDb(article: HappyNewsArticle): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  try {
    const supabase = createServerClient()
    const { error } = await supabase
      .from("articles")
      .upsert(articleToRow(article), { onConflict: "id" })
    if (error) {
      console.warn("[db/articles] upsert error:", error.message)
      return false
    }
    return true
  } catch (e) {
    console.warn("[db/articles] upsertArticleToDb error:", e)
    return false
  }
}

/** 記事の content_translated を更新 */
export async function updateArticleTranslation(id: string, contentTranslated: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  try {
    const supabase = createServerClient()
    const { error } = await supabase
      .from("articles")
      .update({ content_translated: contentTranslated })
      .eq("id", id)
    if (error) {
      console.warn("[db/articles] update translation error:", error.message)
      return false
    }
    return true
  } catch (e) {
    console.warn("[db/articles] updateArticleTranslation error:", e)
    return false
  }
}
