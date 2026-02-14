import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PlanActions } from "@/components/plan/PlanActions";
import { DaySchedule } from "@/components/plan/DaySchedule";
import { ArrowLeft, MapPin, Calendar, User } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlanDetailPage({ params }: PageProps) {
  const { id } = await params;

  // セッション取得（オプショナル）
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const plan = await prisma.plan.findUnique({
    where: { id },
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
      dayList: {
        orderBy: { dayNumber: "asc" },
        select: {
          id: true,
          dayNumber: true,
          spots: {
            orderBy: { orderIndex: "asc" },
            select: {
              id: true,
              name: true,
              memo: true,
              orderIndex: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!plan) {
    notFound();
  }

  // ログインユーザーのいいね/保存状態を取得
  let isLiked = false;
  let isBookmarked = false;

  if (session?.user) {
    const [like, bookmark] = await Promise.all([
      prisma.like.findUnique({
        where: {
          userId_planId: {
            userId: session.user.id,
            planId: id,
          },
        },
      }),
      prisma.bookmark.findUnique({
        where: {
          userId_planId: {
            userId: session.user.id,
            planId: id,
          },
        },
      }),
    ]);

    isLiked = !!like;
    isBookmarked = !!bookmark;
  }

  const formattedDate = new Date(plan.createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        トップに戻る
      </Link>

      {/* サムネイル */}
      {plan.thumbnailUrl ? (
        <img
          src={plan.thumbnailUrl}
          alt={plan.destination}
          className="w-full h-72 object-cover rounded-xl shadow-sm mb-6"
        />
      ) : (
        <div className="w-full h-72 rounded-xl shadow-sm mb-6 flex flex-col items-center justify-center bg-muted text-muted-foreground">
          <MapPin className="h-10 w-10 mb-2 text-primary/40" />
          <span>No Image</span>
        </div>
      )}

      {/* ヘッダー情報 */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold">{plan.destination}</h1>
          <PlanActions
            planId={plan.id}
            initialLikeCount={plan._count.likes}
            initialIsLiked={isLiked}
            initialIsBookmarked={isBookmarked}
          />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {plan.days}日間
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {plan.author.name}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* 日程 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">旅程</h2>
        {plan.dayList.map((day, index) => (
          <DaySchedule
            key={day.id}
            day={day}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
