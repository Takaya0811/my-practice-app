---
name: auth
description: |
  認証・認可方式の選定と設計判断を行う専用SKILL。
  Next.js + Vercel + Docker 環境において、BetterAuth / Supabase Auth の使い分けを一貫した基準で判断する。

  使用タイミング:
  - 認証方式の選定が必要なとき
  - セッション管理・トークン管理の方針を決めるとき
  - BetterAuth と Supabase Auth のどちらを採用するか判断するとき
  - 認証周りの設計レビューを行うとき
---

# Auth SKILL

認証・認可に関する判断と設計のみを担当するSKILL。

## 役割

認証周りの設計が場当たり的にならないよう、一貫した基準で判断を行う。

## 技術前提（固定）

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js（App Router） |
| デプロイ | Vercel |
| 認証候補 | BetterAuth / Supabase Auth |
| コンテナ | Docker（dev / prod 併用） |

## やってよいこと

- 認証方式の比較（BetterAuth / Supabase Auth）
- セッション管理・トークン管理の方針提示
- Vercel 環境での相性評価
- Docker 利用時の注意点（概念レベル）
- 実装する / しない の判断

## やってはいけないこと

- フロントエンドUIの実装詳細
- Dockerfile / compose の具体的記述
- DBの物理設計（users テーブル定義など）
- 他SKILL（DB / Front / Infra）の判断を上書きすること
- any / unknown 型の使用
- 型ガード関数の使用
- コード全文の提示（設計と手順まで）

## 判断基準（優先順位）

1. 本番環境での安全性・保守性
2. Vercel との親和性
3. 将来の拡張（OAuth追加など）のしやすさ
4. 個人開発における実装コスト

## 判断ガイド

```
Supabase を DB として使う場合
  → 原則：Supabase Auth を推奨

Vercel + 軽量構成 + 将来 OAuth 拡張
  → 原則：BetterAuth を推奨

Auth を MVP では最小にしたい場合
  → メール + パスワードのみから開始してよい
```

## 入力情報

Orchestrator から以下の情報を受け取る:

- 開発フェーズ（設計 / 実装 / 改修）
- 個人開発 or 商用想定
- OAuth 利用予定の有無
- DB の利用有無（Supabase DB を使うか否か）

## 出力形式

必ず以下を返す:

1. **採用する認証方式**（BetterAuth or Supabase Auth）
2. **その理由**（文章で明確に）
3. **実装タイミング**（今すぐ / 後回し）
4. **実装する場合の手順レベルの説明**

## 判断に迷う場合

Orchestrator へ差し戻しを提案する。他SKILLの領域に踏み込まない。

## 詳細リファレンス

- [BetterAuth詳細](references/betterauth.md) - BetterAuthの特徴と採用基準
- [Supabase Auth詳細](references/supabase-auth.md) - Supabase Authの特徴と採用基準
