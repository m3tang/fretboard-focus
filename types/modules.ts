// List of all valid module names
export const MODULES = [
  "Warmup",
  "Technique",
  "Scales",
  "Chords",
  "Theory",
  "Songs",
  "Ear Training",
  "Improvisation",
  "Rhythm",
  "Sight Reading",
  "Recording Practice",
  "Performance Practice",
] as const;

// Type based on the array
export type ModuleName = (typeof MODULES)[number];
