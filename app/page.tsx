import { prisma } from "@/lib/db";
import { SearchForm } from "@/components/plan/SearchForm";
import { PlanCard } from "@/components/plan/PlanCard";
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
    <div className="container mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <section className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          旅の思い出を、次の誰かの冒険に
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          実際に旅した人のプランを参考に、あなたの旅行計画を立てましょう。
          旅行先と日数で検索して、ぴったりのプランを見つけてください。
        </p>
      </section>

      {/* 検索フォーム */}
      <section className="max-w-2xl mx-auto mb-12">
        <SearchForm />
      </section>

      {/* おすすめプラン */}
      <section>
        <h2 className="text-xl font-semibold mb-6">新着プラン</h2>
        {plans.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            まだプランが投稿されていません
          </div>
        )}
      </section>
    </div>
  );
}
