"use client";

import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { useRoutineStore } from "@/utils/zustand/routineStore";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function RoutinePicker() {
  const { routines } = useRoutineStore();
  const { loadRoutine, setStatus } = usePracticeStore();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, [supabase.auth]);

  if (!userId) return;

  return (
    <div className="grid gap-4">
      {routines.length === 0 ? (
        <p className="text-muted-foreground text-sm">No routines available.</p>
      ) : (
        routines.map((routine) => {
          const totalMinutes = Math.round(routine.defaultDuration / 60);

          return (
            <Card
              key={routine.id}
              onClick={() => {
                loadRoutine(routine, userId); // sets session with generated ID
                setStatus("preview");
                // use timeout to wait for zustand update
                setTimeout(() => {
                  const currentSession = usePracticeStore.getState().session;
                  if (currentSession) {
                    router.push(
                      `/dashboard/practice/preview/${currentSession.id}`
                    );
                  }
                }, 0);
              }}
              className={cn(
                "border-muted hover:border-primary hover:shadow-md transition cursor-pointer p-4 flex flex-col gap-2"
              )}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-base">{routine.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {totalMinutes} min
                </span>
              </div>

              {routine.description && (
                <p className="text-sm text-muted-foreground">
                  {routine.description}
                </p>
              )}

              <div className="flex flex-wrap gap-1 mt-2">
                {routine.modules.map((mod) => (
                  <span
                    key={mod.module}
                    className="text-xs bg-muted px-2 py-0.5 rounded-md"
                  >
                    {mod.module} ({mod.exercises?.length ?? 0})
                  </span>
                ))}
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
