import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { fetchRoutinesFromDb } from "@/utils/data/fetchRoutines";
import { RoutineList } from "@/components/dashboard/routines/routine-list"; // extracted below

export default async function RoutinesPage() {
  const routinesFromDb = await fetchRoutinesFromDb(); // server fetch

  console.log(routinesFromDb);

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
