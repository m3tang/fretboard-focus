"use client";

import { usePracticeStore } from "@/utils/zustand/practiceStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";
import { SkipModuleButton } from "./SkipModuleButton";

function formatMMSS(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RoutineSidebar({
  handleFinish,
}: {
  handleFinish: () => void;
}) {
  const { session, currentModuleIndex } = usePracticeStore();

  const currentIndex = currentModuleIndex() ?? -1;

  if (!session) return null;

  const currentModule = session.modules[currentIndex];

  return (
    <div className="w-1/3 pr-4 overflow-y-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-semibold">Beginner Essentials</h4>
          <p className="text-sm text-muted-foreground">
            {new Date(session.startTime).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <Accordion
          type="multiple"
          defaultValue={session.modules.map((m) => m.id)}
          className="w-full space-y-2"
        >
          {session.modules.map((mod, modIdx) => {
            const isCurrentModule = modIdx === currentIndex;
            return (
              <AccordionItem
                key={mod.id}
                value={mod.id}
                className="border rounded-md bg-background"
              >
                <AccordionTrigger
                  className={`px-4 py-3 text-sm font-medium border-b rounded-t-md hover:bg-accent transition ${
                    isCurrentModule ? "text-primary" : ""
                  }`}
                >
                  {mod.module}
                </AccordionTrigger>

                <AccordionContent className="bg-muted/5 px-4 py-2 rounded-b-md">
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
                          className={`flex justify-between items-center px-2 py-1 rounded-md ${
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

        <div className="flex flex-col gap-2 mt-6">
          <SkipModuleButton moduleName={currentModule?.module ?? null} />
          <Button variant="secondary" onClick={handleFinish}>
            End Session
          </Button>
        </div>
      </Card>
    </div>
  );
}
