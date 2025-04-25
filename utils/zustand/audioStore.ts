import { create } from "zustand";
import * as Tone from "tone";

type AudioStore = {
  hasStarted: boolean;
  player: Tone.Player | null;
  unlock: () => Promise<Tone.Player>;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  hasStarted: false,
  player: null,

  unlock: async () => {
    const { hasStarted, player } = get();

    if (hasStarted && player?.loaded) {
      return player;
    }

    await Tone.start();

    const newPlayer = new Tone.Player("/sounds/metronome.mp3").toDestination();

    // Wait until it's fully loaded before proceeding
    await new Promise<void>((resolve) => {
      const checkLoaded = () => {
        if (newPlayer.loaded) {
          resolve();
        } else {
          setTimeout(checkLoaded, 10);
        }
      };
      checkLoaded();
    });

    set({ player: newPlayer, hasStarted: true });
    return newPlayer;
  },
}));
