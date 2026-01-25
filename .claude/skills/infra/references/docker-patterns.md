# Docker構成パターン

## 目次

1. [概要](#概要)
2. [パターン1: devのみDocker](#パターン1-devのみdocker)
3. [パターン2: dev/prod共にDocker](#パターン2-devprod共にdocker)
4. [パターン3: Docker最小限](#パターン3-docker最小限)
5. [Vercelとの役割分担](#vercelとの役割分担)

---

## 概要

Next.js + Vercel環境でのDocker活用パターンを整理する。
詳細なDockerfile記述は禁止のため、構成方針のみを示す。

## パターン1: devのみDocker

**推奨ケース:** 個人開発 + 本番想定

```
開発環境:
  └── Docker Compose
      ├── app (Next.js)
      ├── db (PostgreSQL等)
      └── その他サービス

本番環境:
  └── Vercel (Next.jsのみ)
      └── 外部DB (Supabase, PlanetScale等)
```

**メリット:**
- ローカルで本番に近い環境を再現
- Vercelの無料枠を最大活用
- 運用負担が少ない

**デメリット:**
- dev/prodで微妙な差異が残る可能性

## パターン2: dev/prod共にDocker

**推奨ケース:** チーム開発 / 厳密な環境一致が必要

```
開発環境:
  └── Docker Compose
      ├── app
      ├── db
      └── その他

本番環境:
  └── Docker (AWS ECS, Cloud Run等)
      ├── app
      └── 外部DB接続
```

**メリット:**
- 完全な環境一致
- 移植性が高い

**デメリット:**
- Vercelの恩恵を受けられない
- 運用コスト増加

## パターン3: Docker最小限

**推奨ケース:** MVPフェーズ / 素早く動かしたい

```
開発環境:
  └── ローカル直接実行 (npm run dev)
      └── 外部サービス接続

本番環境:
  └── Vercel
```

**メリット:**
- 立ち上げが最速
- 学習コストなし

**デメリット:**
- 環境差異が大きくなりやすい
- 複数サービス連携時に不便

## Vercelとの役割分担

| 責務 | 開発環境 | 本番環境 |
|------|----------|----------|
| アプリ実行 | Docker or ローカル | Vercel |
| DB | Docker or 外部 | 外部サービス |
| 環境変数 | .env.local | Vercel Dashboard |
| ビルド | ローカル | Vercel自動 |

**重要:** Vercelは「デプロイ先」として割り切り、ローカルでの再現性はDockerで担保する。
