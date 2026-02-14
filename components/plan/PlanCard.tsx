import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin } from "lucide-react";
import type { PlanListItem } from "@/types/plan";

interface PlanCardProps {
  plan: PlanListItem;
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Link href={`/plans/${plan.id}`}>
      <Card className="overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full group">
        <div className="aspect-video bg-muted relative">
          {plan.thumbnailUrl ? (
            <img
              src={plan.thumbnailUrl}
              alt={plan.destination}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
              <MapPin className="h-8 w-8 mb-1 text-primary/40" />
              <span className="text-sm">No Image</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center bg-primary/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
              {plan.days}日間
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {plan.destination}
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{plan.author.name}</span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {plan._count.likes}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
