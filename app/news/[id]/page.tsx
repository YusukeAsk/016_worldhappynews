import { notFound } from "next/navigation"
import { getHappyNewsById } from "@/lib/news"
import { NewsDetailPageClient } from "./page-client"

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await getHappyNewsById(id)
  if (!article) notFound()

  return (
    <main className="noise-bg min-h-screen">
      <NewsDetailPageClient article={article} />
    </main>
  )
}
