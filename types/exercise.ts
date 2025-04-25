import { ModuleName } from "./modules";

export type Exercise = {
  id: string;
  name: string;
  description?: string;
  isCustom: boolean;
  modules: ModuleName[];
  userId?: string; // ← NEW: only present for custom exercises
};
