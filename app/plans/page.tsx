import { prisma } from "@/lib/db";
import { SearchForm } from "@/components/plan/SearchForm";
import { PlanCard } from "@/components/plan/PlanCard";
import { MapPin, Calendar, Compass } from "lucide-react";
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
        <div className="mb-6 flex flex-wrap gap-2">
          {destination && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              <MapPin className="h-3.5 w-3.5" />
              旅行先「{destination}」
            </span>
          )}
          {days && days !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {days}日間
            </span>
          )}
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
          <div className="text-center py-16 text-muted-foreground">
            <Compass className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-lg font-medium mb-1">条件に一致するプランが見つかりませんでした</p>
            <p className="text-sm">別の条件で検索してみましょう</p>
          </div>
        )}
      </section>
    </div>
  );
}
