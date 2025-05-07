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

const pieChartData = [
  { name: "Warmup", duration: 75, fill: "hsl(var(--chart-1))" },
  { name: "Scales", duration: 15, fill: "hsl(var(--chart-2))" },
  { name: "Technique", duration: 20, fill: "hsl(var(--chart-3))" },
  { name: "Chords", duration: 25, fill: "hsl(var(--chart-4))" },
  { name: "Improvisation", duration: 15, fill: "hsl(var(--chart-5))" },
  { name: "Songs", duration: 10, fill: "hsl(var(--chart-6))" },
];

const graphData = [
  { day: "Mon", Warmup: 10, Scales: 5 },
  { day: "Tue", Warmup: 15, Chords: 10 },
  { day: "Wed", Technique: 20 },
  { day: "Thu", Scales: 10, Improvisation: 15 },
  { day: "Fri", Warmup: 5, Songs: 10 },
  { day: "Sat", Warmup: 0 },
  { day: "Sun", Warmup: 20, Chords: 15 },
];

const colorMap: Record<string, string> = pieChartData.reduce(
  (acc, mod) => {
    acc[mod.name] = mod.fill;
    return acc;
  },
  {} as Record<string, string>
);

export default function ChartCard() {
  const totalMinutes = pieChartData.reduce(
    (sum, item) => sum + item.duration,
    0
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Practice Breakdown</CardTitle>
        <CardDescription>Last 7 Days by Module</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row-reverse gap-6 items-start py-8">
        {/* Pie Chart */}
        <div className="flex-1 h-[300px] flex items-center justify-center">
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
                            {totalMinutes} min
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

        {/* Bar Chart */}
        <div className="flex-1 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graphData}>
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
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
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 12% this week <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
