"use client";

import { Exercise } from "@/types/exercise";
import { useEffect } from "react";
import { useExerciseStore } from "@/utils/zustand/exerciseStore";

interface ExerciseListProps {
  exercises: Exercise[];
}

export function ExerciseList({ exercises }: ExerciseListProps) {
  const initializeExercises = useExerciseStore(
    (state) => state.initDefaultExercises
  );
  const storeExercises = useExerciseStore((state) => state.exercises);

  useEffect(() => {
    initializeExercises(exercises);
  }, [initializeExercises, exercises]);

  return (
    <div className="grid gap-4">
      {storeExercises.length === 0 ? (
        <p className="text-muted-foreground">No exercises available.</p>
      ) : (
        <ul className="grid gap-4">
          {storeExercises.map((exercise) => (
            <li
              key={exercise.id}
              className="border rounded-xl p-4 shadow-sm bg-background"
            >
              <h3 className="text-lg font-semibold">{exercise.name}</h3>

              {exercise.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {exercise.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {exercise.modules.map((module) => (
                  <span
                    key={module}
                    className="text-xs rounded bg-muted px-2 py-0.5 text-muted-foreground"
                  >
                    {module}
                  </span>
                ))}
              </div>

              {exercise.isCustom && (
                <span className="mt-2 block text-xs font-medium text-green-600">
                  Custom Exercise
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
