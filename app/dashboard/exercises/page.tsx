import { ExerciseDialogWithList } from "./ExerciseDialogueWithList";
import { fetchExercisesFromDb } from "@/utils/data/fetchExercises";

export default async function DashboardExercisesPage() {
  const exercisesFromDb = await fetchExercisesFromDb();

  return <ExerciseDialogWithList exercises={exercisesFromDb} />;
}
