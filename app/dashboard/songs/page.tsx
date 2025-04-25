"use client";

import { useEffect } from "react";
import { useSongStore } from "@/utils/zustand/songStore";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function SongsPage() {
  const { songs, initDefaultSongs } = useSongStore();

  useEffect(() => {
    initDefaultSongs();
  }, [initDefaultSongs]);

  return (
    <div>
      <DashboardHeader
        title="Songs"
        subtitle="Track the songs you're learning, want to learn, or have learned."
      />

      <div className="grid gap-4">
        {songs.length === 0 ? (
          <p className="text-muted-foreground">No songs added yet.</p>
        ) : (
          <ul className="grid gap-4">
            {songs.map((song) => (
              <li
                key={song.id}
                className="border rounded-xl p-4 shadow-sm bg-background"
              >
                <h3 className="text-lg font-semibold">{song.name}</h3>
                {song.artist && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {song.artist}
                  </p>
                )}
                <div className="mt-2 text-xs text-muted-foreground capitalize">
                  Status: {song.status.replace("-", " ")}
                </div>
                {song.isCustom && (
                  <span className="mt-2 block text-xs font-medium text-green-600">
                    Custom Song
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
