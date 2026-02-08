import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { PlanListItem } from "@/types/plan";

interface PlanCardProps {
  plan: PlanListItem;
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Link href={`/plans/${plan.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-video bg-muted relative">
          {plan.thumbnailUrl ? (
            <img
              src={plan.thumbnailUrl}
              alt={plan.destination}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {plan.destination}
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{plan.days}日間</span>
            <span>♡ {plan._count.likes}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            by {plan.author.name}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
