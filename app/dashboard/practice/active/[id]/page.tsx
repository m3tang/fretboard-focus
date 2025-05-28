"use client";

import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Metronome from "@/components/Metronome";
import RoutineSidebar from "./RoutineSidebar";
import { SkipExerciseButton } from "./SkipExerciseButton";
import ExerciseLinks from "./ExerciseLinks";
import { Pen } from "lucide-react";
import { Card } from "@/components/ui/card";

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

  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [instructions, setInstructions] = useState("");

  const {
    session,
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
      <RoutineSidebar handleFinish={handleFinish} />

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Metronome */}
        {currentModule && <Metronome />}
        {/* Current Exercise */}
        <Card className="p-6 space-y-6">
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

              {/* Exercise Sections */}
              <div className="space-y-6">
                {/* Instructions */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Instructions
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setIsEditingInstructions((prev) => !prev)}
                    >
                      <Pen className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                  {isEditingInstructions ? (
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full p-2 text-sm border rounded-md bg-background"
                      rows={3}
                      placeholder="Write out instructions for this exercise..."
                    />
                  ) : (
                    <p
                      className={`text-sm text-muted-foreground whitespace-pre-wrap ${instructions ? "" : "italic"}`}
                    >
                      {instructions || "No instructions provided."}
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-2">
                  <ExerciseLinks />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Notes
                  </h4>
                  <textarea
                    className="w-full p-2 text-sm border rounded-md bg-background"
                    rows={3}
                    placeholder="Any thoughts or feedback on this exercise?"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 gap-2">
                <SkipExerciseButton />
                {currentExerciseState === "not-started" ? (
                  <Button
                    onClick={handleExerciseControl}
                    className="bg-primary text-white shadow-md hover:bg-primary/90 transition"
                  >
                    Start
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleExerciseControl}>
                    {exerciseButtonLabel}
                  </Button>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
