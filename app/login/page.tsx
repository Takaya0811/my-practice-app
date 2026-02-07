"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 既にログイン済みの場合はリダイレクト
  if (session && !isPending) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        const result = await signIn.email({
          email,
          password,
        });

        if (result.error) {
          throw new Error(result.error.message || "ログインに失敗しました");
        }
      } else {
        if (!name.trim()) {
          throw new Error("名前を入力してください");
        }

        const result = await signUp.email({
          email,
          password,
          name,
        });

        if (result.error) {
          throw new Error(result.error.message || "登録に失敗しました");
        }
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === "login" ? "ログイン" : "新規登録"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="山田太郎"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="6文字以上"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "処理中..."
                : mode === "login"
                  ? "ログイン"
                  : "登録する"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {mode === "login" ? (
              <p>
                アカウントをお持ちでない方は{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                >
                  新規登録
                </button>
              </p>
            ) : (
              <p>
                既にアカウントをお持ちの方は{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                >
                  ログイン
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
