import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Routine } from "@/types/routine";
import { ModuleName } from "@/types/modules";
import { nanoid } from "nanoid";

type PracticeModule = {
  module: ModuleName;
  duration: number; // minutes
};

type PracticeSession = {
  id: string;
  name: string;
  duration: number;
  modules: PracticeModule[];
  startTime: number;
  currentModuleIndex: number;
};

type SessionStatus = "draft" | "preview" | "active" | "completed";

interface PracticeStore {
  session: PracticeSession | null;
  status: SessionStatus;
  isActive: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  manualProgressSeconds: number;
  moduleStartSeconds: number;
  completedModule: string | null;

  setSession: (session: PracticeSession) => void;
  setStatus: (status: SessionStatus) => void;
  startSession: () => void;
  softEndSession: () => void;
  clearSession: () => void;
  pause: () => void;
  resume: () => void;
  tick: () => void;
  finishModule: () => void;
  autoCompleteModule: () => void;
  clearCompletedModule: () => void;
  loadRoutine: (routine: Routine) => void;

  currentModuleIndex: () => number | null;
  moduleProgress: (index: number) => number;
  overallProgress: () => number;
}

export const usePracticeStore = create<PracticeStore>()(
  persist(
    (set, get) => ({
      session: null,
      status: "draft",
      isActive: false,
      isPaused: false,
      elapsedSeconds: 0,
      manualProgressSeconds: 0,
      moduleStartSeconds: 0,
      completedModule: null,

      setSession: (session) =>
        set({
          session,
          status: "preview",
          isActive: false,
          isPaused: false,
          elapsedSeconds: 0,
          manualProgressSeconds: 0,
          moduleStartSeconds: 0,
          completedModule: null,
        }),

      setStatus: (status) => set({ status }),

      startSession: () =>
        set({
          status: "active",
          isActive: true,
          isPaused: false,
          moduleStartSeconds: 0,
          completedModule: null,
        }),

      softEndSession: () =>
        set({
          status: "completed",
          isActive: false,
          isPaused: false,
        }),

      clearSession: () =>
        set({
          session: null,
          status: "draft",
          isActive: false,
          isPaused: false,
          elapsedSeconds: 0,
          manualProgressSeconds: 0,
          moduleStartSeconds: 0,
          completedModule: null,
        }),

      pause: () => set({ isPaused: true }),
      resume: () => set({ isPaused: false }),

      tick: () => {
        const {
          isPaused,
          session,
          isActive,
          elapsedSeconds,
          moduleProgress,
          currentModuleIndex,
          autoCompleteModule,
        } = get();

        if (session && isActive && !isPaused) {
          const newElapsed = elapsedSeconds + 1;
          set({ elapsedSeconds: newElapsed });

          const currentIndex = currentModuleIndex();
          if (currentIndex !== null && moduleProgress(currentIndex) >= 100) {
            autoCompleteModule();
          }
        }
      },

      finishModule: () => {
        const { session, manualProgressSeconds, elapsedSeconds } = get();
        if (!session) return;

        const currentIndex = get().currentModuleIndex();
        if (currentIndex === null) return;

        const currentModule = session.modules[currentIndex];
        const currentDurationInSeconds = currentModule.duration * 60;

        const newManualProgress =
          manualProgressSeconds + currentDurationInSeconds;
        const newTotalProgress = elapsedSeconds + newManualProgress;

        set({
          manualProgressSeconds: newManualProgress,
          moduleStartSeconds: newTotalProgress,
          isPaused: true,
          completedModule: currentModule.module,
        });
      },

      autoCompleteModule: () => {
        const { session, manualProgressSeconds, elapsedSeconds } = get();
        if (!session) return;

        const currentIndex = get().currentModuleIndex();
        if (currentIndex === null) return;

        const currentModule = session.modules[currentIndex];
        const currentDurationInSeconds = currentModule.duration * 60;

        const newManualProgress =
          manualProgressSeconds + currentDurationInSeconds;
        const newTotalProgress = elapsedSeconds + newManualProgress;

        set({
          manualProgressSeconds: newManualProgress,
          moduleStartSeconds: newTotalProgress,
          isPaused: true,
          completedModule: currentModule.module,
        });
      },

      clearCompletedModule: () =>
        set({
          completedModule: null,
        }),

      loadRoutine: (routine) => {
        const totalDuration = routine.modules.reduce(
          (sum, m) => sum + m.duration,
          0
        );

        const newSession: PracticeSession = {
          id: nanoid(),
          name: routine.name,
          duration: totalDuration,
          modules: routine.modules.map((m) => ({
            module: m.module,
            duration: m.duration,
          })),
          startTime: Date.now(),
          currentModuleIndex: 0,
        };

        set({
          session: newSession,
          status: "preview",
          isActive: false,
          isPaused: false,
          elapsedSeconds: 0,
          manualProgressSeconds: 0,
          moduleStartSeconds: 0,
          completedModule: null,
        });
      },

      currentModuleIndex: () => {
        const { session, elapsedSeconds, manualProgressSeconds } = get();
        if (!session) return null;

        const totalProgress = elapsedSeconds + manualProgressSeconds;

        let elapsed = 0;
        for (let i = 0; i < session.modules.length; i++) {
          const moduleTimeInSeconds = session.modules[i].duration * 60;
          if (totalProgress < elapsed + moduleTimeInSeconds) {
            return i;
          }
          elapsed += moduleTimeInSeconds;
        }
        return null;
      },

      moduleProgress: (index) => {
        const {
          session,
          elapsedSeconds,
          manualProgressSeconds,
          moduleStartSeconds,
        } = get();
        if (!session) return 0;

        const totalProgress = elapsedSeconds + manualProgressSeconds;
        const moduleElapsed = totalProgress - moduleStartSeconds;

        const moduleTime = session.modules[index]?.duration
          ? session.modules[index].duration * 60
          : 1; // default 1s to avoid crash

        if (moduleElapsed >= moduleTime) return 100;
        if (moduleElapsed <= 0) return 0;

        return (moduleElapsed / moduleTime) * 100;
      },

      overallProgress: () => {
        const { session, elapsedSeconds, manualProgressSeconds } = get();
        if (!session) return 0;

        const totalSeconds = session.duration * 60;
        const totalProgress = elapsedSeconds + manualProgressSeconds;

        return Math.min((totalProgress / totalSeconds) * 100, 100);
      },
    }),
    {
      name: "practice-session",
    }
  )
);
