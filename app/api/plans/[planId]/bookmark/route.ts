import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ planId: string }>;
}

// POST /api/plans/[planId]/bookmark - 保存追加
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

  // 既に保存済みか確認
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_planId: {
        userId: session.user.id,
        planId,
      },
    },
  });

  if (existingBookmark) {
    return NextResponse.json({ error: "Already bookmarked" }, { status: 409 });
  }

  // 保存追加
  await prisma.bookmark.create({
    data: {
      userId: session.user.id,
      planId,
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}

// DELETE /api/plans/[planId]/bookmark - 保存取消
export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await context.params;

  // 保存の存在確認
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_planId: {
        userId: session.user.id,
        planId,
      },
    },
  });

  if (!existingBookmark) {
    return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
  }

  // 保存削除
  await prisma.bookmark.delete({
    where: {
      userId_planId: {
        userId: session.user.id,
        planId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
