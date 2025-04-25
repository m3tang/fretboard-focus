import { ModuleName } from "./modules";

export type Routine = {
  id: string;
  name: string;
  description?: string;
  totalDuration: number; // total duration in minutes (sum of module durations)
  modules: RoutineModule[]; // new type below
  isCustom: boolean; // true = user-created, false = app-provided
};

export type RoutineModule = {
  module: ModuleName;
  duration: number; // minutes allocated to this module
};
