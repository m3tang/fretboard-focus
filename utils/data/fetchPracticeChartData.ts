import { db } from "@/utils/drizzle/db";
import {
  practiceSessions,
  practiceSessionModules,
  modules,
} from "@/utils/drizzle/schema";
import { gte, eq, and } from "drizzle-orm";
import { startOfDay, subDays, format } from "date-fns";

// Pie slice
export type PieChartDataItem = {
  name: string;
  duration: number;
  fill: string;
};

// Bar stack for each day
export type BarChartDataItem = {
  day: string; // "Mon", "Tue", etc.
  [moduleName: string]: string | number;
};

export async function fetchPracticeChartData(userId: string) {
  const sevenDaysAgo = Math.floor(subDays(new Date(), 7).getTime() / 1000);

  // Step 1: get sessions in last 7 days
  const sessions = await db
    .select({
      id: practiceSessions.id,
      startTime: practiceSessions.start_time,
    })
    .from(practiceSessions)
    .where(
      and(
        // eq(practiceSessions.user_id, userId), // if scoped
        gte(practiceSessions.start_time, sevenDaysAgo)
      )
    );

  const sessionIds = sessions.map((s) => s.id);
  if (sessionIds.length === 0)
    return { pieChartData: [], graphData: [], totalSeconds: 0 };

  // Step 2: get all module entries for those sessions
  const moduleData = await db
    .select({
      moduleName: modules.name,
      duration: practiceSessionModules.duration,
      startTime: practiceSessions.start_time,
    })
    .from(practiceSessionModules)
    .innerJoin(modules, eq(practiceSessionModules.module_id, modules.id))
    .innerJoin(
      practiceSessions,
      eq(practiceSessionModules.session_id, practiceSessions.id)
    )
    .where(
      and(
        // eq(practiceSessions.user_id, userId),
        gte(practiceSessions.start_time, sevenDaysAgo)
      )
    );

  // Step 3: reduce to pie and bar chart data
  const pieMap: Record<string, number> = {};
  const barMap: Record<string, Record<string, number>> = {}; // date -> module -> minutes
  let totalSeconds = 0;

  for (const row of moduleData) {
    const { moduleName, duration, startTime } = row;
    const dateKey = format(new Date(startTime * 1000), "EEE"); // e.g., "Mon"

    pieMap[moduleName] = (pieMap[moduleName] || 0) + duration;

    if (!barMap[dateKey]) barMap[dateKey] = {};
    barMap[dateKey][moduleName] = (barMap[dateKey][moduleName] || 0) + duration;

    totalSeconds += duration;
  }

  const colorPalette = [
    "--chart-1",
    "--chart-2",
    "--chart-3",
    "--chart-4",
    "--chart-5",
    "--chart-6",
  ];

  const moduleNames = Object.keys(pieMap);
  const pieChartData: PieChartDataItem[] = moduleNames.map((name, index) => ({
    name,
    duration: pieMap[name],
    fill: `hsl(var(${colorPalette[index % colorPalette.length]}))`,
  }));

  const graphData: BarChartDataItem[] = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i); // oldest to newest
    const dayLabel = format(date, "EEE"); // "Mon", "Tue"
    const modules = barMap[dayLabel] || {};
    return { day: dayLabel, ...modules };
  });

  return {
    pieChartData,
    graphData,
    totalSeconds,
  };
}
