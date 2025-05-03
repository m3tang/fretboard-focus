export type Routine = {
  id: string;
  name: string;
  description?: string;
  defaultDuration: number; // in seconds, used as baseline for scaling
  modules: RoutineModule[];
  isCustom: boolean;
};

export type RoutineModule = {
  id: string;
  module: string;
  weight: number;
  orderIndex: number;
  computedDuration: number; // ← add this
  exercises?: AssignedExercise[];
};

export type AssignedExercise = {
  id: string;
  name: string;
  weight: number;
  computedDuration: number; // runtime duration in seconds
};

export type RoutineModuleExercise = {
  id: string;
  moduleId: string;
  exerciseId: string;
  weight: number;
  orderIndex: number;
};
