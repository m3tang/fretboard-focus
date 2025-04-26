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
    moduleProgress,
    overallProgress,
    completedModule,
    clearCompletedModule,
    softEndSession,
  } = usePracticeStore();

  const handleFinish = useCallback(() => {
    router.replace(`/dashboard/practice/summary/${id}`);
  }, [id, router]);

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

  return (
    <div className="p-6 w-full mx-auto space-y-8 max-w-4xl transition">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div>
          <div className="flex flex-row gap-5 items-center">
            <h2 className="text-3xl font-bold">{session.name}</h2>
            {isPaused && (
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1.5 rounded-full border border-yellow-300 shadow-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-yellow-600" />
                Paused
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString(undefined, {
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
          <Button variant="default" onClick={handleFinish}>
            End Session
          </Button>
        </div>
      </div>

      {/* Overall Time Tracker */}
      <div className="w-full">
        <Progress value={overallProgress()} />
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>Elapsed: {Math.floor(elapsedSeconds / 60)} min</span>
          <span>Planned: {session.duration} min</span>
        </div>
      </div>

      {/* Module Stepper */}
      <div className="flex gap-2 overflow-x-auto">
        {session.modules.map((moduleObj, index) => (
          <div
            key={moduleObj.module}
            className={`min-w-[100px] p-2 rounded-md text-sm font-semibold border text-center transition duration-300 ${
              currentIndex === index
                ? "bg-primary text-white scale-105"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {moduleObj.module}
          </div>
        ))}
      </div>

      {/* Current Module Focus */}
      <div className="p-6 rounded-xl border shadow-md bg-background space-y-4">
        {completedModule ? (
          // 🎯 Module Completed View
          <div className="flex flex-col items-center text-center space-y-6 mt-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-green-100 text-green-600 rounded-full p-3">
                ✅
              </div>
              <h2 className="text-2xl font-bold text-green-700 animate-pulse">
                {completedModule} Complete!
              </h2>
            </div>

            {currentModule ? (
              <div className="text-muted-foreground text-sm">
                <span className="font-medium">Up Next:</span>{" "}
                {currentModule.module}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm italic">
                All modules complete — awesome work! 🎉
              </div>
            )}

            <Button
              size="lg"
              onClick={() => {
                if (currentModule) {
                  clearCompletedModule();
                  resume();
                } else {
                  softEndSession();
                  router.replace(`/dashboard/practice/summary/${id}`);
                }
              }}
              className="mt-2 w-full max-w-xs"
            >
              {currentModule ? "Start Next Module" : "Finish Practice"}
            </Button>
          </div>
        ) : currentModule ? (
          // 🏃‍♂️ Normal In-Progress View
          <>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">{currentModule.module}</h3>
              <SkipModuleButton />
            </div>

            {typeof currentIndex === "number" && (
              <div className="transition-all duration-500">
                <Progress value={moduleProgress(currentIndex)} />
              </div>
            )}
            {typeof currentIndex === "number" && (
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <p>Stay focused. Move on when ready!</p>
                <span>{Math.floor(moduleProgress(currentIndex))}%</span>
              </div>
            )}
          </>
        ) : null}
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="flex justify-center mt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              usePracticeStore.getState().autoCompleteModule();
            }}
            className="text-red-500 border border-red-300 hover:bg-red-50"
          >
            ⏱️ Dev: Auto-Complete Current Module
          </Button>
        </div>
      )}

      {/* Metronome */}
      <Metronome />
    </div>
  );
}

function SkipModuleButton() {
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const finishModule = usePracticeStore((s) => s.finishModule);

  return (
    <Dialog open={showFinishConfirm} onOpenChange={setShowFinishConfirm}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Finish Module
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Finish Module Early?
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Are you sure you want to finish this module? You’ll be paused after
          skipping.
        </DialogDescription>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setShowFinishConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              finishModule();
              setShowFinishConfirm(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
