"use client";

import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function PracticePreview() {
  const { session, startSession } = usePracticeStore();
  const router = useRouter();

  if (!session) return null; // defensive check

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{session.name}</h1>

      <div>
        <h2 className="text-lg font-semibold">Modules</h2>
        <ul className="list-disc list-inside">
          {session.modules.map((moduleObj) => (
            <li key={moduleObj.module}>
              {moduleObj.module} ({moduleObj.duration} min)
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => usePracticeStore.getState().setStatus("draft")}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            startSession();
            router.push(`/dashboard/practice/active/${session.id}`);
          }}
        >
          Start Session
        </Button>
      </div>
    </div>
  );
}
