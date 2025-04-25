"use server"; // ← this tells Next.js this is server-only

import { db } from "@/utils/drizzle/db";
import { exercises as exercisesTable } from "@/utils/drizzle/schema";
import { Exercise } from "@/types/exercise";
import { MODULES, ModuleName } from "@/types/modules";

export async function fetchExercisesFromDb(): Promise<Exercise[]> {
  const results = await db.select().from(exercisesTable);

  const parsedResults: Exercise[] = results.map((ex) => ({
    id: ex.id,
    name: ex.name,
    description: ex.description ?? undefined,
    isCustom: ex.isCustom,
    modules: ex.modules as ModuleName[],
    userId: ex.userId ?? undefined,
  }));

  return parsedResults;
}
