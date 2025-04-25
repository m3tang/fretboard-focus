// types/routine.ts

import { ModuleName } from "@/types/modules";

export type Routine = {
  id: string;
  name: string;
  description?: string;
  duration: number; // minutes
  modules: ModuleName[]; // e.g., ["Warmup", "Technique"]
  isCustom: boolean; // true = user-created, false = app-provided
};
