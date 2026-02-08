"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFormProps {
  initialDestination?: string;
  initialDays?: string;
}

export function SearchForm({ initialDestination = "", initialDays = "" }: SearchFormProps) {
  const router = useRouter();
  const [destination, setDestination] = useState(initialDestination);
  const [days, setDays] = useState(initialDays);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination.trim()) {
      params.set("destination", destination.trim());
    }
    if (days && days !== "all") {
      params.set("days", days);
    }

    const queryString = params.toString();
    router.push(queryString ? `/plans?${queryString}` : "/plans");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">プランを検索</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="destination">旅行先</Label>
          <Input
            id="destination"
            placeholder="例: 福岡、京都"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="days">日数</Label>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger id="days">
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="1">1日間</SelectItem>
              <SelectItem value="2">2日間</SelectItem>
              <SelectItem value="3">3日間</SelectItem>
              <SelectItem value="4">4日間</SelectItem>
              <SelectItem value="5">5日間</SelectItem>
              <SelectItem value="6">6日間</SelectItem>
              <SelectItem value="7">7日間以上</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSearch} className="w-full sm:w-auto">
        検索する
      </Button>
    </div>
  );
}
