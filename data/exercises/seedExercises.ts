import { db } from "@/utils/drizzle/db";
import { exercises as exercisesTable } from "@/utils/drizzle/schema";
import { exercises } from "./exercises";
import { eq } from "drizzle-orm"; // ← ADD THIS!

export async function seedExercises() {
  console.log("🌱 Seeding exercises...");

  // Correct DELETE syntax
  await db.delete(exercisesTable).where(eq(exercisesTable.isCustom, false));

  // Then insert seed exercises
  await db.insert(exercisesTable).values(exercises);

  console.log("✅ Exercises seeded successfully!");
}
