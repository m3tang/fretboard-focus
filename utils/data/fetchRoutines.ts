"use server";

import { db } from "@/utils/drizzle/db";
import {
  routines as routinesTable,
  routineModules as routineModulesTable,
  modules as modulesTable,
  routineModuleExercises as routineModuleExercisesTable,
  exercises as exercisesTable,
} from "@/utils/drizzle/schema";
import { Routine, RoutineModule, AssignedExercise } from "@/types/routine";
import { eq, inArray } from "drizzle-orm";

export async function fetchRoutinesFromDb(): Promise<Routine[]> {
  const routines = await db.select().from(routinesTable);

  const routinesWithModules: Routine[] = await Promise.all(
    routines.map(async (routine) => {
      // Step 1: Fetch modules
      const joinedModules = await db
        .select({
          id: routineModulesTable.id,
          weight: routineModulesTable.weight,
          orderIndex: routineModulesTable.orderIndex,
          moduleName: modulesTable.name,
        })
        .from(routineModulesTable)
        .leftJoin(
          modulesTable,
          eq(routineModulesTable.moduleId, modulesTable.id)
        )
        .where(eq(routineModulesTable.routineId, routine.id))
        .orderBy(routineModulesTable.orderIndex);

      const moduleIds = joinedModules.map((mod) => mod.id);

      // Step 2: Fetch exercises by module_id
      const joinedExercises = await db
        .select({
          id: exercisesTable.id,
          name: exercisesTable.name,
          weight: routineModuleExercisesTable.weight,
          moduleId: routineModuleExercisesTable.moduleId,
          orderIndex: routineModuleExercisesTable.orderIndex,
        })
        .from(routineModuleExercisesTable)
        .innerJoin(
          exercisesTable,
          eq(routineModuleExercisesTable.exerciseId, exercisesTable.id)
        )
        .where(inArray(routineModuleExercisesTable.moduleId, moduleIds))
        .orderBy(
          routineModuleExercisesTable.moduleId,
          routineModuleExercisesTable.orderIndex
        );

      // Step 3: Group exercises by moduleId
      const exercisesByModule: Record<string, AssignedExercise[]> = {};
      for (const exercise of joinedExercises) {
        if (!exercisesByModule[exercise.moduleId]) {
          exercisesByModule[exercise.moduleId] = [];
        }

        exercisesByModule[exercise.moduleId].push({
          id: exercise.id,
          name: exercise.name,
          weight: exercise.weight,
          computedDuration: 0, // Will be set at runtime
        });
      }

      // Step 4: Map modules with attached exercises
      const parsedModules: RoutineModule[] = joinedModules.map((mod) => ({
        id: mod.id,
        module: mod.moduleName ?? "Unnamed Module",
        weight: mod.weight,
        orderIndex: mod.orderIndex,
        computedDuration: 0,
        exercises: exercisesByModule[mod.id] || [],
      }));

      return {
        id: routine.id,
        name: routine.name,
        description: routine.description ?? undefined,
        defaultDuration: routine.defaultDuration,
        modules: parsedModules,
        isCustom: routine.isCustom,
      };
    })
  );

  return routinesWithModules;
}
