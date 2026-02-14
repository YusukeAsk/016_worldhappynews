import { cn } from "@/lib/utils"

const tapeColors = [
  "bg-amber-300/50",
  "bg-rose-300/40",
  "bg-sky-300/40",
  "bg-emerald-300/40",
  "bg-orange-300/45",
]

export function MaskingTape({
  position,
  colorIndex = 0,
}: {
  position: string
  colorIndex?: number
}) {
  return (
    <div
      className={cn(
        "tape",
        position,
        tapeColors[colorIndex % tapeColors.length]
      )}
      style={{
        borderRadius: "1px",
        backdropFilter: "blur(0.5px)",
      }}
    />
  )
}
