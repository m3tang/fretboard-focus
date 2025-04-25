import { seedExercises } from "./exercises/seedExercises";
import { seedRoutines } from "./routines/seedRoutines";

async function main() {
  await seedExercises();
  await seedRoutines();
}

main()
  .then(() => {
    console.log("🌱 All seeds completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
