"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SpotInput, DayInput, CreatePlanInput } from "@/types/plan";

type Step = 1 | 2;

interface DayFormData {
  spots: SpotInput[];
}

export default function NewPlanPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // STEP 1: 基本情報
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState<number>(1);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // STEP 2: 日程データ
  const [dayList, setDayList] = useState<DayFormData[]>([{ spots: [{ name: "", memo: "" }] }]);

  // UI状態
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 認証チェック
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>プランを投稿するにはログインが必要です</p>
        <Button onClick={() => router.push("/login")}>ログイン</Button>
      </div>
    );
  }

  // サムネイル選択ハンドラー
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // バリデーション
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("JPEGまたはPNG画像のみアップロード可能です");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("ファイルサイズは2MB以下にしてください");
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setError(null);
  };

  // 日数変更時に日程データを調整
  const handleDaysChange = (value: string) => {
    const newDays = parseInt(value, 10);
    setDays(newDays);

    // 日程データを調整
    const newDayList: DayFormData[] = [];
    for (let i = 0; i < newDays; i++) {
      if (dayList[i]) {
        newDayList.push(dayList[i]);
      } else {
        newDayList.push({ spots: [{ name: "", memo: "" }] });
      }
    }
    setDayList(newDayList);
  };

  // スポット追加
  const addSpot = (dayIndex: number) => {
    const newDayList = [...dayList];
    newDayList[dayIndex].spots.push({ name: "", memo: "" });
    setDayList(newDayList);
  };

  // スポット削除
  const removeSpot = (dayIndex: number, spotIndex: number) => {
    const newDayList = [...dayList];
    if (newDayList[dayIndex].spots.length > 1) {
      newDayList[dayIndex].spots.splice(spotIndex, 1);
      setDayList(newDayList);
    }
  };

  // スポット更新
  const updateSpot = (
    dayIndex: number,
    spotIndex: number,
    field: keyof SpotInput,
    value: string
  ) => {
    const newDayList = [...dayList];
    newDayList[dayIndex].spots[spotIndex][field] = value;
    setDayList(newDayList);
  };

  // STEP 1 → STEP 2
  const goToStep2 = () => {
    if (!destination.trim()) {
      setError("旅行先を入力してください");
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  // STEP 2 → STEP 1
  const goToStep1 = () => {
    setCurrentStep(1);
  };

  // フォーム送信
  const handleSubmit = async () => {
    // バリデーション
    for (let i = 0; i < dayList.length; i++) {
      const day = dayList[i];
      for (let j = 0; j < day.spots.length; j++) {
        if (!day.spots[j].name.trim()) {
          setError(`${i + 1}日目のスポット${j + 1}の名前を入力してください`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // サムネイルアップロード
      let thumbnailUrl: string | undefined;
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("file", thumbnailFile);

        const uploadRes = await fetch("/api/upload/thumbnail", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadError = await uploadRes.json();
          throw new Error(uploadError.error || "サムネイルのアップロードに失敗しました");
        }

        const uploadData = await uploadRes.json();
        thumbnailUrl = uploadData.url;
      }

      // プラン作成
      const planData: CreatePlanInput = {
        destination,
        days,
        thumbnailUrl,
        dayList: dayList.map((day, index) => ({
          dayNumber: index + 1,
          spots: day.spots,
        })),
      };

      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      });

      if (!res.ok) {
        const resError = await res.json();
        throw new Error(resError.error || "プランの作成に失敗しました");
      }

      const { id } = await res.json();
      router.push(`/plans/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">プランを投稿</h1>

      {/* ステップインジケーター */}
      <div className="flex items-center mb-8">
        <div className="flex flex-col items-center gap-1">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            1
          </div>
          <span className={`text-xs ${currentStep >= 1 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            基本情報
          </span>
        </div>
        <div className={`flex-1 h-1 mx-2 mb-5 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`} />
        <div className="flex flex-col items-center gap-1">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            2
          </div>
          <span className={`text-xs ${currentStep >= 2 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            日程入力
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* STEP 1: 基本情報 */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination">旅行先 *</Label>
              <Input
                id="destination"
                placeholder="例: 福岡、箱根、京都"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">日数 *</Label>
              <Select value={days.toString()} onValueChange={handleDaysChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <SelectItem key={d} value={d.toString()}>
                      {d}日間
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">サムネイル画像（任意）</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleThumbnailChange}
              />
              <p className="text-sm text-muted-foreground">
                JPEG/PNG形式、2MB以下
              </p>
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="プレビュー"
                  className="mt-2 max-w-xs rounded-md"
                />
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={goToStep2}>次へ</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: 日程入力 */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {dayList.map((day, dayIndex) => (
            <Card key={dayIndex}>
              <CardHeader>
                <CardTitle>{dayIndex + 1}日目</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {day.spots.map((spot, spotIndex) => (
                  <div key={spotIndex} className="p-4 border rounded-md space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">スポット {spotIndex + 1}</span>
                      {day.spots.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpot(dayIndex, spotIndex)}
                        >
                          削除
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>スポット名 *</Label>
                      <Input
                        placeholder="例: 太宰府天満宮"
                        value={spot.name}
                        onChange={(e) =>
                          updateSpot(dayIndex, spotIndex, "name", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>メモ</Label>
                      <Textarea
                        placeholder="滞在時間や感想など"
                        value={spot.memo}
                        onChange={(e) =>
                          updateSpot(dayIndex, spotIndex, "memo", e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addSpot(dayIndex)}
                  className="w-full"
                >
                  ＋ スポットを追加
                </Button>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={goToStep1}>
              戻る
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "投稿中..." : "投稿する"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
