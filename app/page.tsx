import { NewspaperHeader } from "@/components/newspaper-header"
import { MasonryFeed } from "@/components/masonry-feed"
import { NewspaperFooter } from "@/components/newspaper-footer"

export default function Page() {
  return (
    <main className="noise-bg min-h-screen">
      <NewspaperHeader />
      <MasonryFeed />
      <NewspaperFooter />
    </main>
  )
}
