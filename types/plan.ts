// プラン投稿用の型定義

export interface SpotInput {
  name: string;
  memo: string;
}

export interface DayInput {
  dayNumber: number;
  spots: SpotInput[];
}

export interface CreatePlanInput {
  destination: string;
  days: number;
  thumbnailUrl?: string;
  dayList: DayInput[];
}

// プラン一覧表示用の型
export interface PlanListItem {
  id: string;
  destination: string;
  days: number;
  thumbnailUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  _count: {
    likes: number;
  };
}
