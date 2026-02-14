import { Heart } from "lucide-react"

export function NewspaperFooter() {
  return (
    <footer className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-4">
      <div className="header-rule mb-4">
        <div className="header-rule-inner" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center font-mono text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span>温かいニュースは、世界のどこかで今日も生まれています</span>
          <Heart className="h-3 w-3 fill-accent text-accent" />
        </div>
        <p className="text-base">
          {"Collected with love, delivered with care."}
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-widest">
          {"The World Happy News \u00A9 2026 \u2014 All Rights Reserved"}
        </p>
      </div>
    </footer>
  )
}
