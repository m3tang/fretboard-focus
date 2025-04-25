// /utils/data/fetchRoutines.ts
"use server";

import { db } from "@/utils/drizzle/db";
import { routines as routinesTable } from "@/utils/drizzle/schema";
import { Routine, RoutineModule } from "@/types/routine";

export async function fetchRoutinesFromDb(): Promise<Routine[]> {
  const results = await db.select().from(routinesTable);

  const parsedResults: Routine[] = results.map((routine) => ({
    id: routine.id,
    name: routine.name,
    description: routine.description ?? undefined,
    totalDuration: routine.totalDuration,
    modules: routine.modules as RoutineModule[], // because it's stored as JSONB
    isCustom: routine.isCustom,
  }));

  return parsedResults;
}
