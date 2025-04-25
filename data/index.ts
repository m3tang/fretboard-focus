import { seedExercises } from "./exercises/seedExercises";

async function main() {
  console.log("🌱 Starting full seeding process...");

  await seedExercises();

  console.log("✅ All seeds completed.");
}

// Actually run it
main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
