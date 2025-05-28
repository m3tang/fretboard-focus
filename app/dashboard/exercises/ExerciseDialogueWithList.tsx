"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { NewExerciseForm } from "./NewExerciseForm";
import { Exercise } from "@/types/exercise";
import { ExerciseList } from "@/components/dashboard/exercises/exercise-list";
import { useToast } from "@/components/hooks/use-toast";
import { useExerciseStore } from "@/utils/zustand/exerciseStore";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export function ExerciseDialogWithList({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleExerciseCreated = async () => {
    try {
      await useExerciseStore.getState().refreshExercises(); // ✅ pulls fresh data into store
      toast({ title: "Exercise added" });
      setOpen(false);
    } catch {
      toast({ title: "Failed to refresh list", variant: "destructive" });
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <DashboardHeader
          title="Exercises"
          subtitle="Choose from preset options or create your own."
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Create Exercise
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Exercise</DialogTitle>
              <DialogDescription>
                Create a new exercise to add to your practice.
              </DialogDescription>
            </DialogHeader>
            <NewExerciseForm onCreate={handleExerciseCreated} />
          </DialogContent>
        </Dialog>
      </div>

      <ExerciseList exercises={exercises} />
    </>
  );
}
