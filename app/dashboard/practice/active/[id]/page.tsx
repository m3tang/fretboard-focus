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
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Circle } from "lucide-react";

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
    currentExerciseState, // ← new
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

  const currentIndex = currentModuleIndex() ?? -1;
  const currentModule =
    currentIndex !== null ? session.modules[currentIndex] : null;

  const moduleElapsedSeconds =
    elapsedSeconds + manualProgressSeconds - moduleStartSeconds;

  const currentExercise =
    currentModule?.exercises?.[session.currentExerciseIndex] ?? null;

  const exerciseProgress = currentExercise
    ? (moduleElapsedSeconds / currentExercise.computedDuration) * 100
    : 0;

  // 🔄 Accordion control logic
  const [openModuleId, setOpenModuleId] = useState<string | undefined>(
    session.modules[0]?.id
  );
  const [lastModuleIndex, setLastModuleIndex] = useState(
    session.currentModuleIndex
  );

  useEffect(() => {
    const newIndex = session.currentModuleIndex;
    const newId = session.modules[newIndex]?.id;

    if (newIndex !== lastModuleIndex) {
      setOpenModuleId(newId);
      setLastModuleIndex(newIndex);
    }
  }, [session.currentModuleIndex, session.modules, lastModuleIndex]);

  const exerciseButtonLabel =
    currentExerciseState === "not-started"
      ? "Start"
      : currentExerciseState === "active"
        ? "Pause"
        : "Resume";

  const handleExerciseControl = () => {
    if (
      currentExerciseState === "not-started" ||
      currentExerciseState === "paused"
    ) {
      resume();
    } else {
      pause();
    }
  };

  return (
    <div className="flex flex-row w-full h-full p-6 mx-auto gap-6 transition">
      {/* Sidebar: Full Routine */}
      <div className="w-1/4 pr-4 overflow-y-auto max-h-[80vh]">
        <div className="space-y-6">
          <Card className="p-10">
            <h4 className="text-xl font-semibold tracking-wide">
              Beginner Essentials
            </h4>
            <h3 className="text-sm text-muted-foreground mb-4">
              Master the fundamentals
            </h3>

            <Accordion
              type="single"
              collapsible
              value={openModuleId}
              onValueChange={setOpenModuleId}
              className="w-full"
            >
              {session.modules.map((mod, modIdx) => {
                const isCurrentModule = modIdx === currentIndex;

                return (
                  <AccordionItem
                    key={mod.id}
                    value={mod.id}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className={`text-sm font-medium px-2 py-2 rounded-md hover:bg-muted transition ${
                        isCurrentModule ? "text-primary" : ""
                      }`}
                    >
                      {mod.module}
                    </AccordionTrigger>

                    <AccordionContent className="mt-2 space-y-2 pl-2">
                      <ul className="space-y-1">
                        {(mod.exercises ?? []).map((ex, exIdx) => {
                          const isCurrentExercise =
                            isCurrentModule &&
                            exIdx === session.currentExerciseIndex;
                          const isCompleted =
                            modIdx < currentIndex ||
                            (isCurrentModule &&
                              exIdx < session.currentExerciseIndex);

                          return (
                            <li
                              key={ex.id}
                              className={`flex justify-between items-center gap-2 rounded-md px-2 py-1 ${
                                isCurrentExercise
                                  ? "text-primary font-semibold"
                                  : isCompleted
                                    ? "text-muted-foreground"
                                    : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <CheckCircle className="text-green-500 w-4 h-4" />
                                ) : (
                                  <Circle className="text-muted-foreground w-4 h-4" />
                                )}
                                <span>{ex.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatMMSS(ex.computedDuration)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {/* Skip Module + Controls */}
            <div className="flex flex-col gap-5 mt-6">
              <SkipModuleButton moduleName={currentModule?.module ?? null} />
              <Button onClick={handleFinish}>End Session</Button>
            </div>
          </Card>
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
            <Button variant="outline" onClick={handleExerciseControl}>
              {exerciseButtonLabel}
            </Button>
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

  const canSkip = !!session;

  const isLastExercise =
    session &&
    session.currentModuleIndex < session.modules.length &&
    session.currentExerciseIndex + 1 >=
      session.modules[session.currentModuleIndex].exercises!.length;

  return (
    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogTrigger asChild>
        <Button variant="ghost" disabled={!canSkip}>
          Skip exercise→
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
              nextExercise(); // this will either go to next or finish module
              setShowConfirm(false);
            }}
          >
            {isLastExercise ? "Finish Module →" : "Skip Exercise →"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SkipModuleButton({ moduleName }: { moduleName: string | null }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const finishModule = usePracticeStore((s) => s.finishModule);

  const label = moduleName ? `Skip ${moduleName}` : "Skip Current Module";

  return (
    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Skip {moduleName}?
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
