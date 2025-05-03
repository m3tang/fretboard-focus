// app/dashboard/practice/start/page.tsx
"use client";

import { InputForm } from "./input-form";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RoutinePicker } from "./routine-picker";

export default function PracticeStartPage() {
  return (
    <>
      <DashboardHeader title="Start Practice" subtitle="Let's get to work" />
      <Card className="p-5">
        <Tabs defaultValue="routine" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="routine">Your Routines</TabsTrigger>
            <TabsTrigger value="custom">Custom Routine</TabsTrigger>
          </TabsList>

          <TabsContent value="custom">
            <InputForm />
          </TabsContent>

          <TabsContent value="routine">
            <RoutinePicker />
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
