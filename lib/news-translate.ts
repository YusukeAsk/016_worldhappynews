import { GoogleGenAI } from "@google/genai"

/** 元記事の全文を読みやすい日本語に翻訳（要約せず充実に翻訳） */
export async function translateArticleContent(
  rawTitle: string,
  rawBody: string
): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key || !rawBody?.trim()) return ""

  const ai = new GoogleGenAI({ apiKey: key })
  const prompt = `あなたは新聞記事の翻訳者です。以下の英語のニュース記事を、読みやすく自然な日本語に翻訳してください。

【ルール】
- 要約や短縮はせず、元の内容をそのまま漏れなく翻訳してください
- 文字数を減らさず、報道内容を充実に伝えてください
- 日本語として自然で読みやすい文体にしてください
- 段落分けや改行は元記事の構造に合わせてください

【元記事のタイトル】
${rawTitle}

【元記事の本文】
${rawBody.slice(0, 8000)}

翻訳結果のみを出力してください。他の説明は不要です。`

  try {
    const resp = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    })
    return (resp.text?.trim() ?? "").trim()
  } catch (e) {
    console.warn("[news] Translation error:", e)
    return ""
  }
}
