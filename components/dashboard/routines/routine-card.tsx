"use client";

import { Routine } from "@/types/routine";

interface RoutineCardProps {
  routine: Routine;
}

export function RoutineCard({ routine }: RoutineCardProps) {
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
        {/* Bar */}
        <div className="flex overflow-hidden rounded-md h-4 border">
          {routine.modules.map((module, index) => {
            const widthPercent =
              (module.duration / routine.totalDuration) * 100;
            const background =
              index % 2 === 0 ? "bg-primary/20" : "bg-secondary/30";

            return (
              <div
                key={`${routine.id}-${module.module}-${index}`}
                className={`${background} h-full border-r last:border-none`}
                style={{ width: `${widthPercent}%` }}
              />
            );
          })}
        </div>

        {/* Table */}
        <div className="mt-4">
          {/* Table Header */}
          <div className="grid grid-cols-3 text-xs font-semibold text-muted-foreground border-b pb-1 mb-2">
            <div>Practice Area</div>
            <div className="text-right">Time (min)</div>
            <div className="text-right">Percent (%)</div>
          </div>

          {/* Table Body */}
          {routine.modules.map((module, index) => {
            const percent = (
              (module.duration / routine.totalDuration) *
              100
            ).toFixed();
            return (
              <div
                key={`${routine.id}-${module.module}-row-${index}`}
                className="grid grid-cols-3 text-sm text-muted-foreground py-1"
              >
                <div>{module.module}</div>
                <div className="text-right">{module.duration}</div>
                <div className="text-right">{percent}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-4 flex justify-between text-xs text-muted-foreground">
        <div>Total Duration: {routine.totalDuration} min</div>
        {routine.isCustom && (
          <span className="font-medium text-green-600">Custom Routine</span>
        )}
      </div>
    </li>
  );
}
