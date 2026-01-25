# Supabase Auth 詳細リファレンス

## 目次

1. [概要](#概要)
2. [採用が推奨されるケース](#採用が推奨されるケース)
3. [Vercelとの相性](#vercelとの相性)
4. [セッション管理](#セッション管理)
5. [RLS連携](#rls連携)
6. [Docker環境での注意点](#docker環境での注意点)

---

## 概要

Supabase AuthはSupabaseプラットフォームに統合された認証サービス。Supabase DBを使用する場合、Row Level Security（RLS）との連携が最大の強み。

**特徴:**
- Supabase DBとの統合
- RLSによるデータアクセス制御
- マネージドサービス（運用負担軽減）
- 豊富なOAuthプロバイダ対応済み

## 採用が推奨されるケース

| 条件 | 推奨度 |
|------|--------|
| Supabase DBを使用 | ◎ 強く推奨 |
| RLSでアクセス制御したい | ◎ 強く推奨 |
| 認証の運用負担を減らしたい | ○ 推奨 |
| すぐに動くものが欲しい | ○ 推奨 |

## Vercelとの相性

**良い点:**
- SSR/SSGどちらも対応
- @supabase/ssr パッケージで統合が容易

**注意点:**
- Supabaseへの外部通信が発生
- Edge Functionとの組み合わせ時は設定確認が必要

## セッション管理

**方式:** Supabase管理のセッション

- アクセストークン: Supabaseが管理
- リフレッシュトークン: 自動更新
- Cookieベースのセッション維持

**Next.js App Routerでの注意:**
- Server ComponentsではcreateServerClientを使用
- Client ComponentsではcreateBrowserClientを使用

## RLS連携

Supabase Authの最大の強み。

```
ユーザー認証 → auth.uid() → RLSポリシー → データアクセス制御
```

**メリット:**
- DB層でのアクセス制御
- アプリケーション層のセキュリティ漏れを防止
- 一貫したアクセス制御ロジック

## Docker環境での注意点

**開発環境:**
- supabase CLIでローカル環境構築可能
- `supabase start` でローカルSupabaseが起動

**本番環境:**
- Supabaseはマネージドサービスのため、Docker内にはアプリケーションのみ
- 環境変数でSupabase URLとAPIキーを設定
