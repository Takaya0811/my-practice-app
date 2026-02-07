import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlanDetailPage({ params }: PageProps) {
  const { id } = await params;

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

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Link href="/" className="text-primary underline mb-4 inline-block">
        ← トップに戻る
      </Link>

      {plan.thumbnailUrl && (
        <img
          src={plan.thumbnailUrl}
          alt={plan.destination}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <h1 className="text-2xl font-bold mb-2">{plan.destination}</h1>
      <p className="text-muted-foreground mb-4">
        {plan.days}日間 | 投稿者: {plan.author.name} | ♡ {plan._count.likes}
      </p>

      <div className="space-y-6">
        {plan.dayList.map((day) => (
          <div key={day.id} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">{day.dayNumber}日目</h2>
            <ul className="space-y-3">
              {day.spots.map((spot) => (
                <li key={spot.id} className="pl-4 border-l-2 border-primary">
                  <p className="font-medium">{spot.name}</p>
                  {spot.memo && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {spot.memo}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
