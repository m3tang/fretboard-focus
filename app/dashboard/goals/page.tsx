"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function GoalsPage() {
  return (
    <div className="p-6">
      <DashboardHeader
        title="Goals"
        subtitle="Set and track your personal practice goals."
      />

      <div className="mt-6">
        {/* Goal list, goal creation, and tracking UI will go here */}
        <p className="text-muted-foreground">Goals tracking coming soon!</p>
      </div>
    </div>
  );
}
