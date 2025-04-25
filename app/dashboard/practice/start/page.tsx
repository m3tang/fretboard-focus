"use client";

import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { InputForm } from "./input-form";
import { PracticePreview } from "./practice-preview";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RoutinePicker } from "./routine-picker"; // we'll build this

function Content() {
  const { status } = usePracticeStore();

  if (status === "preview") {
    return <PracticePreview />;
  }

  return (
    <Tabs defaultValue="custom" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="custom">Build Your Own</TabsTrigger>
        <TabsTrigger value="routine">Your Routines</TabsTrigger>
      </TabsList>

      <TabsContent value="custom">
        <InputForm />
      </TabsContent>

      <TabsContent value="routine">
        <RoutinePicker />
      </TabsContent>
    </Tabs>
  );
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
