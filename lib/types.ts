/** World Happy News 用の型定義 */

export type NewsGenre = "動物" | "親切" | "ユーモア" | "文化" | "コミュニティ" | "勇気" | "教育" | "人情"

export type GenreColorKey = "amber" | "rose" | "sky" | "emerald" | "orange" | "violet"

/** カテゴリ別のスタイル設定 */
export const GENRE_STYLES: Record<NewsGenre, { color: string; paperStyle: string }> = {
  動物: { color: "bg-amber-200 text-amber-900", paperStyle: "bg-[#f5ead0]" },
  親切: { color: "bg-rose-200 text-rose-900", paperStyle: "bg-[#dce8f0]" },
  ユーモア: { color: "bg-sky-200 text-sky-900", paperStyle: "bg-[#e8f0f5]" },
  文化: { color: "bg-sky-200 text-sky-900", paperStyle: "bg-[#f5ead0]" },
  コミュニティ: { color: "bg-emerald-200 text-emerald-900", paperStyle: "bg-[#e5f0e0]" },
  勇気: { color: "bg-orange-200 text-orange-900", paperStyle: "bg-[#dce8f0]" },
  教育: { color: "bg-violet-200 text-violet-900", paperStyle: "bg-[#e5f0e0]" },
  人情: { color: "bg-rose-200 text-rose-900", paperStyle: "bg-[#dce8f0]" },
}

/** マスキングテープの位置 */
export type TapePosition = "tape-top-left" | "tape-top-right" | "tape-bottom-right"

/** torn edge の種類 */
export type TornEdge = "torn-edge-1" | "torn-edge-2"

/** 回転の種類 */
export type Rotation = "-rotate-1" | "rotate-1" | "rotate-0.5" | "-rotate-0.5" | "rotate-0"

export type HappyNewsArticle = {
  id: string
  title: string
  summary: string /** Geminiが生成した日本語要約（150文字程度） */
  location: string
  country: string
  countryCode: string /** ISO 3166-1 alpha-2 */
  lat: number
  lng: number
  genre: NewsGenre
  genreColor: string
  paperStyle: string
  tapePosition: TapePosition
  tornEdge: TornEdge
  rotation: Rotation
  image: string /** 元記事の画像URL または プレースホルダー */
  url: string /** 元記事へのリンク */
  publishedAt: string
  sourceName: string
  content?: string /** 元記事の原文 */
  contentTranslated?: string /** 元記事を充実に日本語翻訳した全文 */
}
