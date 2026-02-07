import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface SpotInput {
  name: string;
  memo?: string;
}

interface DayInput {
  dayNumber: number;
  spots: SpotInput[];
}

interface CreatePlanInput {
  destination: string;
  days: number;
  thumbnailUrl?: string;
  dayList: DayInput[];
}

// GET /api/plans - プラン一覧取得
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const destination = searchParams.get("destination");
  const daysParam = searchParams.get("days");

  const where: { destination?: string; days?: number } = {};

  if (destination) {
    where.destination = destination;
  }

  if (daysParam) {
    const days = parseInt(daysParam, 10);
    if (!isNaN(days)) {
      where.days = days;
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

  return NextResponse.json(plans);
}

// POST /api/plans - プラン作成
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: CreatePlanInput = await request.json();

  // バリデーション
  if (!body.destination || typeof body.destination !== "string") {
    return NextResponse.json(
      { error: "destination is required" },
      { status: 422 }
    );
  }

  if (!body.days || typeof body.days !== "number" || body.days < 1) {
    return NextResponse.json(
      { error: "days must be a positive number" },
      { status: 422 }
    );
  }

  if (!body.dayList || !Array.isArray(body.dayList)) {
    return NextResponse.json(
      { error: "dayList is required" },
      { status: 422 }
    );
  }

  // プランと日程・スポットを一括作成
  const plan = await prisma.plan.create({
    data: {
      destination: body.destination,
      days: body.days,
      thumbnailUrl: body.thumbnailUrl ?? null,
      authorId: session.user.id,
      dayList: {
        create: body.dayList.map((day) => ({
          dayNumber: day.dayNumber,
          spots: {
            create: day.spots.map((spot, index) => ({
              name: spot.name,
              memo: spot.memo ?? "",
              orderIndex: index,
            })),
          },
        })),
      },
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json({ id: plan.id }, { status: 201 });
}
