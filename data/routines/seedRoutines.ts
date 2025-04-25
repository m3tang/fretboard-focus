import { db } from "@/utils/drizzle/db";
import { routines as routinesTable } from "@/utils/drizzle/schema";
import { routines } from "./routines"; // your array of Routine objects
import { eq } from "drizzle-orm";

export async function seedRoutines() {
  console.log("🌱 Seeding routines...");

  // Delete all non-custom routines first
  await db.delete(routinesTable).where(eq(routinesTable.isCustom, false));

  // Insert the seed routines
  await db.insert(routinesTable).values(routines);

  console.log("✅ Routines seeded successfully!");
}
