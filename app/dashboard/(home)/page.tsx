"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { toast } from "@/components/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartCard from "./ChartCard";

const stats = [
  { label: "Hours This Week", value: "3h 45m" },
  { label: "Weekly Streak", value: "4 days" },
  { label: "Total Hours", value: "27h 10m" },
  { label: "Goal", value: "60%" },
  { label: "Practiced Today", value: "✅" },
];

const recentSessions = [
  {
    id: "session-1",
    name: "Morning Routine",
    date: "May 1",
    duration: "35m",
    modules: ["Warmup", "Technique", "Songs"],
  },
  {
    id: "session-2",
    name: "Evening Practice",
    date: "Apr 30",
    duration: "45m",
    modules: ["Chords", "Improvisation"],
  },
];

export default function Home() {
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
      <DashboardHeader
        title="Home"
        subtitle="Welcome back to your practice dashboard"
      />

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {stat.value}
            </CardContent>
          </Card>
        ))}
      </div>

      <ChartCard />

      {/* Recent Sessions */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Sessions</h3>
        <div className="space-y-2">
          {recentSessions.map((s) => (
            <Card key={s.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-base">{s.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {s.date} • {s.duration} • {s.modules.join(", ")}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
