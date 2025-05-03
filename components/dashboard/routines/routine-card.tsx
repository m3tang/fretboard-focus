"use client";

import { Routine } from "@/types/routine";

interface RoutineCardProps {
  routine: Routine;
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs === 0 ? `${mins} min` : `${mins} min ${secs}s`;
}

export function RoutineCard({ routine }: RoutineCardProps) {
  const totalWeight = routine.modules.reduce((sum, m) => sum + m.weight, 0);
  const totalSeconds = routine.defaultDuration;
  const totalMinutes = Math.round(totalSeconds / 60);

  return (
    <li className="border rounded-xl p-4 shadow-sm bg-background">
      <h3 className="text-lg font-semibold">{routine.name}</h3>

      {routine.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {routine.description}
        </p>
      )}

      {/* Visual Time Breakdown */}
      <div className="w-full rounded-lg mt-4">
        <div className="flex overflow-hidden rounded-md h-4 border">
          {routine.modules.map((module, index) => {
            const percent = (module.weight / totalWeight) * 100;
            const background =
              index % 2 === 0 ? "bg-primary/20" : "bg-secondary/30";
            return (
              <div
                key={`${routine.id}-${module.module}-${index}`}
                className={`${background} h-full border-r last:border-none`}
                style={{ width: `${percent}%` }}
              />
            );
          })}
        </div>

        {/* Table */}
        <div className="mt-4 inline-block w-auto">
          {/* Table Header */}
          <div className="grid grid-cols-2 text-xs font-semibold text-muted-foreground border-b pb-1 mb-2">
            <div>Practice Area / Exercise</div>
            <div className="text-right">Duration</div>
          </div>

          {/* Table Body */}
          {routine.modules.map((module, index) => {
            const moduleSeconds = Math.round(
              (module.weight / totalWeight) * totalSeconds
            );
            const exercises = module.exercises ?? [];
            const totalExerciseWeight = exercises.reduce(
              (sum, e) => sum + e.weight,
              0
            );

            // Compute durations rounded to 15s that sum to moduleSeconds
            const durations: number[] = [];
            let totalAssigned = 0;

            for (let i = 0; i < exercises.length; i++) {
              const raw =
                totalExerciseWeight > 0
                  ? (exercises[i].weight / totalExerciseWeight) * moduleSeconds
                  : 0;
              const rounded = i === 0 ? 0 : Math.floor(raw / 15) * 15;

              durations.push(rounded);
              if (i !== 0) totalAssigned += rounded;
            }

            durations[0] = Math.max(moduleSeconds - totalAssigned, 0);

            return (
              <div key={`${routine.id}-${module.module}-group-${index}`}>
                {/* Module Row */}
                <div className="grid grid-cols-2 text-sm text-muted-foreground py-1 font-medium">
                  <div>{module.module}</div>
                  <div className="text-right">
                    {formatDuration(moduleSeconds)}
                  </div>
                </div>

                {/* Exercise Rows */}
                {exercises.map((ex, exIndex) => {
                  const duration = durations[exIndex];
                  return (
                    <div
                      key={`${module.id}-exercise-${ex.id}`}
                      className="grid grid-cols-2 text-sm text-muted-foreground py-1 pl-4"
                    >
                      <div className="italic">↳ {ex.name}</div>
                      <div className="text-right">
                        {formatDuration(duration)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-4 flex justify-between text-xs text-muted-foreground">
        <div>Default Duration: {totalMinutes} min</div>
        {routine.isCustom && (
          <span className="font-medium text-green-600">Custom Routine</span>
        )}
      </div>
    </li>
  );
}
