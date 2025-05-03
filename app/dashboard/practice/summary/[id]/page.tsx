"use client";

import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { use, useState } from "react";
import { savePracticeSession } from "@/app/actions"; // your server action
import { toast } from "@/components/hooks/use-toast";

function formatMMSS(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SessionSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { session, clearSession } = usePracticeStore();
  const [hasNavigated, setHasNavigated] = useState(false);

  if (!session || session.id !== id) {
    if (hasNavigated) return null; // prevent flash of fallback

    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Session not found</h2>
        <Button onClick={() => router.push("/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const totalTime = formatMMSS(session.duration);
  const sessionDate = new Date(session.startTime).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="flex flex-col items-center p-6 max-w-2xl mx-auto space-y-6">
      <Card className="w-full shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🎉 Practice Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold">{session.name}</h3>
            <p className="text-muted-foreground text-sm">{sessionDate}</p>
            <p className="text-muted-foreground text-sm">
              Total Time: {totalTime}
            </p>
          </div>

          <Separator />

          {/* Modules + Exercises */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold">Modules Practiced</h4>
            <ul className="space-y-4">
              {session.modules.map((mod) => (
                <li key={mod.id}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{mod.module}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatMMSS(mod.computedDuration)}
                    </span>
                  </div>
                  {mod.exercises && mod.exercises?.length > 0 && (
                    <ul className="ml-4 mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                      {mod.exercises.map((ex) => (
                        <li key={ex.id} className="flex justify-between">
                          <span>{ex.name}</span>
                          <span className="text-xs">
                            {formatMMSS(ex.computedDuration)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setHasNavigated(true); // prevent fallback render
                clearSession();
                router.push("/dashboard");
              }}
            >
              Discard
            </Button>

            <Button
              onClick={async () => {
                try {
                  setHasNavigated(true);

                  const session = usePracticeStore.getState().session;
                  if (!session) throw new Error("No session to save");

                  const elapsed = usePracticeStore.getState().elapsedSeconds;
                  const manual =
                    usePracticeStore.getState().manualProgressSeconds;
                  const duration = elapsed + manual;

                  const payload = {
                    id: session.id,
                    userId: session.userId ?? "",
                    name: session.name,
                    duration,
                    startedAt: new Date(session.startTime).toISOString(),
                    endedAt: new Date().toISOString(),
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

                  await savePracticeSession(payload);

                  usePracticeStore.getState().clearSession();
                  router.push("/dashboard?saved=1");
                } catch (err) {
                  console.error("Failed to save session:", err);
                  toast({
                    title: "Error saving session",
                    description: "Something went wrong. Please try again.",
                  });
                }
              }}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
