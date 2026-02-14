"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Send } from "lucide-react"
import type { Comment } from "@/lib/db/comments"

export function ArticleComments({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [authorName, setAuthorName] = useState("")
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/news/${articleId}/comments`)
      if (res.ok) {
        const data = (await res.json()) as Comment[]
        setComments(data)
      }
    } catch (e) {
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [articleId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !body.trim() || submitting) return

    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/news/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: authorName.trim(), body: body.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "投稿に失敗しました")
        return
      }
      setComments((prev) => [...prev, data])
      setBody("")
    } catch (e) {
      setError("投稿に失敗しました")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (s: string) => {
    try {
      const d = new Date(s)
      return d.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return s
    }
  }

  return (
    <div className="mt-8 border-t border-border/50 pt-6">
      <h3 className="mb-4 flex items-center gap-2 font-mono text-lg font-bold text-foreground">
        <MessageCircle className="h-5 w-5" />
        コメント
      </h3>

      {/* 投稿フォーム */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="space-y-3">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="お名前（ニックネーム可）"
            className="w-full rounded-lg border border-border bg-background px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            maxLength={100}
            required
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="コメントを自由にどうぞ..."
            rows={4}
            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            maxLength={2000}
            required
          />
        </div>
        {error && (
          <p className="mt-2 font-mono text-sm text-destructive">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-mono text-sm font-bold text-accent-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {submitting ? "送信中..." : "投稿する"}
        </button>
      </form>

      {/* コメント一覧 */}
      <div className="space-y-4">
        {loading ? (
          <p className="font-mono text-sm text-muted-foreground">
            コメントを読み込み中...
          </p>
        ) : comments.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">
            まだコメントはありません。最初のコメントをどうぞ！
          </p>
        ) : (
          comments.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-border/50 bg-muted/30 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-foreground">
                  {c.authorName}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(c.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">
                {c.body}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
