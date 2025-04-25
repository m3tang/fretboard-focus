import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Exercise } from "@/types/exercise";

interface ExerciseStore {
  exercises: Exercise[];
  initialized: boolean;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  getExerciseById: (id: string) => Exercise | undefined;
  initDefaultExercises: (exercisesFromDb: Exercise[]) => void; // ← correct now
}

export const useExerciseStore = create<ExerciseStore>()(
  persist(
    (set, get) => ({
      exercises: [],
      initialized: false,

      addExercise: (exercise) =>
        set((state) => ({
          exercises: [...state.exercises, exercise],
        })),

      updateExercise: (id, updates) =>
        set((state) => ({
          exercises: state.exercises.map((ex) =>
            ex.id === id ? { ...ex, ...updates } : ex
          ),
        })),

      deleteExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((ex) => ex.id !== id),
        })),

      getExerciseById: (id) => {
        return get().exercises.find((ex) => ex.id === id);
      },

      initDefaultExercises: (exercisesFromDb) => {
        const { initialized } = get();
        if (!initialized) {
          set({
            exercises: exercisesFromDb,
            initialized: true,
          });
        }
      },
    }),
    {
      name: "exercise-bank", // localStorage key
    }
  )
);
