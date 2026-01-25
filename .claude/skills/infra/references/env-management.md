# 環境変数管理

## 目次

1. [基本方針](#基本方針)
2. [ファイル構成](#ファイル構成)
3. [命名規則](#命名規則)
4. [Vercel環境変数](#vercel環境変数)
5. [Docker環境での扱い](#docker環境での扱い)
6. [セキュリティ注意事項](#セキュリティ注意事項)

---

## 基本方針

1. **秘密情報はGit管理外**
2. **環境ごとに分離**
3. **変数名は意味明確に**

## ファイル構成

```
プロジェクトルート/
├── .env.example      # サンプル（Git管理OK）
├── .env.local        # ローカル用（Git管理外）
├── .env.development  # 開発共通（Git管理外）
├── .env.production   # 本番用（Git管理外、通常使わない）
└── .gitignore        # .env* を除外
```

### .gitignore 設定

```
# 環境変数
.env
.env.local
.env.development
.env.production
.env*.local
```

## 命名規則

**良い例:**
```
DATABASE_URL=...
NEXT_PUBLIC_API_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

**悪い例:**
```
DB=...              # 意味不明
URL=...             # 何のURL?
KEY=...             # 何のキー?
```

**Next.js固有ルール:**
- `NEXT_PUBLIC_` プレフィックス: クライアントに公開される
- プレフィックスなし: サーバーサイドのみ

## Vercel環境変数

| 設定場所 | 用途 |
|----------|------|
| Project Settings > Environment Variables | 本番・プレビュー・開発別に設定 |
| Vercel CLI | ローカルから.env.localを生成可能 |

**環境の種類:**
- Production: 本番デプロイ
- Preview: PRプレビュー
- Development: ローカル開発

## Docker環境での扱い

**docker-compose.yml での参照:**
```yaml
services:
  app:
    env_file:
      - .env.local
```

**重要:** Docker内でも.env.localを参照し、環境変数の二重管理を避ける。

## セキュリティ注意事項

| やること | やらないこと |
|----------|--------------|
| .envをgitignoreに追加 | .envをコミット |
| サンプルは.env.exampleで共有 | 実際の値をexampleに書く |
| 本番キーはVercel管理 | 本番キーをローカルファイルに |
| 定期的にキーをローテーション | 同じキーを使い続ける |

**漏洩時の対応:**
1. 即座にキーを無効化
2. 新しいキーを発行
3. Vercel環境変数を更新
4. ローカル.env.localを更新
