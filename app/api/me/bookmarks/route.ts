import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET /api/me/bookmarks - 保存したプラン一覧
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      plan: {
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
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // プラン情報のみを抽出
  const plans = bookmarks.map((bookmark) => bookmark.plan);

  return NextResponse.json(plans);
}
