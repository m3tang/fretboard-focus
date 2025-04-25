"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Metronome from "@/components/Metronome";
import { DialogTitle } from "@radix-ui/react-dialog";
import { use } from "react";

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
  } = usePracticeStore();

  const handleFinish = () => {
    router.replace(`/dashboard/practice/summary/${id}`);
  };

  // Timer: ticks every second when not paused
  useEffect(() => {
    if (!session) {
      handleFinish();
      return;
    }

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [session, tick, router]);

  if (!session) return null;

  const isFinished = elapsedSeconds >= session.duration * 60;
  const currentIndex = currentModuleIndex();
  const currentModule = session.modules[currentIndex];

  if (isFinished) {
    handleFinish();
    return null;
  }

  return (
    <div className="p-6 w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="text-3xl font-bold">{session.name}</h2>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Control buttons */}
        <div className="flex flex-row gap-3">
          {/* Pause / Resume */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => (isPaused ? resume() : pause())}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </div>

          {/* End session */}
          <div className="flex justify-center">
            <Button variant="default" onClick={handleFinish}>
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="w-full">
        <Progress value={overallProgress()} />
        <p className="text-sm text-muted-foreground mt-1 text-right">
          {Math.floor(elapsedSeconds / 60)} / {session.duration} min
        </p>
      </div>

      {/* Modules Row */}
      <div className="flex gap-2 overflow-x-auto">
        {session.modules.map((module, index) => (
          <div
            key={module}
            className={`p-3 rounded-md text-sm font-medium border w-full text-center ${
              index === currentIndex
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {module}
          </div>
        ))}
      </div>

      {/* Module content and progress */}
      <div className="p-4 border rounded-md bg-white">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">{currentModule}</span>

          <SkipModuleButton />
        </div>
        <Progress value={moduleProgress(currentIndex)} />

        <div className="flex justify-between items-center">
          <p className="mt-2 text-sm text-muted-foreground">
            Focus on this module. You can pause or skip below.
          </p>
          <span className="text-sm text-muted-foreground">
            {Math.floor(moduleProgress(currentIndex))}%
          </span>
        </div>
      </div>

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
        <Button variant="secondary">Finish Module</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Finish Module Early?
        </DialogTitle>

        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Are you sure you want to end this module and move on? This will pause
          your session.
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
