import { db } from "@/utils/drizzle/db";
import { practiceSessions } from "@/utils/drizzle/schema";
import { and, desc, gte } from "drizzle-orm";

export type DashboardStats = {
  totalHours: number;
  hoursLast7Days: number;
  lastPracticeTime: number | null;
  weeklyStreak: number;
};

function getStartOfDayTimestamp(daysAgo: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return Math.floor(date.getTime() / 1000); // seconds since epoch
}

export async function fetchDashboardStats(
  userId: string
): Promise<DashboardStats> {
  // Get all sessions for the user
  const sessions = await db
    .select({
      id: practiceSessions.id,
      startTime: practiceSessions.start_time,
      duration: practiceSessions.duration,
    })
    .from(practiceSessions)
    .where(
      and(
        // You can add a user ID check if sessions are user-scoped
        // eq(practiceSessions.user_id, userId),
        gte(practiceSessions.start_time, getStartOfDayTimestamp(30)) // limit to past ~month for perf
      )
    )
    .orderBy(desc(practiceSessions.start_time));

  let totalSeconds = 0;
  let secondsLast7Days = 0;
  let lastPracticeTime: number | null = null;
  const practicedDates = new Set<number>(); // YYYYMMDD

  const startOf7DaysAgo = getStartOfDayTimestamp(7);

  for (const session of sessions) {
    totalSeconds += session.duration;
    if (session.startTime >= startOf7DaysAgo) {
      secondsLast7Days += session.duration;
    }

    const dateKey = new Date(session.startTime * 1000)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, ""); // e.g. 20250527
    practicedDates.add(Number(dateKey));

    if (!lastPracticeTime) {
      lastPracticeTime = session.startTime;
    }
  }

  // Calculate weekly streak (past 7 days, including today)
  let streak = 0;
  for (let i = 0; i < 7; i++) {
    const dateKey = new Date(getStartOfDayTimestamp(i) * 1000)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    if (practicedDates.has(Number(dateKey))) {
      streak++;
    } else {
      break;
    }
  }

  return {
    totalHours: Math.floor(totalSeconds / 3600),
    hoursLast7Days: Math.floor(secondsLast7Days / 3600),
    lastPracticeTime,
    weeklyStreak: streak,
  };
}
