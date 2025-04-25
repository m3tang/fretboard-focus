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
          status: "preview", // default next step after setting session
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
