// stores/songStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Song } from "@/types/song";
import { defaultSongs } from "@/data/defaults/defaultSongs"; // you'll create a starter list

interface SongStore {
  songs: Song[];
  initialized: boolean;
  addSong: (song: Song) => void;
  updateSong: (id: string, updates: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  getSongById: (id: string) => Song | undefined;
  initDefaultSongs: () => void;
}

export const useSongStore = create<SongStore>()(
  persist(
    (set, get) => ({
      songs: [],
      initialized: false,

      addSong: (song) =>
        set((state) => ({
          songs: [...state.songs, song],
        })),

      updateSong: (id, updates) =>
        set((state) => ({
          songs: state.songs.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteSong: (id) =>
        set((state) => ({
          songs: state.songs.filter((s) => s.id !== id),
        })),

      getSongById: (id) => {
        return get().songs.find((s) => s.id === id);
      },

      initDefaultSongs: () => {
        const { initialized, songs } = get();
        if (!initialized && songs.length === 0) {
          set({
            songs: defaultSongs,
            initialized: true,
          });
        }
      },
    }),
    {
      name: "song-bank",
    }
  )
);
