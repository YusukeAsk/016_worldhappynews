# Supabase セットアップガイド

World Happy News で記事のDB保存とコメント機能を有効にするための手順です。

---

## ステップ 1: Supabase プロジェクトを作成

1. [supabase.com](https://supabase.com) にアクセス
2. 「Start your project」でサインアップ（GitHub 連携可）
3. ダッシュボードで「New Project」をクリック
4. 以下を設定して「Create new project」を押す
   - **Name**: `world-happy-news`（任意）
   - **Database Password**: 強力なパスワードを設定（保存しておく）
   - **Region**: 日本に近い `Northeast Asia (Tokyo)` を推奨

---

## ステップ 2: テーブルを作成

1. 左メニューから **SQL Editor** を開く
2. 「New query」をクリック
3. 以下のSQLを貼り付けて **Run** を実行

```sql
-- 記事テーブル
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  location TEXT,
  country TEXT,
  country_code TEXT,
  lat FLOAT,
  lng FLOAT,
  genre TEXT,
  genre_color TEXT,
  paper_style TEXT,
  tape_position TEXT,
  torn_edge TEXT,
  rotation TEXT,
  image TEXT,
  url TEXT,
  published_at TIMESTAMPTZ,
  source_name TEXT,
  content TEXT,
  content_translated TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- コメントテーブル
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);

-- RLS: 記事は全員が読み取り可能
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Articles are viewable by everyone" ON articles FOR SELECT USING (true);

-- RLS: コメントは全員が読み取り・投稿可能
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON comments FOR INSERT WITH CHECK (true);
```

4. 「Success. No rows returned」と表示されればOK

---

## ステップ 3: API キーを取得

1. 左メニューから **Project Settings**（歯車アイコン）を開く
2. **API** を選択
3. 以下をコピーしておく
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: クライアント用キー
   - **service_role**: サーバー用キー（機密・絶対に公開しない）

---

## ステップ 4: 環境変数を設定

1. プロジェクトルートの `.env.local` を開く（なければ `.env.example` をコピーして作成）
2. 以下を追加

```env
# Supabase（SUPABASE_SETUP.md を参照）
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon public
- `SUPABASE_SERVICE_ROLE_KEY` → service_role（Vercel デプロイ時も必須）

---

## ステップ 5: Vercel に環境変数を登録（本番デプロイ時）

1. [Vercel Dashboard](https://vercel.com/dashboard) → プロジェクト選択
2. **Settings** → **Environment Variables**
3. 以下を登録
   - Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - 定期取得: `CRON_SECRET`（`openssl rand -hex 32` で生成。Vercel Cron の認証用）
   - ニュース取得: `GNEWS_API_KEY` または `NEWS_API_KEY`, `GEMINI_API_KEY`

---

## 定期ニュース取得（Vercel Cron）

7:00 / 12:00 / 19:00（JST）に `/api/cron/fetch-news` が実行され、条件に合う記事をDBへ登録します。

- **最低1日1件**: その日に1件も登録されていない場合は、19時の実行時に検索条件を緩めて近しい記事を1件登録します。
- **CRON_SECRET**: Vercel の環境変数に設定すると、Vercel が自動で Authorization ヘッダーに含めてリクエストします。設定していないと 401 になります。

---

## 動作確認

1. `pnpm dev` で開発サーバーを起動
2. トップページを開く → 記事がDBから取得され、不足分はGNews/Geminiで取得してDB保存される
3. 記事詳細を開く → コメント欄が表示される
4. 名前とコメントを入力して投稿 → DBに保存され、一覧に表示される

---

## トラブルシューティング

| 現象 | 確認すること |
|------|--------------|
| 記事が表示されない | `.env.local` に Supabase の環境変数が正しく設定されているか |
| コメントが投稿できない | RLS ポリシーが正しく作成されているか（SQL Editor で再実行） |
| Vercel でエラー | Vercel の環境変数に `SUPABASE_SERVICE_ROLE_KEY` が設定されているか |
