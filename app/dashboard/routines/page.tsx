"use client";

import { useEffect } from "react";
import { useRoutineStore } from "@/utils/zustand/routineStore";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function RoutinesPage() {
  const { routines, initDefaultRoutines } = useRoutineStore();

  useEffect(() => {
    initDefaultRoutines();
  }, [initDefaultRoutines]);

  return (
    <div className="p-6">
      <DashboardHeader
        title="Practice Routines"
        subtitle="View and manage your available routines."
      />

      <div className="grid gap-4">
        {routines.length === 0 ? (
          <p className="text-muted-foreground">No routines available.</p>
        ) : (
          <ul className="grid gap-4">
            {routines.map((routine) => (
              <li
                key={routine.id}
                className="border rounded-xl p-4 shadow-sm bg-background"
              >
                <h3 className="text-lg font-semibold">{routine.name}</h3>

                {routine.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {routine.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {routine.modules.map((module) => (
                    <span
                      key={module}
                      className="text-xs rounded bg-muted px-2 py-0.5 text-muted-foreground"
                    >
                      {module}
                    </span>
                  ))}
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  Duration: {routine.duration} min
                </div>

                {routine.isCustom && (
                  <span className="mt-2 block text-xs font-medium text-green-600">
                    Custom Routine
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
