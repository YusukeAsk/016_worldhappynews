"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { NewsCard } from "@/components/news-card"
import type { HappyNewsArticle } from "@/lib/types"

export function MasonryFeed() {
  const [articles, setArticles] = useState<HappyNewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?max=12", {
          next: { revalidate: 3600 },
        })
        if (!res.ok) throw new Error("Failed to fetch")
        const data = (await res.json()) as HappyNewsArticle[]
        if (!cancelled) setArticles(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "読み込みに失敗しました")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchNews()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <section className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        <div className="masonry">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-44 break-inside-avoid rounded-lg bg-muted/60 sm:h-52"
            />
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-muted-foreground">
          世界中の温かいニュースを集めています…
        </p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border bg-card p-8 text-center"
        >
          <p className="text-muted-foreground">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            .env.local に GNEWS_API_KEY と GEMINI_API_KEY を設定するか、しばらくしてから再読み込みしてください。
          </p>
        </motion.div>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        <p className="text-center font-mono text-muted-foreground">
          本日のハッピーニュースはまだ届いていません。また後でお越しください。
        </p>
      </section>
    )
  }

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-4 py-8">
      <div className="masonry">
        {articles.map((article, index) => (
          <NewsCard key={article.id} article={article} index={index} />
        ))}
      </div>
    </section>
  )
}
