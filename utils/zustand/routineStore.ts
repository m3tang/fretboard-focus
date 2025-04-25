// stores/routineStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Routine } from "@/types/routine";
import { defaultRoutines } from "@/data/defaults/defaultRoutines"; // we'll make this next!

interface RoutineStore {
  routines: Routine[];
  initialized: boolean;
  addRoutine: (routine: Routine) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  getRoutineById: (id: string) => Routine | undefined;
  initDefaultRoutines: () => void;
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routines: [],
      initialized: false,

      addRoutine: (routine) =>
        set((state) => ({
          routines: [...state.routines, routine],
        })),

      updateRoutine: (id, updates) =>
        set((state) => ({
          routines: state.routines.map((routine) =>
            routine.id === id ? { ...routine, ...updates } : routine
          ),
        })),

      deleteRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((routine) => routine.id !== id),
        })),

      getRoutineById: (id) => {
        return get().routines.find((routine) => routine.id === id);
      },

      initDefaultRoutines: () => {
        const { initialized, routines } = get();
        if (!initialized && routines.length === 0) {
          set({
            routines: defaultRoutines,
            initialized: true,
          });
        }
      },
    }),
    {
      name: "routine-bank",
    }
  )
);
