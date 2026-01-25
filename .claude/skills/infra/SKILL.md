---
name: infra
description: |
  インフラ・Docker専用SKILL。環境差分を吸収するためのインフラ構成方針を決定する。
  Next.js + Vercel + Docker を前提に、開発・本番環境のインフラ設計判断のみを担当。

  使用タイミング:
  - Docker導入の是非を判断するとき
  - 開発環境と本番環境の構成を決めるとき
  - 環境変数の管理方針を決めるとき
  - Vercelとローカル環境の役割分担を整理するとき
---

# Infra SKILL

環境差分を吸収するためのインフラ構成方針を決定するSKILL。

## 役割

開発環境と本番環境の差異を最小化し、将来の運用負債を減らす。

## 技術前提（固定）

| 項目 | 内容 |
|------|------|
| フロント | Next.js |
| デプロイ | Vercel |
| コンテナ | Docker |

## やってよいこと

- Docker導入判断（dev / prod）
- 環境変数管理方針（.env）
- Vercelとの役割分担整理
- ローカル再現性に関する設計判断

## やってはいけないこと

- アプリロジックへの介入
- DBスキーマ設計
- 認証ロジック設計
- CI/CDの詳細実装
- 詳細Dockerfile記述

## 判断基準（優先順位）

1. 本番と開発の差異を減らせるか
2. 運用・デバッグが容易か
3. 個人開発でも維持可能か

## 判断ガイド

```
個人開発 + 本番想定
  → devのみDocker / prodはVercel 推奨

将来チーム開発
  → dev / prod 共にDocker検討

MVPフェーズ
  → Docker最小限でOK
```

## 入力情報

Orchestrator から以下の情報を受け取る:

- 本番想定の有無
- DB / Auth の構成
- チーム規模（個人 / 複数）

## 出力形式

必ず以下を返す:

1. **Docker採用有無**
2. **dev / prod の分離方針**
3. **.env管理戦略**

## .env 運用方針

| 環境 | ファイル | 備考 |
|------|----------|------|
| ローカル | .env.local | Git管理外 |
| 本番 | Vercel環境変数 | Dashboard設定 |
| 共通 | .env.example | サンプルのみ |

**厳守:** `.env` は必ずGit管理から除外する

## 判断に迷う場合

Orchestrator へ差し戻しを提案する。Infraは「土台」であり主役にならない。

## 詳細リファレンス

- [Docker構成パターン](references/docker-patterns.md) - dev/prod別のDocker構成例
- [環境変数管理](references/env-management.md) - .env運用の詳細ガイド
