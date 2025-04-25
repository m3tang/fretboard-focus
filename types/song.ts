// types/song.ts

export type SongStatus = "want-to-learn" | "learning" | "learned";

export type Song = {
  id: string;
  name: string;
  artist?: string;
  status: SongStatus;
  isCustom: boolean; // true = user-added, false = app-suggested
};
