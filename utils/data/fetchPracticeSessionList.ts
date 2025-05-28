// utils/data/fetchPracticeSessionsList.ts
import { db } from "@/utils/drizzle/db";
import { practiceSessions } from "@/utils/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export type PracticeSessionListItem = {
  id: string;
  name: string;
  duration: number;
  startTime: number; // seconds since epoch
};

export async function fetchPracticeSessionsList(
  userId: string
): Promise<PracticeSessionListItem[]> {
  const rows = await db
    .select({
      id: practiceSessions.id,
      name: practiceSessions.name,
      duration: practiceSessions.duration,
      startTime: practiceSessions.start_time,
    })
    .from(practiceSessions)
    .where(eq(practiceSessions.user_id, userId))
    .orderBy(desc(practiceSessions.start_time));

  return rows;
}
