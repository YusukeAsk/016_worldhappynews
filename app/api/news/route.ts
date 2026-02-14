import { NextResponse } from "next/server"
import { getHappyNews } from "@/lib/news"
import {
  isSupabaseConfigured,
  getArticlesFromDb,
  upsertArticleToDb,
} from "@/lib/db/articles"

export const dynamic = "force-dynamic"
export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const max = Math.min(30, Math.max(1, parseInt(searchParams.get("max") ?? "12", 10)))

  try {
    if (isSupabaseConfigured()) {
      let articles = await getArticlesFromDb(max)
      if (articles.length < max) {
        const fresh = await getHappyNews(max)
        for (const a of fresh) {
          await upsertArticleToDb(a)
        }
        articles = await getArticlesFromDb(max)
      }
      return NextResponse.json(articles)
    }
    const articles = await getHappyNews(max)
    return NextResponse.json(articles)
  } catch (e) {
    console.error("[api/news]", e)
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    )
  }
}
