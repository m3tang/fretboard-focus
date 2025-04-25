import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { fetchExercisesFromDb } from "@/utils/data/fetchExercises";
import { Exercise } from "@/types/exercise";
import { ExerciseList } from "@/components/dashboard/exercises/exercise-list"; // We'll extract the list to a client component

export default async function DashboardExercisesPage() {
  const exercisesFromDb: Exercise[] = await fetchExercisesFromDb(); // server fetch

  return (
    <div className="p-6">
      <DashboardHeader
        title="Exercise Library"
        subtitle="View and manage exercises used across your practice modules."
      />

      {/* pass exercises to a client component */}
      <ExerciseList exercises={exercisesFromDb} />
    </div>
  );
}
