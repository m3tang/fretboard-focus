"use client";

import { useExerciseStore } from "@/utils/zustand/exerciseStore";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function PracticeAreasPage() {
  const exercises = useExerciseStore((state) => state.exercises);

  // 1. Flatten all modules across all exercises
  const allModules = exercises.flatMap((exercise) => exercise.modules);

  // 2. Deduplicate the modules (e.g., only one "Warmup", etc.)
  const uniqueModules = Array.from(new Set(allModules));

  return (
    <div>
      <DashboardHeader
        title="Practice Areas"
        subtitle="Manage the different areas you'll focus on during your practice sessions."
      />

      <div className="grid gap-4">
        {uniqueModules.length === 0 ? (
          <p className="text-muted-foreground">No practice areas available.</p>
        ) : (
          <ul className="grid gap-4">
            {uniqueModules.map((module) => (
              <li
                key={module}
                className="border rounded-xl p-4 shadow-sm bg-background"
              >
                <h3 className="text-lg font-semibold mb-2">{module}</h3>

                {/* Exercises under this module */}
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {exercises
                    .filter((exercise) => exercise.modules.includes(module))
                    .map((exercise) => (
                      <li key={`${module}-${exercise.id}`}>{exercise.name}</li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
