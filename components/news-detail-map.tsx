"use client"

import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

const GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

const ComposableMap = dynamic(
  () => import("react-simple-maps").then((m) => m.ComposableMap),
  { ssr: false }
)
const Geographies = dynamic(
  () => import("react-simple-maps").then((m) => m.Geographies),
  { ssr: false }
)
const Geography = dynamic(
  () => import("react-simple-maps").then((m) => m.Geography),
  { ssr: false }
)
const ZoomableGroup = dynamic(
  () => import("react-simple-maps").then((m) => m.ZoomableGroup),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-simple-maps").then((m) => m.Marker),
  { ssr: false }
)

export function NewsDetailMap({
  lat,
  lng,
  country,
  className,
}: {
  lat: number
  lng: number
  country: string
  className?: string
}) {
  const coordinates: [number, number] = [lng, lat]

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        "bg-[#e8f0f5] shadow-inner",
        className
      )}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: coordinates,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={coordinates} zoom={2} minZoom={1} maxZoom={4}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#d4c4a8"
                  stroke="#8b7355"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#e0d4bc" },
                    pressed: { outline: "none", fill: "#c9b896" },
                  }}
                />
              ))
            }
          </Geographies>
          <Marker coordinates={coordinates}>
            <circle
              r={6}
              fill="hsl(var(--accent))"
              stroke="hsl(var(--accent-foreground))"
              strokeWidth={2}
            />
            <circle r={12} fill="hsl(var(--accent))" opacity={0.2} />
          </Marker>
        </ZoomableGroup>
      </ComposableMap>
      <div className="border-t border-border bg-muted/50 px-3 py-2 text-center text-xs text-muted-foreground font-mono">
        📍 {country}
      </div>
    </div>
  )
}
