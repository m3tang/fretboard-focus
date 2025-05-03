import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AssignedExercise, Routine, RoutineModule } from "@/types/routine";
import { nanoid } from "nanoid";

type PracticeSession = {
  id: string;
  name: string;
  duration: number;
  modules: RoutineModule[];
  startTime: number;
  currentModuleIndex: number;
  currentExerciseIndex: number;
  userId: string; // ✅ Add this
  routineId?: string; // optional
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
  loadRoutine: (routine: Routine, userId: string) => void;

  nextExercise: () => void;
  prevExercise: () => void;
  resetExercise: () => void;

  currentModuleIndex: () => number | null;
  moduleProgress: (index: number) => number;
  overallProgress: () => number;
  getCurrentExercises: () => AssignedExercise[] | null;
  saveSessionToDb: () => Promise<void>;
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
        set((state) => {
          const session = state.session;
          if (!session) return {};

          return {
            status: "active",
            isActive: true,
            isPaused: false,
            moduleStartSeconds: 0,
            completedModule: null,
            session: {
              ...session,
              currentModuleIndex: 0,
              currentExerciseIndex: 0,
            },
          };
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
          const currentExercise =
            currentIndex !== null
              ? session.modules[currentIndex].exercises?.[
                  session.currentExerciseIndex
                ]
              : null;

          if (
            currentExercise &&
            newElapsed +
              get().manualProgressSeconds -
              get().moduleStartSeconds >=
              currentExercise.computedDuration
          ) {
            get().nextExercise();
          }

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
        const currentDurationInSeconds = currentModule.computedDuration;

        const newManualProgress =
          manualProgressSeconds + currentDurationInSeconds;
        const newTotalProgress = elapsedSeconds + newManualProgress;

        set({
          manualProgressSeconds: newManualProgress,
          moduleStartSeconds: newTotalProgress,
          isPaused: true,
          completedModule: currentModule.module,
          session: {
            ...session,
            currentModuleIndex: currentIndex + 1,
            currentExerciseIndex: 0,
          },
        });
      },

      autoCompleteModule: () => {
        const { session, manualProgressSeconds, elapsedSeconds } = get();
        if (!session) return;

        const currentIndex = get().currentModuleIndex();
        if (currentIndex === null) return;

        const currentModule = session.modules[currentIndex];
        const currentDurationInSeconds = currentModule.computedDuration;

        const newManualProgress =
          manualProgressSeconds + currentDurationInSeconds;
        const newTotalProgress = elapsedSeconds + newManualProgress;

        set({
          manualProgressSeconds: newManualProgress,
          moduleStartSeconds: newTotalProgress,
          isPaused: true,
          completedModule: currentModule.module,
          session: {
            ...session,
            currentModuleIndex: currentIndex + 1,
            currentExerciseIndex: 0,
          },
        });
      },

      clearCompletedModule: () =>
        set({
          completedModule: null,
        }),

      loadRoutine: (routine, userId: string) => {
        const totalSessionDuration = routine.defaultDuration;
        const totalModuleWeight = routine.modules.reduce(
          (sum, m) => sum + m.weight,
          0
        );

        const modules: RoutineModule[] = routine.modules.map((m) => {
          const moduleDurationSeconds = Math.floor(
            (m.weight / totalModuleWeight) * totalSessionDuration
          );
          const totalExerciseWeight =
            m.exercises?.reduce((sum, e) => sum + e.weight, 0) || 1;

          const exercises: AssignedExercise[] =
            m.exercises?.map((e) => ({
              ...e,
              computedDuration: Math.floor(
                (e.weight / totalExerciseWeight) * moduleDurationSeconds
              ),
            })) || [];

          return {
            ...m,
            computedDuration: moduleDurationSeconds,
            exercises,
          };
        });

        const newSession: PracticeSession = {
          id: crypto.randomUUID(),
          name: routine.name,
          duration: totalSessionDuration,
          modules,
          startTime: Date.now(),
          currentModuleIndex: 0,
          currentExerciseIndex: 0,
          userId, // ✅ added
          routineId: routine.id, // ✅ optional, if available
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

      nextExercise: () => {
        const { session, elapsedSeconds, manualProgressSeconds } = get();
        if (!session) return;

        const currentModule = session.modules[session.currentModuleIndex];
        const nextIndex = session.currentExerciseIndex + 1;

        if (nextIndex < (currentModule.exercises?.length ?? 0)) {
          set({
            session: {
              ...session,
              currentExerciseIndex: nextIndex,
            },
            moduleStartSeconds: elapsedSeconds + manualProgressSeconds,
          });
        } else {
          get().finishModule();
        }
      },

      prevExercise: () => {
        const { session, elapsedSeconds, manualProgressSeconds } = get();
        if (!session) return;

        const prevIndex = Math.max(session.currentExerciseIndex - 1, 0);
        set({
          session: {
            ...session,
            currentExerciseIndex: prevIndex,
          },
          moduleStartSeconds: elapsedSeconds + manualProgressSeconds,
        });
      },

      resetExercise: () => {
        const { session } = get();
        if (!session) return;

        set({
          session: {
            ...session,
            currentExerciseIndex: 0,
          },
        });
      },

      currentModuleIndex: () => {
        const { session, elapsedSeconds, manualProgressSeconds } = get();
        if (!session) return null;

        const totalProgress = elapsedSeconds + manualProgressSeconds;
        let elapsed = 0;
        for (let i = 0; i < session.modules.length; i++) {
          const moduleTimeInSeconds = session.modules[i].computedDuration;
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
        const moduleTime = session.modules[index]?.computedDuration || 1;

        return Math.min((moduleElapsed / moduleTime) * 100, 100);
      },

      overallProgress: () => {
        const { session, elapsedSeconds, manualProgressSeconds } = get();
        if (!session) return 0;

        const totalProgress = elapsedSeconds + manualProgressSeconds;
        return Math.min((totalProgress / session.duration) * 100, 100);
      },

      getCurrentExercises: () => {
        const { session, currentModuleIndex } = get();
        if (!session) return [];

        const index = currentModuleIndex();
        if (index === null) return [];

        return session.modules[index].exercises || [];
      },

      saveSessionToDb: async () => {
        const { session, elapsedSeconds, manualProgressSeconds, clearSession } =
          get();

        if (!session) throw new Error("No active session to save");

        const now = new Date().toISOString();
        const duration = elapsedSeconds + manualProgressSeconds;

        const payload = {
          id: session.id,
          userId: session.userId ?? "", // load from Supabase client before this
          name: session.name,
          duration,
          startedAt: new Date(session.startTime).toISOString(),
          endedAt: now,
          modules: session.modules.map((mod, modIdx) => {
            const moduleId = crypto.randomUUID();
            return {
              id: moduleId,
              sessionId: session.id,
              module: mod.module,
              duration: mod.computedDuration,
              orderIndex: modIdx,
              exercises: (mod.exercises ?? []).map((ex, exIdx) => ({
                id: crypto.randomUUID(),
                moduleId,
                exerciseId: ex.id,
                name: ex.name,
                duration: ex.computedDuration,
                orderIndex: exIdx,
              })),
            };
          }),
        };

        const { savePracticeSession } = await import("@/app/actions"); // dynamic import avoids client bundling
        await savePracticeSession(payload);
        clearSession();
      },
    }),
    {
      name: "practice-session",
    }
  )
);
