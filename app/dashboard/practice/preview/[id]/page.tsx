// app/dashboard/practice/preview/[id]/page.tsx
"use client";

import { useEffect } from "react";
import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { useRouter, useParams } from "next/navigation";
import { PracticePreview } from "./practice-preview"; // update path if needed
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function PracticePreviewPage() {
  const { session, status } = usePracticeStore();
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!session || session.id !== id || status !== "preview") {
      router.push("/dashboard/practice/start");
    }
  }, [session, id, router, status]);

  return (
    <>
      <DashboardHeader
        title="Routine Preview"
        subtitle="Review and start your practice"
      />
      <PracticePreview />
    </>
  );
}
