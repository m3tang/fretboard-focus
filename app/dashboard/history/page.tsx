// app/(dashboard)/practice-history/page.tsx
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PracticeSessionListTable } from "./PracticeSessionListTable";
import { fetchPracticeSessionsList } from "@/utils/data/fetchPracticeSessionList";
import { getCurrentUserId } from "@/lib/auth";

export default async function PracticeHistoryPage() {
  const userId = await getCurrentUserId();
  const sessions = await fetchPracticeSessionsList(userId);

  return (
    <div>
      <DashboardHeader
        title="Practice History"
        subtitle="Review your past practice sessions and milestones."
      />
      <div className="mt-6">
        <PracticeSessionListTable sessions={sessions} />
      </div>
    </div>
  );
}
