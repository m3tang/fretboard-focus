"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function ProgressPage() {
  return (
    <div className="p-6">
      <DashboardHeader
        title="Progress"
        subtitle="Track your practice time, session streaks, and overall growth."
      />

      <div className="mt-6">
        {/* Progress charts, stats, and achievements will go here */}
        <p className="text-muted-foreground">Progress tracking coming soon!</p>
      </div>
    </div>
  );
}
