import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { useAudioStore } from "@/utils/zustand/audioStore";

export const useMetronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [count, setCount] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  const loopRef = useRef<Tone.Loop | null>(null);
  const { unlock } = useAudioStore();
  const playerRef = useRef<Tone.Player | null>(null);

  const handleStartStop = async () => {
    if (isPlaying) {
      Tone.getTransport().stop();
      loopRef.current?.dispose();
      loopRef.current = null;
      setIsPlaying(false);
      setCount(0);
      return;
    }

    setIsLoading(true);

    try {
      const player = await unlock();
      playerRef.current = player;

      Tone.getTransport().bpm.value = bpm;
      setCount(0);

      let currentCount = 1;

      // Schedule first beat manually at start time
      Tone.getTransport().scheduleOnce((time) => {
        player.volume.value = -10;
        player.start(time);
        setCount(0); // Ensure visual starts with sound
      }, 0);

      // Schedule subsequent beats with the loop
      loopRef.current = new Tone.Loop((time) => {
        player.volume.value = currentCount % beatsPerMeasure === 0 ? -10 : -14;
        player.start(time);
        setCount(currentCount);
        currentCount = (currentCount + 1) % beatsPerMeasure;
      }, "4n").start("4n"); // Start AFTER the first beat

      Tone.getTransport().start("+0.05"); // Small buffer
      setIsPlaying(true);
    } catch (err) {
      console.error("Error starting metronome:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      Tone.getTransport().bpm.value = bpm;
    }
  }, [bpm, isPlaying]);

  useEffect(() => {
    return () => {
      loopRef.current?.dispose();
      playerRef.current?.dispose();
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
    };
  }, []);

  return {
    isPlaying,
    bpm,
    setBpm,
    count,
    beatsPerMeasure,
    setBeatsPerMeasure,
    isLoading,
    handleStartStop,
  };
};
