export type Exercise = {
  id: string;
  name: string;
  description?: string;
  isCustom: boolean;
  modules: string[];
  userId?: string; // ← NEW: only present for custom exercises
};
