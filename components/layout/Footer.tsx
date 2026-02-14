import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-6">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; 2026 旅プラン</p>
        <nav className="flex items-center gap-6">
          <Link href="#" className="hover:text-foreground transition-colors">
            利用規約
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            プライバシーポリシー
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            お問い合わせ
          </Link>
        </nav>
      </div>
    </footer>
  );
}
