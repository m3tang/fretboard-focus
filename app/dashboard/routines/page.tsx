export const dynamic = "force-dynamic";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { fetchRoutinesFromDb } from "@/utils/data/fetchRoutines";
import { RoutineList } from "@/components/dashboard/routines/routine-list"; // client component

export default async function RoutinesPage() {
  const routinesFromDb = await fetchRoutinesFromDb(); // always fresh from DB

  return (
    <div>
      <DashboardHeader
        title="Practice Routines"
        subtitle="View and manage your available routines."
      />
      <RoutineList routines={routinesFromDb} />
    </div>
  );
}
