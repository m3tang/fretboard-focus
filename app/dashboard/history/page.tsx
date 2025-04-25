"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function PracticeHistoryPage() {
  return (
    <div className="p-6">
      <DashboardHeader
        title="Practice History"
        subtitle="Review your past practice sessions and milestones."
      />

      <div className="mt-6">
        {/* Session list, filters, and history charts will go here */}
        <p className="text-muted-foreground">Practice history coming soon!</p>
      </div>
    </div>
  );
}
