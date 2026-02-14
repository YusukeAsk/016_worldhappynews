import { createServerClient } from "@/lib/supabase/server"

export type Comment = {
  id: string
  articleId: string
  authorName: string
  body: string
  createdAt: string
}

/** コメント一覧を取得 */
export async function getCommentsByArticleId(articleId: string): Promise<Comment[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("comments")
      .select("id, article_id, author_name, body, created_at")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true })
    if (error) {
      console.warn("[db/comments] select error:", error.message)
      return []
    }
    return (data ?? []).map((row) => ({
      id: String(row.id),
      articleId: String(row.article_id),
      authorName: String(row.author_name),
      body: String(row.body),
      createdAt: String(row.created_at),
    }))
  } catch (e) {
    console.warn("[db/comments] getCommentsByArticleId error:", e)
    return []
  }
}

/** コメントを追加 */
export async function insertComment(
  articleId: string,
  authorName: string,
  body: string
): Promise<Comment | null> {
  const name = authorName.trim()
  const text = body.trim()
  if (!name || !text) return null
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("comments")
      .insert({
        article_id: articleId,
        author_name: name,
        body: text,
      })
      .select("id, article_id, author_name, body, created_at")
      .single()
    if (error) {
      console.warn("[db/comments] insert error:", error.message)
      return null
    }
    return {
      id: String(data.id),
      articleId: String(data.article_id),
      authorName: String(data.author_name),
      body: String(data.body),
      createdAt: String(data.created_at),
    }
  } catch (e) {
    console.warn("[db/comments] insertComment error:", e)
    return null
  }
}
