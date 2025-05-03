import { db } from "@/utils/drizzle/db";
import {
  practiceSessions,
  practiceSessionModules,
  practiceSessionExercises,
  modules as modulesTable,
} from "@/utils/drizzle/schema";
import {
  LoggedPracticeSession,
  LoggedPracticeModule,
  LoggedPracticeExercise,
} from "@/types/practiceSession";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

/**
 * Persists a completed practice session to the database,
 * including its modules and exercises.
 */
export async function savePracticeSessionToDb(
  session: LoggedPracticeSession & {
    modules: (LoggedPracticeModule & { exercises: LoggedPracticeExercise[] })[];
    routineId?: string;
  }
) {
  if (!session) throw new Error("No session provided");
  if (!session.userId) throw new Error("Cannot save session without userId");

  const startTimeSeconds = Math.floor(Date.parse(session.startedAt) / 1000);
  const endTimeSeconds = session.endedAt
    ? Math.floor(Date.parse(session.endedAt) / 1000)
    : null;

  await db.transaction(async (tx) => {
    // 1. Save session
    await tx.insert(practiceSessions).values({
      id: session.id,
      user_id: session.userId,
      routine_id: session.routineId ?? null,
      name: session.name,
      duration: session.duration,
      start_time: startTimeSeconds,
      // Uncomment if end_time exists in your schema:
      // end_time: endTimeSeconds,
    });

    // 2. Save modules
    for (const mod of session.modules) {
      const moduleRecord = await tx
        .select()
        .from(modulesTable)
        .where(eq(modulesTable.name, mod.module))
        .limit(1);

      if (!moduleRecord[0]) {
        throw new Error(`Module not found: ${mod.module}`);
      }

      const moduleSessionId = crypto.randomUUID();

      await tx.insert(practiceSessionModules).values({
        id: moduleSessionId,
        session_id: session.id,
        module_id: moduleRecord[0].id,
        duration: mod.duration,
        order_index: mod.orderIndex,
      });

      // 3. Save exercises
      for (const ex of mod.exercises) {
        await tx.insert(practiceSessionExercises).values({
          id: crypto.randomUUID(),
          module_session_id: moduleSessionId,
          exercise_id: ex.exerciseId,
          duration: ex.duration,
          order_index: ex.orderIndex,
        });
      }
    }
  });
}
