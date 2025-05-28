"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/components/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartCard from "./ChartCard";
import { PracticeSessionListTable } from "../history/PracticeSessionListTable";
import { PracticeSessionListItem } from "@/utils/data/fetchPracticeSessionList";
import { DashboardStats } from "@/utils/data/fetchDashboardStats";
import { fetchPracticeChartData } from "@/utils/data/fetchPracticeChartData";

interface HomeClientProps {
  sessions: PracticeSessionListItem[];
  stats: DashboardStats;
  chartData: Awaited<ReturnType<typeof fetchPracticeChartData>>;
}

export default function HomeClient({
  sessions,
  stats,
  chartData,
}: HomeClientProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("saved") === "1") {
      toast({
        title: "Session saved!",
        description: "Your practice session was successfully saved.",
      });
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Hours This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.hoursLast7Days}h
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Weekly Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.weeklyStreak} week{stats.weeklyStreak !== 1 ? "s" : ""}
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalHours}h
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">60%</CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Last Practice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {new Date(stats.lastPracticeTime! * 1000).toDateString()}
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex flex-row gap-10">
        <div className="w-3/5">
          <ChartCard
            pieChartData={chartData.pieChartData}
            graphData={chartData.graphData}
            totalSeconds={chartData.totalSeconds}
          />
        </div>

        {/* Recent Sessions */}
        <Card className="w-2/5">
          <CardHeader>
            <CardTitle>Recent Practice</CardTitle>
          </CardHeader>
          <div className="p-5">
            <PracticeSessionListTable sessions={sessions} isPreview={true} />
          </div>
        </Card>
      </div>
    </div>
  );
}
