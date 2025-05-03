import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Routine } from "@/types/routine";

interface RoutineStore {
  routines: Routine[];

  addRoutine: (routine: Routine) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  getRoutineById: (id: string) => Routine | undefined;
  setRoutines: (routines: Routine[]) => void;
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routines: [],

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

      getRoutineById: (id) =>
        get().routines.find((routine) => routine.id === id),

      setRoutines: (routines) => set({ routines }),
    }),
    {
      name: "routine-bank", // stored in localStorage
    }
  )
);
