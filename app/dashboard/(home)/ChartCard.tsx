"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  PieChart,
  Pie,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface ChartCardProps {
  pieChartData: {
    name: string;
    duration: number; // in seconds
    fill: string;
  }[];
  graphData: {
    day: string;
    [key: string]: number | string; // durations in seconds
  }[];
  totalSeconds: number;
}

// Helper to format seconds to Xh Ym
function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}min`;
}

export default function ChartCard({
  pieChartData,
  graphData,
  totalSeconds,
}: ChartCardProps) {
  const colorMap: Record<string, string> = pieChartData.reduce(
    (acc, mod) => {
      acc[mod.name] = mod.fill;
      return acc;
    },
    {} as Record<string, string>
  );

  // Pre-transform graphData to convert all durations from seconds → minutes
  const graphDataInMinutes = graphData.map((row) => {
    const newRow: Record<string, string | number> = { day: row.day };
    for (const key in row) {
      if (key !== "day") {
        const seconds = row[key];
        newRow[key] =
          typeof seconds === "number" ? Math.floor(seconds / 60) : seconds;
      }
    }
    return newRow;
  });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Practice Breakdown</CardTitle>
        <CardDescription>Last 7 Days by Module</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row gap-6 items-start py-8">
        {/* Bar Chart */}
        <div className="w-2/3 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graphDataInMinutes}>
              <XAxis dataKey="day" stroke="#888" />
              <YAxis
                stroke="#888"
                label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              {pieChartData.map((mod) => (
                <Bar
                  key={mod.name}
                  dataKey={mod.name}
                  stackId="a"
                  fill={colorMap[mod.name]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Pie Chart */}
        <div className="w-1/3 h-[300px] flex items-center justify-center">
          <ChartContainer config={{}} className="h-full w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieChartData}
                dataKey="duration"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {formatDuration(totalSeconds)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Practice
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 12% this week <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
