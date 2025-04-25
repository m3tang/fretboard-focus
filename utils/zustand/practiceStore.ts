import { create } from "zustand";
import { persist } from "zustand/middleware";

type PracticeSession = {
  id: string;
  name: string;
  duration: number; // in minutes
  modules: string[];
  startTime: number;
  currentModuleIndex: number;
  timePerModule: number;
};

type PracticeStore = {
  session: PracticeSession | null;
  isActive: boolean;
  isPaused: boolean;
  elapsedSeconds: number;

  setSession: (s: PracticeSession) => void;
  endSession: () => void;
  pause: () => void;
  resume: () => void;
  tick: () => void;
  finishModule: () => void;

  currentModuleIndex: () => number;
  moduleProgress: (index: number) => number;
  overallProgress: () => number;
};

export const usePracticeStore = create<PracticeStore>()(
  persist(
    (set, get) => ({
      session: null,
      isActive: false,
      isPaused: false,
      elapsedSeconds: 0,

      setSession: (s) =>
        set({
          session: s,
          isActive: true,
          isPaused: false,
          elapsedSeconds: 0,
        }),

      endSession: () => {
        set({
          session: null,
          isActive: false,
          isPaused: false,
          elapsedSeconds: 0,
        });
      },

      pause: () => set({ isPaused: true }),
      resume: () => set({ isPaused: false }),

      tick: () => {
        const { isPaused, session, elapsedSeconds } = get();
        if (session && !isPaused) {
          set({ elapsedSeconds: elapsedSeconds + 1 });
        }
      },

      finishModule: () => {
        const { session, elapsedSeconds } = get();
        if (!session) return;

        const nextIndex = Math.min(
          Math.floor(elapsedSeconds / (session.timePerModule * 60)) + 1,
          session.modules.length - 1
        );

        const newElapsed = nextIndex * session.timePerModule * 60;
        set({ elapsedSeconds: newElapsed, isPaused: true });
      },

      currentModuleIndex: () => {
        const { session, elapsedSeconds } = get();
        if (!session) return 0;
        return Math.min(
          Math.floor(elapsedSeconds / (session.timePerModule * 60)),
          session.modules.length - 1
        );
      },

      moduleProgress: (index) => {
        const { session, elapsedSeconds } = get();
        if (!session) return 0;

        const start = index * session.timePerModule * 60;
        const end = start + session.timePerModule * 60;

        if (elapsedSeconds >= end) return 100;
        if (elapsedSeconds < start) return 0;

        return ((elapsedSeconds - start) / (session.timePerModule * 60)) * 100;
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
