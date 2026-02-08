import { prisma } from "@/lib/db";
import { SearchForm } from "@/components/plan/SearchForm";
import { PlanCard } from "@/components/plan/PlanCard";
import type { PlanListItem } from "@/types/plan";

interface PageProps {
  searchParams: Promise<{ destination?: string; days?: string }>;
}

async function searchPlans(
  destination?: string,
  days?: string
): Promise<PlanListItem[]> {
  const where: { destination?: { contains: string }; days?: number } = {};

  if (destination) {
    where.destination = { contains: destination };
  }

  if (days && days !== "all") {
    const daysNum = parseInt(days, 10);
    if (!isNaN(daysNum)) {
      where.days = daysNum;
    }
  }

  const plans = await prisma.plan.findMany({
    where,
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
    take: 20,
  });

  return plans.map((plan) => ({
    ...plan,
    createdAt: plan.createdAt.toISOString(),
  }));
}

export default async function PlansPage({ searchParams }: PageProps) {
  const { destination, days } = await searchParams;
  const plans = await searchPlans(destination, days);

  const hasFilters = destination || (days && days !== "all");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 検索フォーム */}
      <section className="max-w-2xl mx-auto mb-8">
        <SearchForm initialDestination={destination} initialDays={days} />
      </section>

      {/* 検索条件の表示 */}
      {hasFilters && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            検索条件:
            {destination && <span className="ml-2">旅行先「{destination}」</span>}
            {days && days !== "all" && <span className="ml-2">{days}日間</span>}
          </p>
        </div>
      )}

      {/* 検索結果 */}
      <section>
        <h2 className="text-xl font-semibold mb-6">
          {hasFilters ? `検索結果（${plans.length}件）` : `すべてのプラン（${plans.length}件）`}
        </h2>
        {plans.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            条件に一致するプランが見つかりませんでした
          </div>
        )}
      </section>
    </div>
  );
}
