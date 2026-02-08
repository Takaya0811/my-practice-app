# 旅プラン - 開発まとめ

> **旅の思い出を、次の誰かの冒険に変えるサービス**

## 概要

旅行プラン共有サービスのMVP実装。ユーザーが旅行プランを投稿・検索・保存できる。

---

## 技術スタック

| 項目 | 採用技術 |
|------|----------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript (strict mode) |
| UI | shadcn/ui |
| CSS | Tailwind CSS v4 |
| ORM | Prisma 6.19.2 |
| DB | Supabase (PostgreSQL) |
| 認証 | BetterAuth 1.4.18 |
| 画像保存 | Supabase Storage |

---

## 開発タスクと実装内容

### Task #1: 環境構築

**実施内容:**
- ローカルSupabase起動（ポート54331系列に変更）
- `.env.local` に環境変数設定
- Prismaマイグレーション実行

**作成/変更ファイル:**
- `supabase/config.toml` - ポート設定変更
- `.env.local` - 環境変数

**トラブルシューティング:**
- Prisma 7のAPIが変更されていたため、Prisma 6.19.2にダウングレード
- Supabaseのポート競合を解消（54322→54332等）

---

### Task #2: BetterAuth導入

**実施内容:**
- BetterAuth設定ファイル作成
- 認証APIルート作成
- クライアント側auth設定

**作成ファイル:**
```
lib/
├── auth.ts          # サーバー側認証設定
├── auth-client.ts   # クライアント側認証設定
└── db.ts            # Prismaクライアント

app/api/auth/[...all]/route.ts  # 認証APIハンドラー
```

**Prismaスキーマ（BetterAuth標準テーブル）:**
- `user` - ユーザー情報
- `session` - セッション管理
- `account` - 認証プロバイダ情報
- `verification` - メール確認トークン

---

### Task #3: プラン投稿機能

**実施内容:**
- プランCRUD API作成
- サムネイルアップロードAPI作成
- Supabase Storageバケット設定
- プラン投稿画面（STEP1: 基本情報 → STEP2: 日程入力）
- ログイン画面

**作成ファイル:**
```
app/
├── api/
│   ├── plans/route.ts           # GET/POST プラン一覧・作成
│   └── upload/thumbnail/route.ts # サムネイルアップロード
├── plans/new/page.tsx           # プラン投稿画面
└── login/page.tsx               # ログイン/新規登録画面

lib/supabase.ts                  # Supabaseクライアント
types/plan.ts                    # 型定義
```

**Supabase Storage設定:**
```toml
[storage.buckets.plan-thumbnails]
public = true
file_size_limit = "2MiB"
allowed_mime_types = ["image/png", "image/jpeg"]
```

---

### Task #4: プラン一覧・検索機能

**実施内容:**
- トップページ改修（検索フォーム + 新着プラン）
- 検索結果ページ作成
- 共通ヘッダー作成
- プランカードコンポーネント作成

**作成ファイル:**
```
components/
├── layout/Header.tsx        # 共通ヘッダー
└── plan/
    ├── PlanCard.tsx         # プランカード
    └── SearchForm.tsx       # 検索フォーム

app/
├── page.tsx                 # トップページ
└── plans/page.tsx           # 検索結果ページ
```

---

### Task #5: プラン詳細画面

**実施内容:**
- プラン詳細ページ改良
- 日程折りたたみ機能
- いいね/保存ボタン（UI）

**作成ファイル:**
```
components/plan/
├── DaySchedule.tsx          # 日程表示（折りたたみ）
└── PlanActions.tsx          # いいね/保存ボタン

app/plans/[id]/page.tsx      # プラン詳細ページ
```

---

### Task #6: ブックマーク・いいね機能

**実施内容:**
- いいねAPI作成
- ブックマークAPI作成

**作成ファイル:**
```
app/api/plans/[planId]/
├── like/route.ts            # POST/DELETE いいね
└── bookmark/route.ts        # POST/DELETE 保存
```

---

### Task #7: マイページ

**実施内容:**
- 自分の投稿一覧API
- 保存したプラン一覧API
- マイページUI（タブ切り替え）

**作成ファイル:**
```
app/
├── api/me/
│   ├── plans/route.ts       # 自分の投稿一覧
│   └── bookmarks/route.ts   # 保存したプラン一覧
└── mypage/page.tsx          # マイページ
```

---

## 最終的なディレクトリ構成

```
my-practice-app/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts
│   │   ├── me/
│   │   │   ├── bookmarks/route.ts
│   │   │   └── plans/route.ts
│   │   ├── plans/
│   │   │   ├── route.ts
│   │   │   └── [planId]/
│   │   │       ├── bookmark/route.ts
│   │   │       └── like/route.ts
│   │   └── upload/thumbnail/route.ts
│   ├── login/page.tsx
│   ├── mypage/page.tsx
│   ├── plans/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/Header.tsx
│   ├── plan/
│   │   ├── DaySchedule.tsx
│   │   ├── PlanActions.tsx
│   │   ├── PlanCard.tsx
│   │   └── SearchForm.tsx
│   └── ui/  # shadcn/ui
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── db.ts
│   ├── supabase.ts
│   └── utils.ts
├── types/
│   └── plan.ts
├── prisma/
│   └── schema.prisma
└── supabase/
    ├── config.toml
    └── seed.sql
```

---

## API一覧

### 認証（BetterAuth）

| エンドポイント | 説明 |
|--------------|------|
| `POST /api/auth/sign-up/email` | 新規登録 |
| `POST /api/auth/sign-in/email` | ログイン |
| `POST /api/auth/sign-out` | ログアウト |
| `GET /api/auth/get-session` | セッション取得 |

### プラン

| エンドポイント | メソッド | 認証 | 説明 |
|--------------|---------|------|------|
| `/api/plans` | GET | 不要 | プラン一覧（検索可） |
| `/api/plans` | POST | 必須 | プラン作成 |
| `/api/plans/[planId]/like` | POST | 必須 | いいね追加 |
| `/api/plans/[planId]/like` | DELETE | 必須 | いいね取消 |
| `/api/plans/[planId]/bookmark` | POST | 必須 | 保存追加 |
| `/api/plans/[planId]/bookmark` | DELETE | 必須 | 保存取消 |

### マイページ

| エンドポイント | メソッド | 認証 | 説明 |
|--------------|---------|------|------|
| `/api/me/plans` | GET | 必須 | 自分の投稿一覧 |
| `/api/me/bookmarks` | GET | 必須 | 保存したプラン一覧 |

### 画像

| エンドポイント | メソッド | 認証 | 説明 |
|--------------|---------|------|------|
| `/api/upload/thumbnail` | POST | 必須 | サムネイルアップロード |

---

## DBスキーマ

```
BetterAuth管理
  user ── session
  user ── account
           verification

アプリ固有
  user ─┬──< plan ──< day ──< spot
        ├──< bookmark (user × plan)
        └──< like     (user × plan)
```

---

## 起動方法

```bash
# 1. Supabase起動
supabase start

# 2. 環境変数確認
cat .env.local

# 3. Prismaマイグレーション
export $(grep -v '^#' .env.local | xargs) && npx prisma migrate dev

# 4. 開発サーバー起動
npm run dev
```

→ http://localhost:3000

---

## 今後の拡張（Phase 2以降）

- 人気順ランキング
- 細かい条件検索（予算、スタイル等）
- プランコピー・編集機能
- スポット写真対応
- コメント機能
- フォロー機能
- 通知機能
