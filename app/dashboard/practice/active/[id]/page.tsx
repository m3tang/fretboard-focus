"use client";

import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Metronome from "@/components/Metronome";

function formatMMSS(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ActivePracticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const {
    session,
    isPaused,
    elapsedSeconds,
    tick,
    pause,
    resume,
    currentModuleIndex,
    overallProgress,
    softEndSession,
    moduleStartSeconds,
    manualProgressSeconds,
  } = usePracticeStore();

  const handleFinish = useCallback(() => {
    softEndSession();
    router.replace(`/dashboard/practice/summary/${id}`);
  }, [id, router, softEndSession]);

  useEffect(() => {
    if (!session) {
      handleFinish();
      return;
    }

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [session, tick, handleFinish]);

  useEffect(() => {
    if (session && overallProgress() >= 100) {
      handleFinish();
    }
  }, [overallProgress, session, handleFinish]);

  if (!session) return null;

  const currentIndex = currentModuleIndex();
  const currentModule =
    currentIndex !== null ? session.modules[currentIndex] : null;

  const moduleElapsedSeconds =
    elapsedSeconds + manualProgressSeconds - moduleStartSeconds;

  const currentExercise =
    currentModule?.exercises?.[session.currentExerciseIndex] ?? null;

  const exerciseProgress = currentExercise
    ? (moduleElapsedSeconds / currentExercise.computedDuration) * 100
    : 0;

  return (
    <div className="flex flex-row w-full h-full p-6 max-w-screen-lg mx-auto gap-6 transition">
      {/* Sidebar: Full Routine */}
      <div className="w-64 border-r pr-4 overflow-y-auto max-h-[80vh]">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Routine Overview
            </h4>
            <ul className="space-y-4 text-sm">
              {session.modules.map((mod, modIdx) => (
                <li key={mod.id}>
                  <p
                    className={`font-medium mb-1 ${
                      modIdx === currentIndex ? "text-primary" : ""
                    }`}
                  >
                    {mod.module}
                  </p>
                  <ul className="space-y-1 pl-3 border-l border-muted">
                    {(mod.exercises ?? []).map((ex, exIdx) => {
                      const currentIdx = currentIndex ?? -1;
                      const isCurrentModule = modIdx === currentIdx;
                      const isCurrentExercise =
                        isCurrentModule &&
                        exIdx === session.currentExerciseIndex;
                      const isCompleted =
                        modIdx < currentIdx ||
                        (isCurrentModule &&
                          exIdx < session.currentExerciseIndex);

                      return (
                        <li
                          key={ex.id}
                          className={`flex justify-between items-center ${
                            isCompleted
                              ? "text-muted-foreground line-through"
                              : isCurrentExercise
                                ? "font-semibold text-primary"
                                : "text-muted-foreground"
                          }`}
                        >
                          <span>
                            {isCompleted
                              ? "✅"
                              : isCurrentExercise
                                ? "⏳"
                                : "•"}{" "}
                            {ex.name}
                          </span>
                          <span className="text-xs">
                            {formatMMSS(ex.computedDuration)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          {/* Skip Module Button */}
          <SkipModuleButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{session.name}</h2>
            <p className="text-muted-foreground text-sm">
              {new Date(session.startTime).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => (isPaused ? resume() : pause())}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button onClick={handleFinish}>End Session</Button>
          </div>
        </div>

        {/* Current Exercise */}
        <div className="p-6 border rounded-xl bg-background shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">
              {currentExercise?.name ?? "No exercise"}
            </h3>
          </div>

          {currentExercise && (
            <>
              <Progress value={Math.min(exerciseProgress, 100)} />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>
                  {formatMMSS(moduleElapsedSeconds)} /{" "}
                  {formatMMSS(currentExercise.computedDuration)}
                </span>
                <span>{Math.floor(exerciseProgress)}%</span>
              </div>

              <div className="flex justify-end pt-4">
                <SkipExerciseButton />
              </div>
            </>
          )}
        </div>

        {/* Metronome */}
        {currentModule && <Metronome />}
      </div>
    </div>
  );
}

function SkipExerciseButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const nextExercise = usePracticeStore((s) => s.nextExercise);
  const session = usePracticeStore((s) => s.session);

  const canSkip =
    session &&
    session.currentModuleIndex < session.modules.length &&
    session.modules[session.currentModuleIndex]?.exercises &&
    session.currentExerciseIndex + 1 <
      session.modules[session.currentModuleIndex].exercises!.length;

  return (
    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogTrigger asChild>
        <Button variant="ghost" disabled={!canSkip}>
          Skip →
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Skip this exercise?
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Are you sure you want to move on? You won’t be able to return to this
          exercise.
        </DialogDescription>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              nextExercise();
              setShowConfirm(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SkipModuleButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const finishModule = usePracticeStore((s) => s.finishModule);

  return (
    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          Skip Module
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Skip this module?
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Are you sure you want to finish this module? You’ll move on and won’t
          be able to return.
        </DialogDescription>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              finishModule();
              setShowConfirm(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
