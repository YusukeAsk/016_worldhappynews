"use client"

import Link from "next/link"
import { NewspaperHeader } from "@/components/newspaper-header"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react"
import { MaskingTape } from "@/components/masking-tape"
import { NewsDetailMap } from "@/components/news-detail-map"
import { ArticleComments } from "@/components/article-comments"
import type { HappyNewsArticle } from "@/lib/types"

export function NewsDetailPageClient({ article }: { article: HappyNewsArticle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative z-10 mx-auto max-w-4xl px-4 py-6"
    >
      <NewspaperHeader />

      {/* 戻るリンク */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          トップに戻る
        </Link>
      </div>

      {/* メイン記事カード - 新聞紙がふんわり開くアニメーション */}
      <motion.article
        initial={{
          opacity: 0,
          scale: 0.96,
          rotateX: 8,
          transformPerspective: 1200,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateX: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{ transformStyle: "preserve-3d" }}
        className={article.rotation}
      >
        <MaskingTape position={article.tapePosition} colorIndex={0} />

        <div
          className={`relative overflow-hidden shadow-lg ${article.paperStyle} ${article.tornEdge}`}
        >
          {/* 世界地図エリア */}
          <div className="p-4 border-b border-border/50">
            <h3 className="mb-3 font-mono text-lg text-muted-foreground">
              📍 このニュースの場所
            </h3>
            <NewsDetailMap
              lat={article.lat}
              lng={article.lng}
              country={article.country}
              className="h-48 w-full"
            />
          </div>

          {/* メイン画像 */}
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              unoptimized={article.image.startsWith("http")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span
                className={`inline-block rounded-sm px-2 py-0.5 text-xs font-bold tracking-wide ${article.genreColor}`}
              >
                {article.genre}
              </span>
              <span className="text-xs text-white/90 drop-shadow">
                {article.location}、{article.country}
              </span>
            </div>
          </div>

          {/* 報道内容 - 元記事を充実に日本語翻訳した全文 */}
          <div className="p-6">
            <h1 className="mb-6 font-mono text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {article.title}
            </h1>

            {article.contentTranslated ? (
              <div className="font-mono text-base leading-loose text-foreground/95 sm:text-lg">
                <div className="whitespace-pre-wrap">{article.contentTranslated}</div>
              </div>
            ) : (
              <>
                <p className="mb-4 font-mono text-base leading-relaxed text-muted-foreground">
                  {article.summary}
                </p>
                {article.content && (
                  <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                    <p className="font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                      {article.content}
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-4 font-mono">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {article.sourceName} / {article.publishedAt.slice(0, 10)}
                </span>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:underline"
              >
                元記事を読む
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* コメント欄 */}
            <ArticleComments articleId={article.id} />
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
