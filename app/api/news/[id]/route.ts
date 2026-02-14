import { NextResponse } from "next/server"
import { getHappyNewsById } from "@/lib/news"
import {
  isSupabaseConfigured,
  getArticleByIdFromDb,
  upsertArticleToDb,
  updateArticleTranslation,
} from "@/lib/db/articles"
import { translateArticleContent } from "@/lib/news-translate"

export const dynamic = "force-dynamic"
export const revalidate = 3600

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  try {
    if (isSupabaseConfigured()) {
      let article = await getArticleByIdFromDb(id)
      if (article) {
        if (article.content?.trim() && !article.contentTranslated) {
          const translated = await translateArticleContent(article.title, article.content)
          if (translated) {
            await updateArticleTranslation(id, translated)
            article = { ...article, contentTranslated: translated }
          }
        }
        return NextResponse.json(article)
      }
    }
    const article = await getHappyNewsById(id)
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (isSupabaseConfigured() && article) {
      await upsertArticleToDb(article)
    }
    return NextResponse.json(article)
  } catch (e) {
    console.error("[api/news/[id]]", e)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}
