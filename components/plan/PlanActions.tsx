"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

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
          ♡ {likeCount}
        </Button>
        <Button variant="outline" disabled>
          保存
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={isLiked ? "default" : "outline"}
        onClick={handleLike}
        disabled={isLoading}
      >
        {isLiked ? "♥" : "♡"} {likeCount}
      </Button>
      <Button
        variant={isBookmarked ? "default" : "outline"}
        onClick={handleBookmark}
        disabled={isLoading}
      >
        {isBookmarked ? "保存済み" : "保存"}
      </Button>
    </div>
  );
}
