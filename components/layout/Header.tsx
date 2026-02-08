"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          旅プラン
        </Link>

        <nav className="flex items-center gap-4">
          {isPending ? (
            <span className="text-sm text-muted-foreground">読み込み中...</span>
          ) : session ? (
            <>
              <Link href="/plans/new">
                <Button variant="outline" size="sm">
                  投稿する
                </Button>
              </Link>
              <Link href="/mypage">
                <Button variant="ghost" size="sm">
                  マイページ
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                ログアウト
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">ログイン</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
