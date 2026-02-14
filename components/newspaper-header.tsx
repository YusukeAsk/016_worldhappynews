"use client"

import { Globe } from "lucide-react"

export function NewspaperHeader() {
  return (
    <header className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-4">
      {/* Top ornamental line */}
      <div className="header-rule mb-4">
        <div className="header-rule-inner" />
      </div>

      {/* Main title area */}
      <div className="flex flex-col items-center text-center font-mono">
        {/* Small globe icon + tagline */}
        <div className="mb-1.5 flex items-center gap-2 text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span className="text-xs tracking-widest uppercase">
            Delivering Warmth From Around The World
          </span>
          <Globe className="h-4 w-4" />
        </div>

        {/* Main title - 少し小さめ */}
        <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
          The World Happy News
        </h1>

        {/* サブタイトル */}
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          ～心があたたまるニュースだけ集めた通信～
        </p>

        {/* Date and location */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="font-mono">2026年2月14日</span>
          <span className="text-border">{"/"}</span>
          <span className="font-mono text-sm">世界中のどこかで</span>
          <span className="text-border">{"/"}</span>
          <span className="font-mono tracking-wider text-xs uppercase">
            Vol. 2,026 No. 45
          </span>
        </div>
      </div>

      {/* Bottom ornamental line */}
      <div className="header-rule mt-4">
        <div className="header-rule-inner" />
      </div>

      {/* Section label */}
      <div className="mt-3 flex items-center justify-between font-mono text-xs text-muted-foreground uppercase tracking-widest">
        <span>{"Today's Stories"}</span>
        <span>{"世界の温かいニュース"}</span>
      </div>
    </header>
  )
}
