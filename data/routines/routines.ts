import { Routine } from "@/types/routine";

export const routines: Routine[] = [
  {
    id: "routine-beginner",
    name: "Beginner Essentials",
    description: "Perfect starting routine to build core skills.",
    totalDuration: 30,
    modules: [
      { module: "Warmup", duration: 5 },
      { module: "Technique", duration: 10 },
      { module: "Chords", duration: 10 },
      { module: "Songs", duration: 5 },
    ],
    isCustom: false,
  },
  {
    id: "routine-speed",
    name: "Speed and Precision",
    description: "Focus on building speed and technical accuracy.",
    totalDuration: 45,
    modules: [
      { module: "Warmup", duration: 5 },
      { module: "Technique", duration: 20 },
      { module: "Scales", duration: 10 },
      { module: "Improvisation", duration: 10 },
    ],
    isCustom: false,
  },
  {
    id: "routine-jazz",
    name: "Jazz Practice",
    description: "Improve chord changes and improvisation.",
    totalDuration: 60,
    modules: [
      { module: "Chords", duration: 15 },
      { module: "Theory", duration: 15 },
      { module: "Improvisation", duration: 20 },
      { module: "Sight Reading", duration: 10 },
    ],
    isCustom: false,
  },
];
