"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark } from "lucide-react";

interface PlanActionsProps {
  planId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  initialIsBookmarked: boolean;
}

export function PlanActions({
  planId,
  initialLikeCount,
  initialIsLiked,
  initialIsBookmarked,
}: PlanActionsProps) {
  const { data: session } = useSession();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!session || isLoading) return;

    setIsLoading(true);
    try {
      const method = isLiked ? "DELETE" : "POST";
      const res = await fetch(`/api/plans/${planId}/like`, { method });

      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.count);
        setIsLiked(!isLiked);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!session || isLoading) return;

    setIsLoading(true);
    try {
      const method = isBookmarked ? "DELETE" : "POST";
      const res = await fetch(`/api/plans/${planId}/bookmark`, { method });

      if (res.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" disabled>
          <Heart className="h-4 w-4 mr-1" />
          {likeCount}
        </Button>
        <Button variant="outline" disabled>
          <Bookmark className="h-4 w-4 mr-1" />
          保存
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleLike}
        disabled={isLoading}
        className={isLiked ? "border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900" : ""}
      >
        <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current text-red-500" : ""}`} />
        {likeCount}
      </Button>
      <Button
        variant="outline"
        onClick={handleBookmark}
        disabled={isLoading}
        className={isBookmarked ? "border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:hover:bg-amber-900" : ""}
      >
        <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? "fill-current text-amber-500" : ""}`} />
        {isBookmarked ? "保存済み" : "保存"}
      </Button>
    </div>
  );
}
