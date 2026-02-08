import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ planId: string }>;
}

// POST /api/plans/[planId]/like - いいね追加
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await context.params;

  // プランの存在確認
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    select: { id: true },
  });

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  // 既にいいね済みか確認
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_planId: {
        userId: session.user.id,
        planId,
      },
    },
  });

  if (existingLike) {
    return NextResponse.json({ error: "Already liked" }, { status: 409 });
  }

  // いいね追加
  await prisma.like.create({
    data: {
      userId: session.user.id,
      planId,
    },
  });

  // いいね数を取得
  const count = await prisma.like.count({
    where: { planId },
  });

  return NextResponse.json({ count }, { status: 201 });
}

// DELETE /api/plans/[planId]/like - いいね取消
export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await context.params;

  // いいねの存在確認
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_planId: {
        userId: session.user.id,
        planId,
      },
    },
  });

  if (!existingLike) {
    return NextResponse.json({ error: "Like not found" }, { status: 404 });
  }

  // いいね削除
  await prisma.like.delete({
    where: {
      userId_planId: {
        userId: session.user.id,
        planId,
      },
    },
  });

  // いいね数を取得
  const count = await prisma.like.count({
    where: { planId },
  });

  return NextResponse.json({ count });
}
