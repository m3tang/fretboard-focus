"use client";

import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { useRoutineStore } from "@/utils/zustand/routineStore";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // utility for conditional classes if you have it

export function RoutinePicker() {
  const { routines } = useRoutineStore();
  const { loadRoutine, setStatus } = usePracticeStore();

  return (
    <div className="grid gap-4">
      {routines.length === 0 ? (
        <p className="text-muted-foreground text-sm">No routines available.</p>
      ) : (
        routines.map((routine) => (
          <Card
            key={routine.id}
            onClick={() => {
              loadRoutine(routine);
              setStatus("preview");
            }}
            className={cn(
              "border-muted hover:border-primary hover:shadow-md transition cursor-pointer p-4 flex flex-col gap-2"
            )}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-base">{routine.name}</h3>
              <span className="text-xs text-muted-foreground">
                {routine.totalDuration} min
              </span>
            </div>

            {routine.description && (
              <p className="text-sm text-muted-foreground">
                {routine.description}
              </p>
            )}

            <div className="flex flex-wrap gap-1 mt-2">
              {routine.modules.map((module) => (
                <span
                  key={module.module}
                  className="text-xs bg-muted px-2 py-0.5 rounded-md"
                >
                  {module.module}
                </span>
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
