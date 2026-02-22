import { createHash } from "crypto"
import { GoogleGenAI } from "@google/genai"
import {
  type HappyNewsArticle,
  type NewsGenre,
  type TapePosition,
  type TornEdge,
  type Rotation,
  GENRE_STYLES,
} from "./types"
import { getCountryCoords } from "./countries"
import { translateArticleContent } from "./news-translate"

/** GNews API のレスポンス型 */
type GNewsArticle = {
  title: string
  description: string | null
  content: string | null
  url: string
  image: string | null
  publishedAt: string
  source: { name: string; url?: string }
}

type GNewsResponse = {
  articles?: GNewsArticle[]
  totalArticles?: number
}

/** 一意のIDを生成（URLをSHA-256でハッシュ、異なるURL同士で衝突しないようにする） */
function generateId(url: string): string {
  return createHash("sha256").update(url).digest("base64url").slice(0, 43)
}

/** 政治・経済・国際紛争系の記事を除外（タイトル・ソース名ベース） */
function isLikelyPoliticsOrEconomy(article: GNewsArticle): boolean {
  const text = `${article.title} ${article.description ?? ""} ${article.source.name}`.toLowerCase()
  const excludeTerms = [
    "election", "politic", "congress", "senate", "parliament", "minister", "president", "trump", "biden", "vote", "ballot",
    "stock", "market", "economy", "recession", "gdp", "inflation", "fed ", "federal reserve", "interest rate", "trading", "wall street",
    "war", "military", "nato", "invasion", "attack", "troops", "defense", "weapon",
    "reuters", "bloomberg", "politico", "financial times", "wsj", "wall street journal", "cnbc", "business insider",
  ]
  return excludeTerms.some((term) => text.includes(term))
}

/** GNews API からニュースを取得（ローカル・地域・ハッピー系に絞り、政治・経済は除外） */
export async function fetchFromGNews(max = 20): Promise<GNewsArticle[]> {
  const key = process.env.GNEWS_API_KEY || process.env.NEWS_API_KEY
  if (!key) {
    console.warn("[news] No GNEWS_API_KEY or NEWS_API_KEY - using fallback mock")
    return getFallbackArticles()
  }

  // 検索クエリ: 地域・ローカル・コミュニティ・温かいニュース重視。政治・経済は - で除外（GNewsは Boolean 対応）
  const excludeSuffix = " -politics -election -economy -stock -recession -war -trump -biden -congress -senate"
  const queries = [
    "local news community good news" + excludeSuffix,
    "regional newspaper heartwarming" + excludeSuffix,
    "small town volunteer kindness" + excludeSuffix,
    "community volunteer animal rescue" + excludeSuffix,
    "local business charity neighborhood" + excludeSuffix,
    "good news today uplifting" + excludeSuffix,
  ]
  const allArticles: GNewsArticle[] = []
  const seenUrls = new Set<string>()

  for (const q of queries) {
    const url = new URL("https://gnews.io/api/v4/search")
    url.searchParams.set("q", q.trim())
    url.searchParams.set("lang", "en")
    url.searchParams.set("max", String(Math.min(10, max)))
    url.searchParams.set("apikey", key)

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      console.warn(`[news] GNews API error: ${res.status}`, body ? body.slice(0, 200) : "")
      continue
    }
    const data = (await res.json()) as GNewsResponse
    for (const a of data.articles ?? []) {
      if (!a.url || seenUrls.has(a.url) || !(a.title || a.description)) continue
      if (isLikelyPoliticsOrEconomy(a)) continue
      seenUrls.add(a.url)
      allArticles.push(a)
    }
    if (allArticles.length >= max) break
  }

  return allArticles.slice(0, max)
}

/** NewsAPI.org からニュースを取得（政治・経済を避け、エンタメ・健康・科学・スポーツなどローカルに多いカテゴリを優先） */
export async function fetchFromNewsAPI(max = 20): Promise<GNewsArticle[]> {
  const key = process.env.NEWS_API_KEY
  if (!key) return []

  // business は使わない。general は政治混じりなので、ハッピー寄りのカテゴリのみ
  const categories = ["entertainment", "health", "science", "sports"] as const
  const countries = ["us", "gb", "jp", "au", "de", "fr", "ca", "in"]
  const all: GNewsArticle[] = []
  const seen = new Set<string>()

  for (const c of countries) {
    for (const cat of categories) {
      const url = new URL("https://newsapi.org/v2/top-headlines")
      url.searchParams.set("country", c)
      url.searchParams.set("category", cat)
      url.searchParams.set("pageSize", "5")
      url.searchParams.set("apiKey", key)

      const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
      if (!res.ok) continue
      const data = (await res.json()) as { articles?: Array<{
        title: string
        description: string | null
        content: string | null
        url: string
        urlToImage: string | null
        publishedAt: string
        source: { name: string }
      }> }
      for (const a of data.articles ?? []) {
        if (!a.url || seen.has(a.url)) continue
        const mapped = {
          title: a.title,
          description: a.description ?? null,
          content: a.content ?? null,
          url: a.url,
          image: a.urlToImage ?? null,
          publishedAt: a.publishedAt,
          source: { name: a.source.name },
        }
        if (isLikelyPoliticsOrEconomy(mapped)) continue
        seen.add(a.url)
        all.push(mapped)
      }
      if (all.length >= max) break
    }
    if (all.length >= max) break
  }
  return all.slice(0, max)
}

/** ニュースを取得（GNews優先、なければNewsAPI） */
async function fetchRawArticles(max = 20): Promise<GNewsArticle[]> {
  if (process.env.GNEWS_API_KEY) return fetchFromGNews(max)
  if (process.env.NEWS_API_KEY) return fetchFromNewsAPI(max)
  return getFallbackArticles()
}

/** APIキーがない場合のフォールバック（既存のnews-dataベース） */
function getFallbackArticles(): GNewsArticle[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { newsArticles } = require("./news-data") as {
    newsArticles: Array<{ id: number; title: string; summary: string; image: string; country: string }>
  }
  const placeholder =
    "https://placehold.co/400x300/f5ead0/8b7355?text=World+Happy+News"
  return newsArticles.map((a) => ({
    title: a.title,
    description: a.summary,
    content: a.summary,
    url: `https://worldhappynews.example/news/${a.id}`,
    image: a.image?.startsWith("http") ? a.image : placeholder,
    publishedAt: new Date().toISOString(),
    source: { name: "World Happy News", url: "" },
  }))
}

/** Gemini API でハッピーフィルター & 日本語要約 */
async function filterAndSummarizeWithGemini(
  articles: GNewsArticle[]
): Promise<Array<{ index: number; summary: string; genre: NewsGenre; isHappy: boolean }>> {
  const key = process.env.GEMINI_API_KEY
  if (!key || articles.length === 0) {
    return articles.map((_, i) => ({
      index: i,
      summary: articles[i].description ?? articles[i].title ?? "",
      genre: "親切" as NewsGenre,
      isHappy: true,
    }))
  }

  const ai = new GoogleGenAI({ apiKey: key })
  const results: Array<{ index: number; summary: string; genre: NewsGenre; isHappy: boolean }> = []

  const genreChoices: NewsGenre[] = ["動物", "親切", "ユーモア", "文化", "コミュニティ", "勇気", "教育", "人情"]

  const prompt = `You are a curator for "World Happy News" - a site that only shows heartwarming, funny, or inspiring news from local/regional stories (not national politics or economy).

Rules:
- REJECT articles that are mainly about: politics, elections, government, economy, stock market, business/finance, war, conflict, crime, scandals. Prefer local news, community stories, small businesses, regional newspapers, human interest.
- For each item, decide: Is it "happy" (heartwarming, funny, inspiring, positive) AND not politics/economy? YES or NO.
- If YES: Write a Japanese summary in about 150 characters, emotional and warm. Choose ONE category: 動物, 親切, ユーモア, 文化, コミュニティ, 勇気, 教育, 人情
- If NO (including politics/economy/national conflict): set isHappy to false.

Format your response as JSON array. Each item: {"index": 0, "isHappy": true/false, "summary": "日本語要約", "genre": "カテゴリ"}
If isHappy is false, summary can be empty and genre can be "親切".

News items (index, title, description):
${articles
  .map(
    (a, i) =>
      `[${i}] Title: ${a.title}\nDescription: ${a.description ?? "(none)"}\nContent: ${(a.content ?? "").slice(0, 200)}`
  )
  .join("\n\n")}

Respond ONLY with the JSON array, no other text.`

  try {
    const resp = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    })
    const text = resp.text?.trim() ?? "[]"
    const jsonStr = text.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim()
    const parsed = JSON.parse(jsonStr) as Array<{
      index: number
      isHappy: boolean
      summary: string
      genre: NewsGenre
    }>
    for (const p of parsed) {
      results.push({
        index: p.index,
        summary: p.summary || articles[p.index]?.description || articles[p.index]?.title || "",
        genre: genreChoices.includes(p.genre) ? p.genre : "親切",
        isHappy: p.isHappy !== false,
      })
    }
  } catch (e) {
    console.warn("[news] Gemini API error:", e)
    return articles.map((a, i) => ({
      index: i,
      summary: a.description ?? a.title,
      genre: "親切" as NewsGenre,
      isHappy: true,
    }))
  }

  return results
}

/** 国名をソースから推測（簡易） */
function inferCountry(article: GNewsArticle): { country: string; countryCode: string; location: string } {
  const name = article.source.name?.toLowerCase() ?? ""
  const title = (article.title + " " + (article.description ?? "")).toLowerCase()
  const mappings: Array<[RegExp, string, string]> = [
    [/bbc|uk|britain|british|reuters.*uk/i, "gb", "イギリス"],
    [/cnn|nbc|abc|fox|ap news|usa today|american/i, "us", "アメリカ"],
    [/japan|nhk|asahi|yomiuri|mainichi|nikkei/i, "jp", "日本"],
    [/australia|abc.*au|sbs/i, "au", "オーストラリア"],
    [/canada|canadian|cbc|ctv/i, "ca", "カナダ"],
    [/germany|german|dw|spiegel/i, "de", "ドイツ"],
    [/france|french|le monde|le figaro/i, "fr", "フランス"],
    [/italy|italian|ansa|corriere/i, "it", "イタリア"],
    [/india|indian|times of india|hindustan/i, "in", "インド"],
    [/china|chinese|xinhua|scmp/i, "cn", "中国"],
    [/korea|korean|chosun|korean/i, "kr", "韓国"],
    [/brazil|brazilian|globo/i, "br", "ブラジル"],
    [/netherlands|dutch|dutch/i, "nl", "オランダ"],
    [/kenya|nairobi/i, "ke", "ケニア"],
    [/thailand|thai|bangkok/i, "th", "タイ"],
  ]
  for (const [re, code, country] of mappings) {
    if (re.test(name) || re.test(title))
      return { country, countryCode: code, location: country }
  }
  return { country: "世界", countryCode: "xx", location: "世界各地" }
}

const TAPE_POSITIONS: TapePosition[] = ["tape-top-left", "tape-top-right", "tape-bottom-right"]
const TORN_EDGES: TornEdge[] = ["torn-edge-1", "torn-edge-2"]
const ROTATIONS: Rotation[] = ["-rotate-1", "rotate-1", "rotate-0.5", "-rotate-0.5", "rotate-0"]

/** World Happy News の記事一覧を取得 */
export async function getHappyNews(max = 12): Promise<HappyNewsArticle[]> {
  const raw = await fetchRawArticles(max)
  const geminiResults = await filterAndSummarizeWithGemini(raw)

  const out: HappyNewsArticle[] = []
  for (let i = 0; i < raw.length; i++) {
    const r = geminiResults.find((x) => x.index === i) ?? geminiResults[i]
    if (!r?.isHappy) continue

    const article = raw[i]
    const { country, countryCode, location } = inferCountry(article)
    const coords = getCountryCoords(countryCode, country)
    const style = GENRE_STYLES[r.genre]
    const id = generateId(article.url)

    out.push({
      id,
      title: article.title,
      summary: r.summary,
      location,
      country: coords.name,
      countryCode,
      lat: coords.lat,
      lng: coords.lng,
      genre: r.genre,
      genreColor: style.color,
      paperStyle: style.paperStyle,
      tapePosition: TAPE_POSITIONS[i % TAPE_POSITIONS.length],
      tornEdge: TORN_EDGES[i % TORN_EDGES.length],
      rotation: ROTATIONS[i % ROTATIONS.length],
      image:
        article.image ??
        `https://placehold.co/400x300/f5ead0/8b7355?text=World+Happy+News`,
      url: article.url,
      publishedAt: article.publishedAt,
      sourceName: article.source.name,
      content: article.content ?? article.description ?? undefined,
    })
  }
  return out
}

/** 緩和モード: 政治・経済除外のみで1件取得（1日1件確保用。Geminiのハッピー判定は行わない） */
export async function getHappyNewsRelaxed(max = 1): Promise<HappyNewsArticle[]> {
  const raw = await fetchRawArticles(Math.max(10, max))
  const style = GENRE_STYLES["親切"]
  const out: HappyNewsArticle[] = []

  for (let i = 0; i < Math.min(raw.length, max); i++) {
    const article = raw[i]
    const { country, countryCode, location } = inferCountry(article)
    const coords = getCountryCoords(countryCode, country)
    const id = generateId(article.url)

    out.push({
      id,
      title: article.title,
      summary: article.description ?? article.title ?? "",
      location,
      country: coords.name,
      countryCode,
      lat: coords.lat,
      lng: coords.lng,
      genre: "親切",
      genreColor: style.color,
      paperStyle: style.paperStyle,
      tapePosition: TAPE_POSITIONS[i % TAPE_POSITIONS.length],
      tornEdge: TORN_EDGES[i % TORN_EDGES.length],
      rotation: ROTATIONS[i % ROTATIONS.length],
      image:
        article.image ??
        `https://placehold.co/400x300/f5ead0/8b7355?text=World+Happy+News`,
      url: article.url,
      publishedAt: article.publishedAt,
      sourceName: article.source.name,
      content: article.content ?? article.description ?? undefined,
    })
  }
  return out
}

/** IDで1件取得（一覧から検索）。詳細表示用に元記事を日本語全文翻訳 */
export async function getHappyNewsById(id: string): Promise<HappyNewsArticle | null> {
  const list = await getHappyNews(30)
  const article = list.find((a) => a.id === id) ?? null
  if (!article) return null

  const rawBody = article.content?.trim()
  if (rawBody && !article.contentTranslated) {
    const translated = await translateArticleContent(article.title, rawBody)
    return { ...article, contentTranslated: translated || undefined }
  }
  return article
}
