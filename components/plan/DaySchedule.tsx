"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Spot {
  id: string;
  name: string;
  memo: string;
  orderIndex: number;
}

interface Day {
  id: string;
  dayNumber: number;
  spots: Spot[];
}

interface DayScheduleProps {
  day: Day;
  defaultOpen?: boolean;
}

export function DaySchedule({ day, defaultOpen = true }: DayScheduleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg overflow-hidden">
        <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors">
          <h2 className="text-lg font-semibold">{day.dayNumber}日目</h2>
          <span className="text-muted-foreground text-sm">
            {day.spots.length}スポット {isOpen ? "▲" : "▼"}
          </span>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <ul className="p-4 space-y-4">
            {day.spots.map((spot, index) => (
              <li key={spot.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  {index < day.spots.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium">{spot.name}</p>
                  {spot.memo && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {spot.memo}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
