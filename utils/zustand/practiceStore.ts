import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Routine } from "@/types/routine";
import { ModuleName } from "@/types/modules";
import { nanoid } from "nanoid"; // for session id generation if needed

type PracticeModule = {
  module: ModuleName;
  duration: number; // minutes
};

type PracticeSession = {
  id: string;
  name: string;
  duration: number; // total minutes
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

  setSession: (session: PracticeSession) => void;
  setStatus: (status: SessionStatus) => void;
  startSession: () => void;
  endSession: () => void;
  pause: () => void;
  resume: () => void;
  tick: () => void;
  finishModule: () => void;
  loadRoutine: (routine: Routine) => void;

  currentModuleIndex: () => number;
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

      setSession: (session) =>
        set({
          session,
          status: "preview",
          isActive: false,
          isPaused: false,
          elapsedSeconds: 0,
        }),

      setStatus: (status) => set({ status }),

      startSession: () =>
        set({ status: "active", isActive: true, isPaused: false }),

      endSession: () => {
        set({
          session: null,
          status: "completed",
          isActive: false,
          isPaused: false,
          elapsedSeconds: 0,
        });
      },

      pause: () => set({ isPaused: true }),
      resume: () => set({ isPaused: false }),

      tick: () => {
        const { isPaused, session, isActive, elapsedSeconds } = get();
        if (session && isActive && !isPaused) {
          set({ elapsedSeconds: elapsedSeconds + 1 });
        }
      },

      finishModule: () => {
        const { session, elapsedSeconds } = get();
        if (!session) return;

        const moduleDurationsInSeconds = session.modules.map(
          (m) => m.duration * 60
        );
        let totalElapsed = 0;
        for (let i = 0; i < moduleDurationsInSeconds.length; i++) {
          totalElapsed += moduleDurationsInSeconds[i];
          if (elapsedSeconds < totalElapsed) {
            // Move to start of next module
            const newElapsed = totalElapsed;
            set({ elapsedSeconds: newElapsed, isPaused: true });
            return;
          }
        }
      },

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
        });
      },

      currentModuleIndex: () => {
        const { session, elapsedSeconds } = get();
        if (!session) return 0;

        let elapsed = 0;
        for (let i = 0; i < session.modules.length; i++) {
          const moduleTimeInSeconds = session.modules[i].duration * 60;
          if (elapsedSeconds < elapsed + moduleTimeInSeconds) {
            return i;
          }
          elapsed += moduleTimeInSeconds;
        }
        return session.modules.length - 1;
      },

      moduleProgress: (index) => {
        const { session, elapsedSeconds } = get();
        if (!session) return 0;

        let elapsed = 0;
        for (let i = 0; i < index; i++) {
          elapsed += session.modules[i].duration * 60;
        }
        const moduleTime = session.modules[index].duration * 60;
        const moduleElapsed = elapsedSeconds - elapsed;

        if (moduleElapsed >= moduleTime) return 100;
        if (moduleElapsed <= 0) return 0;

        return (moduleElapsed / moduleTime) * 100;
      },

      overallProgress: () => {
        const { session, elapsedSeconds } = get();
        if (!session) return 0;

        return Math.min((elapsedSeconds / (session.duration * 60)) * 100, 100);
      },
    }),
    {
      name: "practice-session",
    }
  )
);
