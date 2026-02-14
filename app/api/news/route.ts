import { NextResponse } from "next/server"
import { getHappyNews } from "@/lib/news"

export const dynamic = "force-dynamic"
export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const max = Math.min(30, Math.max(1, parseInt(searchParams.get("max") ?? "12", 10)))

  try {
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
