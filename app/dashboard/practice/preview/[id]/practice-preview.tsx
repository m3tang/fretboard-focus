"use client";

import { useState, useEffect, useRef } from "react";
import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs === 0 ? `${mins} min` : `${mins} min ${secs}s`;
}

export function PracticePreview() {
  const { session, setSession, startSession } = usePracticeStore();
  const router = useRouter();

  const [duration, setDuration] = useState(
    session ? Math.round(session.duration / 60) : 60
  );

  // Capture initial session only once to prevent circular updates
  const initialSessionRef = useRef(session);

  useEffect(() => {
    if (!initialSessionRef.current) return;

    const totalSeconds = duration * 60;
    const totalWeight = initialSessionRef.current.modules.reduce(
      (sum, m) => sum + m.weight,
      0
    );

    const updatedModules = initialSessionRef.current.modules.map((m) => ({
      ...m,
      computedDuration: Math.round((m.weight / totalWeight) * totalSeconds),
    }));

    setSession({
      ...initialSessionRef.current,
      duration: totalSeconds,
      modules: updatedModules,
    });
  }, [duration, setSession]);

  if (!session) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{session.name}</h1>

      {/* Duration Input */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Session Duration</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={180}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">minutes</span>
        </div>
        <Slider
          max={180}
          step={5}
          value={[duration]}
          onValueChange={(val) => setDuration(val[0])}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold">Modules</h2>
        <ul className="list-inside space-y-2">
          {session.modules.map((moduleObj) => {
            const exercises = moduleObj.exercises ?? [];
            const totalExerciseWeight = exercises.reduce(
              (sum, e) => sum + e.weight,
              0
            );

            // Compute per-exercise durations (15s-rounded)
            const moduleSeconds = moduleObj.computedDuration;
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
              <li key={moduleObj.id}>
                <div className="font-medium">
                  {moduleObj.module} – {formatDuration(moduleSeconds)}
                </div>
                {exercises.length > 0 && (
                  <ul className="ml-4 mt-1 list-disc list-inside text-muted-foreground text-sm space-y-1">
                    {exercises.map((ex, idx) => (
                      <li key={ex.id}>
                        {ex.name} – {formatDuration(durations[idx])}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            usePracticeStore.getState().clearSession();
          }}
        >
          Back
        </Button>

        <Button
          onClick={() => {
            const id = session.id;
            startSession();
            requestAnimationFrame(() => {
              router.push(`/dashboard/practice/active/${id}`);
            });
          }}
        >
          Start Session
        </Button>
      </div>
    </div>
  );
}
