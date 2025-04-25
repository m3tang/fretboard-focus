// data/defaultRoutines.ts

import { Routine } from "@/types/routine";

export const defaultRoutines: Routine[] = [
  {
    id: "routine-beginner-1",
    name: "Beginner Routine",
    description: "A basic warmup and technique builder for new players.",
    duration: 30,
    modules: ["Warmup", "Technique", "Scales"],
    isCustom: false,
  },
  {
    id: "routine-intermediate-1",
    name: "Intermediate Routine",
    description: "Expands into scales, rhythm, and light theory practice.",
    duration: 45,
    modules: ["Warmup", "Technique", "Scales", "Rhythm", "Theory"],
    isCustom: false,
  },
];
