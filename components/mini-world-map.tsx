export function MiniWorldMap({ lat, lng }: { lat: number; lng: number }) {
  // Convert lat/lng to x/y on a simple world map projection
  const x = ((lng + 180) / 360) * 100
  const y = ((90 - lat) / 180) * 100

  return (
    <div className="relative h-8 w-14 overflow-hidden rounded-sm border border-border/50">
      {/* Simple SVG world map outline */}
      <svg
        viewBox="0 0 100 50"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified continent outlines */}
        <rect width="100" height="50" fill="hsl(var(--muted))" rx="1" />
        {/* North America */}
        <path
          d="M10 8 L25 6 L28 12 L25 18 L22 22 L16 20 L12 16 L8 12Z"
          fill="hsl(var(--border))"
        />
        {/* South America */}
        <path
          d="M22 24 L28 22 L30 28 L28 36 L24 40 L20 34 L20 28Z"
          fill="hsl(var(--border))"
        />
        {/* Europe */}
        <path
          d="M42 6 L52 5 L54 10 L50 14 L44 12 L42 8Z"
          fill="hsl(var(--border))"
        />
        {/* Africa */}
        <path
          d="M44 16 L54 14 L58 20 L56 30 L50 36 L44 30 L42 22Z"
          fill="hsl(var(--border))"
        />
        {/* Asia */}
        <path
          d="M56 4 L80 3 L85 10 L82 18 L74 20 L66 16 L60 12 L56 8Z"
          fill="hsl(var(--border))"
        />
        {/* Australia */}
        <path
          d="M76 30 L86 28 L90 32 L88 38 L80 38 L76 34Z"
          fill="hsl(var(--border))"
        />
        {/* Antarctica hint */}
        <path
          d="M20 46 L80 46 L78 49 L22 49Z"
          fill="hsl(var(--border))"
        />
        {/* Location pin */}
        <circle
          cx={x}
          cy={y * 0.5}
          r="2.5"
          fill="hsl(var(--accent))"
          stroke="hsl(var(--accent-foreground))"
          strokeWidth="0.5"
        />
        <circle
          cx={x}
          cy={y * 0.5}
          r="5"
          fill="hsl(var(--accent))"
          opacity="0.2"
        />
      </svg>
    </div>
  )
}
