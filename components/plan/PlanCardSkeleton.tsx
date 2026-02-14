import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PlanCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-3/4 mb-3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}
