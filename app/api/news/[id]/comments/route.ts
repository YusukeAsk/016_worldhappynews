import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/db/articles"
import { getCommentsByArticleId, insertComment } from "@/lib/db/comments"

export const dynamic = "force-dynamic"

/** コメント一覧取得 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json([])
  }

  try {
    const comments = await getCommentsByArticleId(id)
    return NextResponse.json(comments)
  } catch (e) {
    console.error("[api/news/[id]/comments] GET", e)
    return NextResponse.json([], { status: 200 })
  }
}

/** コメント投稿 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Comments are not available. Supabase is not configured." },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const authorName = String(body.authorName ?? "").trim()
    const text = String(body.body ?? "").trim()

    if (!authorName || !text) {
      return NextResponse.json(
        { error: "名前とコメントは必須です" },
        { status: 400 }
      )
    }

    if (authorName.length > 100) {
      return NextResponse.json(
        { error: "名前は100文字以内で入力してください" },
        { status: 400 }
      )
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { error: "コメントは2000文字以内で入力してください" },
        { status: 400 }
      )
    }

    const comment = await insertComment(id, authorName, text)
    if (!comment) {
      return NextResponse.json(
        { error: "コメントの投稿に失敗しました" },
        { status: 500 }
      )
    }
    return NextResponse.json(comment)
  } catch (e) {
    console.error("[api/news/[id]/comments] POST", e)
    return NextResponse.json(
      { error: "コメントの投稿に失敗しました" },
      { status: 500 }
    )
  }
}
