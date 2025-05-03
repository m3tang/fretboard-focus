"use client";

import { Routine } from "@/types/routine";
import { useEffect } from "react";
import { useRoutineStore } from "@/utils/zustand/routineStore";
import { RoutineCard } from "@/components/dashboard/routines/routine-card";

interface RoutineListProps {
  routines: Routine[];
}

export function RoutineList({ routines }: RoutineListProps) {
  const storeRoutines = useRoutineStore((s) => s.routines);
  const setRoutines = useRoutineStore((s) => s.setRoutines);

  useEffect(() => {
    setRoutines(routines); // always overwrite with fresh server data
  }, [routines, setRoutines]);

  return (
    <div className="grid gap-4">
      {storeRoutines.length === 0 ? (
        <p className="text-muted-foreground">No routines available.</p>
      ) : (
        <ul className="grid gap-4">
          {storeRoutines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </ul>
      )}
    </div>
  );
}
