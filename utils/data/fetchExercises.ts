"use server";

import { db } from "@/utils/drizzle/db";
import {
  exercises as exercisesTable,
  modules as modulesTable,
} from "@/utils/drizzle/schema";
import { Exercise } from "@/types/exercise";
import { inArray } from "drizzle-orm";

export async function fetchExercisesFromDb(): Promise<Exercise[]> {
  const exercises = await db.select().from(exercisesTable);

  // Gather all unique module IDs from all exercises
  const allModuleIds = [...new Set(exercises.flatMap((ex) => ex.modules))];

  // Fetch all matching modules
  const modules = await db
    .select({ id: modulesTable.id, name: modulesTable.name })
    .from(modulesTable)
    .where(inArray(modulesTable.id, allModuleIds));

  // Create a lookup table { module_id: name }
  const moduleMap = Object.fromEntries(
    modules.map((mod) => [mod.id, mod.name])
  );

  // Convert exercises.modules from [id, id] → [name, name]
  const parsedResults: Exercise[] = exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    description: ex.description ?? undefined,
    isCustom: ex.isCustom,
    userId: ex.userId ?? undefined,
    modules: ex.modules.map((id) => moduleMap[id] ?? id), // fallback to id if name not found
  }));

  return parsedResults;
}
