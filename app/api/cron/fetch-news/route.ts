import { NextResponse } from "next/server"
import { getHappyNews, getHappyNewsRelaxed } from "@/lib/news"
import {
  isSupabaseConfigured,
  countArticlesCreatedToday,
  upsertArticleToDb,
} from "@/lib/db/articles"

export const dynamic = "force-dynamic"
export const maxDuration = 60

/** Vercel Cron 用: 7:00 / 12:00 / 19:00 JST で実行。条件に合う記事を登録し、1日1件以上を確保する */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get("authorization")
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, message: "Supabase not configured, skip" })
  }

  try {
    const fresh = await getHappyNews(10)
    let registered = 0
    for (const a of fresh) {
      const ok = await upsertArticleToDb(a)
      if (ok) registered++
    }

    const countToday = await countArticlesCreatedToday()
    const jstHour = (new Date().getUTCHours() + 9) % 24
    const isEveningRun = jstHour === 19
    let relaxedAdded = 0
    if (countToday === 0 && isEveningRun) {
      const relaxed = await getHappyNewsRelaxed(1)
      for (const a of relaxed) {
        const ok = await upsertArticleToDb(a)
        if (ok) relaxedAdded++
      }
    }

    return NextResponse.json({
      ok: true,
      registered,
      relaxedAdded,
      countToday: countToday + relaxedAdded,
    })
  } catch (e) {
    console.error("[api/cron/fetch-news]", e)
    return NextResponse.json(
      { error: "Cron fetch failed" },
      { status: 500 }
    )
  }
}
