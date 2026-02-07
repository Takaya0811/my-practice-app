import { auth } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const BUCKET_NAME = "plan-thumbnails";

export async function POST(request: NextRequest) {
  // 認証チェック
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 422 });
  }

  // ファイルタイプチェック
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG and PNG images are allowed" },
      { status: 415 }
    );
  }

  // ファイルサイズチェック
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size must be less than 2MB" },
      { status: 413 }
    );
  }

  const supabase = createSupabaseServerClient();

  // ファイル名を生成（ユニークにするためにtimestampとrandomを使用）
  const extension = file.type === "image/jpeg" ? "jpg" : "png";
  const fileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

  // ファイルをArrayBufferとして読み込み
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Supabase Storageにアップロード
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }

  // 公開URLを取得
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrlData.publicUrl });
}
