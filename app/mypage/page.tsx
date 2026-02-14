"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanCard } from "@/components/plan/PlanCard";
import { User, Bookmark, PenLine, Compass } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanCardSkeleton } from "@/components/plan/PlanCardSkeleton";
import type { PlanListItem } from "@/types/plan";

interface ApiPlanResponse {
  id: string;
  destination: string;
  days: number;
  thumbnailUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  _count: {
    likes: number;
  };
}

export default function MyPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [myPlans, setMyPlans] = useState<PlanListItem[]>([]);
  const [bookmarkedPlans, setBookmarkedPlans] = useState<PlanListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [myPlansRes, bookmarksRes] = await Promise.all([
        fetch("/api/me/plans"),
        fetch("/api/me/bookmarks"),
      ]);

      if (myPlansRes.ok) {
        const data: ApiPlanResponse[] = await myPlansRes.json();
        setMyPlans(data);
      }

      if (bookmarksRes.ok) {
        const data: ApiPlanResponse[] = await bookmarksRes.json();
        setBookmarkedPlans(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div>
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PlanCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
          <User className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">マイページ</h1>
          <p className="text-muted-foreground">{session.user.name}</p>
        </div>
      </div>

      <Tabs defaultValue="bookmarks">
        <TabsList className="mb-6">
          <TabsTrigger value="bookmarks" className="gap-1.5">
            <Bookmark className="h-4 w-4" />
            保存したプラン ({bookmarkedPlans.length})
          </TabsTrigger>
          <TabsTrigger value="my-plans" className="gap-1.5">
            <PenLine className="h-4 w-4" />
            自分の投稿 ({myPlans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <PlanCardSkeleton key={i} />
              ))}
            </div>
          ) : bookmarkedPlans.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarkedPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Bookmark className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-lg font-medium mb-1">保存したプランはありません</p>
              <p className="text-sm">気になるプランを保存してみましょう</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-plans">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <PlanCardSkeleton key={i} />
              ))}
            </div>
          ) : myPlans.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Compass className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-lg font-medium mb-1">投稿したプランはありません</p>
              <p className="text-sm">あなたの旅行プランを共有してみましょう</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
