"use client";

import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { InputForm } from "./input-form"; // your form component
import { PracticePreview } from "./practice-preview"; // we'll make this next
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

function Content() {
  const { status } = usePracticeStore();
  if (status === "preview") {
    return <PracticePreview />;
  }

  return <InputForm />;
}

export default function PracticeStartPage() {
  return (
    <>
      <DashboardHeader title="Start Practice" subtitle="Let's get to work" />
      <Card className="p-5">
        <Content />
      </Card>
    </>
  );
}
