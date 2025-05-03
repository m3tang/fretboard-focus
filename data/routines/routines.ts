import { Routine } from "@/types/routine";
import { nanoid } from "nanoid";

export const routines: Routine[] = [
  {
    id: "routine-beginner",
    name: "Beginner Essentials",
    description: "Perfect starting routine to build core skills.",
    defaultDuration: 30 * 60, // 30 minutes in seconds
    isCustom: false,
    modules: [
      {
        id: nanoid(),
        module: "Warmup",
        weight: 1,
        orderIndex: 0,
        computedDuration: 0, // will be computed at runtime
      },
      {
        id: nanoid(),
        module: "Technique",
        weight: 2,
        orderIndex: 1,
        computedDuration: 0,
      },
      {
        id: nanoid(),
        module: "Chords",
        weight: 2,
        orderIndex: 2,
        computedDuration: 0,
      },
      {
        id: nanoid(),
        module: "Songs",
        weight: 1,
        orderIndex: 3,
        computedDuration: 0,
      },
    ],
  },
  {
    id: "routine-speed",
    name: "Speed and Precision",
    description: "Focus on building speed and technical accuracy.",
    defaultDuration: 45 * 60, // 45 minutes in seconds
    isCustom: false,
    modules: [
      {
        id: nanoid(),
        module: "Warmup",
        weight: 1,
        orderIndex: 0,
        computedDuration: 0,
      },
      {
        id: nanoid(),
        module: "Technique",
        weight: 4,
        orderIndex: 1,
        computedDuration: 0,
      },
      {
        id: nanoid(),
        module: "Scales",
        weight: 2,
        orderIndex: 2,
        computedDuration: 0,
      },
      {
        id: nanoid(),
        module: "Improvisation",
        weight: 2,
        orderIndex: 3,
        computedDuration: 0,
      },
    ],
  },
  {
    id: "routine-jazz",
    name: "Jazz Practice",
    description: "Improve chord changes and improvisation.",
    defaultDuration: 60 * 60, // 60 minutes in seconds
    isCustom: false,
    modules: [
      {
        id: nanoid(),
        module: "Chords",
        weight: 3,
        orderIndex: 0,
        computedDuration: 0,
      },
      {
        id: nanoid(),
        module: "Theory",
        weight: 3,
        orderIndex: 1,
        computedDuration: 0,
      },
      {
        id: nanoid(),
        module: "Improvisation",
        weight: 4,
        orderIndex: 2,
        computedDuration: 0,
      },
      {
        id: nanoid(),
        module: "Sight Reading",
        weight: 2,
        orderIndex: 3,
        computedDuration: 0,
      },
    ],
  },
];
