import { getCurrentUserId } from "@/lib/auth";
import { fetchDashboardStats } from "@/utils/data/fetchDashboardStats";
import { fetchPracticeChartData } from "@/utils/data/fetchPracticeChartData";
import { fetchPracticeSessionsList } from "@/utils/data/fetchPracticeSessionList";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const userId = await getCurrentUserId();
  const [sessions, stats, chartData] = await Promise.all([
    fetchPracticeSessionsList(userId),
    fetchDashboardStats(userId),
    fetchPracticeChartData(userId),
  ]);

  return <HomeClient sessions={sessions} stats={stats} chartData={chartData} />;
}
