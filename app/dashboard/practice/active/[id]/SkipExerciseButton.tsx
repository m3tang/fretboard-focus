import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { useState } from "react";

export function SkipExerciseButton() {
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
          Skip exercise →
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
