// utils/data/fetchPracticeSessionDetail.ts
import { db } from "@/utils/drizzle/db";
import {
  practiceSessions,
  practiceSessionModules,
  practiceSessionExercises,
  exercises,
  modules,
} from "@/utils/drizzle/schema";
import { eq, inArray } from "drizzle-orm";

export type PracticeExercise = {
  name: string;
  duration: number;
  orderIndex: number;
};

export type PracticeModule = {
  id: string;
  moduleName: string;
  duration: number;
  orderIndex: number;
  exercises: PracticeExercise[];
};

export type PracticeSessionDetail = {
  id: string;
  name: string;
  startTime: number; // seconds since epoch
  duration: number;
  modules: PracticeModule[];
};

export async function fetchPracticeSessionDetail(
  sessionId: string
): Promise<PracticeSessionDetail> {
  // Fetch the session
  const [session] = await db
    .select()
    .from(practiceSessions)
    .where(eq(practiceSessions.id, sessionId));

  if (!session) throw new Error("Practice session not found");

  // Fetch session modules with module names
  const moduleRows = await db
    .select({
      id: practiceSessionModules.id,
      moduleName: modules.name,
      duration: practiceSessionModules.duration,
      orderIndex: practiceSessionModules.order_index,
    })
    .from(practiceSessionModules)
    .innerJoin(modules, eq(practiceSessionModules.module_id, modules.id))
    .where(eq(practiceSessionModules.session_id, sessionId));

  const moduleSessionIds = moduleRows.map((m) => m.id);

  // Fetch exercises tied to the module sessions
  const exerciseRows = await db
    .select({
      moduleSessionId: practiceSessionExercises.module_session_id,
      exerciseName: exercises.name,
      duration: practiceSessionExercises.duration,
      orderIndex: practiceSessionExercises.order_index,
    })
    .from(practiceSessionExercises)
    .innerJoin(
      exercises,
      eq(practiceSessionExercises.exercise_id, exercises.id)
    )
    .where(
      inArray(practiceSessionExercises.module_session_id, moduleSessionIds)
    );

  // Group exercises under each module
  const moduleMap: Record<string, PracticeModule> = {};
  for (const mod of moduleRows) {
    moduleMap[mod.id] = {
      ...mod,
      exercises: [],
    };
  }

  for (const ex of exerciseRows) {
    moduleMap[ex.moduleSessionId]?.exercises.push({
      name: ex.exerciseName,
      duration: ex.duration,
      orderIndex: ex.orderIndex,
    });
  }

  return {
    id: session.id,
    name: session.name,
    startTime: session.start_time,
    duration: session.duration,
    modules: Object.values(moduleMap).sort(
      (a, b) => a.orderIndex - b.orderIndex
    ),
  };
}
