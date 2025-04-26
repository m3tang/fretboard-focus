"use client";

import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { use } from "react";

export default function SessionSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const { session, clearSession } = usePracticeStore();

  // If session not found (user refreshed, etc.), you could redirect or show a fallback
  if (!session || session.id !== id) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Session not found</h2>
        <Button onClick={() => router.push("/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const totalMinutes = Math.floor(session.duration);

  return (
    <div className="flex flex-col items-center p-8 space-y-6 max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Practice Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">{session.name}</h3>
            <p className="text-muted-foreground">
              Total Time: {totalMinutes} minutes
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-semibold">Modules Practiced:</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              {session.modules.map((moduleObj) => (
                <li key={moduleObj.module}>
                  {moduleObj.module} — {moduleObj.duration} min
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                clearSession();
                router.push("/dashboard");
              }}
            >
              Discard
            </Button>
            <Button
              onClick={() => {
                clearSession();
                // write to database
                router.push("/dashboard");
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
