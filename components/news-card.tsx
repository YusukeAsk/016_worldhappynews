"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { MiniWorldMap } from "@/components/mini-world-map"
import { MaskingTape } from "@/components/masking-tape"
import type { HappyNewsArticle } from "@/lib/types"

/** id文字列から色インデックスを算出 */
function colorIndexFromId(id: string): number {
  let n = 0
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i)
  return n
}

export function NewsCard({
  article,
  index,
}: {
  article: HappyNewsArticle
  index: number
}) {
  const colorIndex = colorIndexFromId(article.id)

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        y: -6,
        scale: 1.02,
        zIndex: 50,
        transition: { duration: 0.3 },
      }}
      className={cn(
        "group relative cursor-pointer",
        article.rotation
      )}
    >
      <Link href={`/news/${article.id}`} className="block">
        {/* Masking tape decoration */}
        <MaskingTape position={article.tapePosition} colorIndex={colorIndex} />

        {/* Card body */}
        <div
          className={cn(
            "relative flex flex-col overflow-hidden shadow-md transition-shadow duration-300 group-hover:shadow-xl sm:flex-row",
            article.paperStyle,
            article.tornEdge
          )}
        >
          {/* Image - 左側に配置（横長レイアウト） */}
          <div className="relative h-48 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-72 sm:min-h-[220px]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 288px"
              unoptimized={article.image.startsWith("http")}
            />
            {/* Genre label */}
            <div className="absolute top-3 left-3">
              <span
                className={cn(
                  "inline-block rounded-sm px-2 py-0.5 text-xs font-bold tracking-wide",
                  article.genreColor
                )}
              >
                {article.genre}
              </span>
            </div>
          </div>

          {/* Content area - 1記事を大切に */}
          <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
            {/* Location row */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>
                  {article.location}、{article.country}
                </span>
              </div>
              <MiniWorldMap lat={article.lat} lng={article.lng} />
            </div>

            {/* Title - ストーリーの見出しとして */}
            <h2 className="mb-2 font-mono text-lg font-bold leading-snug text-foreground sm:text-xl">
              {article.title}
            </h2>

            {/* Summary - 心のこもった導入 */}
            <p className="flex-1 font-mono text-sm leading-relaxed text-muted-foreground sm:text-base line-clamp-2">
              {article.summary}
            </p>

            {/* Read more */}
            <div className="mt-4 flex items-center gap-1 font-mono text-sm font-bold text-accent">
              <span>{"つづきを読む →"}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
