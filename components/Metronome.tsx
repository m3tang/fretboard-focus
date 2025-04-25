"use client";

import { useMetronome } from "@/hooks/useMetronome";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Metronome = () => {
  const {
    isPlaying,
    bpm,
    setBpm,
    count,
    beatsPerMeasure,
    setBeatsPerMeasure,
    isLoading,
    handleStartStop,
  } = useMetronome();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Metronome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Button
            onClick={handleStartStop}
            disabled={isLoading}
            className={isPlaying ? "bg-red-500 hover:bg-red-600" : ""}
          >
            {isLoading ? "Loading..." : isPlaying ? "Stop" : "Start"}
          </Button>

          {/* BPM Slider */}
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="bpm">BPM: {bpm}</Label>
            <Slider
              id="bpm"
              min={40}
              max={240}
              step={1}
              value={[bpm]}
              onValueChange={(val) => setBpm(val[0])}
            />
          </div>

          {/* Beats per Measure */}
          <div className="w-full max-w-[180px] space-y-2">
            <Label>Beats per Measure</Label>
            <Select
              value={beatsPerMeasure.toString()}
              onValueChange={(val) => setBeatsPerMeasure(parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Beat Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-150 ${
                count === i && isPlaying ? "bg-blue-600 scale-125" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Metronome;
