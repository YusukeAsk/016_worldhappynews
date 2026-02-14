import { NextResponse } from "next/server"
import { getHappyNewsById } from "@/lib/news"

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
    const article = await getHappyNewsById(id)
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
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
