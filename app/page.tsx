import { prisma } from "@/lib/db";
import { SearchForm } from "@/components/plan/SearchForm";
import { PlanCard } from "@/components/plan/PlanCard";
import { Compass } from "lucide-react";
import type { PlanListItem } from "@/types/plan";

async function getRecentPlans(): Promise<PlanListItem[]> {
  const plans = await prisma.plan.findMany({
    select: {
      id: true,
      destination: true,
      days: true,
      thumbnailUrl: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  return plans.map((plan) => ({
    ...plan,
    createdAt: plan.createdAt.toISOString(),
  }));
}

export default async function HomePage() {
  const plans = await getRecentPlans();

  return (
    <div>
      {/* ヒーローセクション（全幅） */}
      <section className="relative h-[420px] sm:h-[480px] flex items-center justify-center overflow-hidden bg-muted">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 text-center text-white px-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            旅の思い出を、次の誰かの冒険に
          </h1>
          <p className="text-white/85 text-lg">
            実際に旅した人のプランを参考に、あなたの旅行計画を立てましょう。
          </p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-12">
        {/* 検索フォーム */}
        <section className="max-w-2xl mx-auto mb-12">
          <SearchForm />
        </section>

        {/* 新着プラン */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            新着プラン
          </h2>
          {plans.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Compass className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-lg font-medium mb-1">まだプランが投稿されていません</p>
              <p className="text-sm">最初のプランを投稿してみましょう</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
