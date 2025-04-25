// data/defaultSongs.ts

import { Song } from "@/types/song";

export const defaultSongs: Song[] = [
  {
    id: "song-blackbird",
    name: "Blackbird",
    artist: "The Beatles",
    status: "want-to-learn",
    isCustom: false,
  },
  {
    id: "song-wonderwall",
    name: "Wonderwall",
    artist: "Oasis",
    status: "learning",
    isCustom: false,
  },
  {
    id: "song-tears-in-heaven",
    name: "Tears in Heaven",
    artist: "Eric Clapton",
    status: "learned",
    isCustom: false,
  },
];
