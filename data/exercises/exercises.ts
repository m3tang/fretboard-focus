import { Exercise } from "@/types/exercise";

export const exercises: Exercise[] = [
  {
    id: "ex-warmup-1",
    name: "Finger Stretch Warmup",
    description: "Start with gentle finger stretching and coordination warmup.",
    isCustom: false,
    modules: ["Warmup"],
  },
  {
    id: "ex-warmup-2",
    name: "Spider Walk",
    description:
      "Crawl fingers up and down the fretboard to warm up both hands.",
    isCustom: false,
    modules: ["Warmup", "Technique"],
  },
  {
    id: "ex-technique-1",
    name: "Alternate Picking",
    description: "Use a metronome to alternate pick on a single string.",
    isCustom: false,
    modules: ["Technique", "Warmup"],
  },
  {
    id: "ex-technique-2",
    name: "String Skipping Drill",
    description:
      "Practice jumping over strings cleanly with alternate picking.",
    isCustom: false,
    modules: ["Technique"],
  },
  {
    id: "ex-technique-3",
    name: "Hammer-Ons and Pull-Offs",
    description:
      "Strengthen fretting hand with smooth hammer-ons and pull-offs.",
    isCustom: false,
    modules: ["Technique"],
  },
  {
    id: "ex-scales-1",
    name: "Major Scale in C",
    description:
      "Play two octaves of the C Major scale using 3-notes-per-string.",
    isCustom: false,
    modules: ["Scales", "Technique"],
  },
  {
    id: "ex-scales-2",
    name: "Pentatonic Box 1",
    description: "Practice the first pentatonic box shape in A minor.",
    isCustom: false,
    modules: ["Scales"],
  },
  {
    id: "ex-scales-3",
    name: "Modes of the Major Scale",
    description:
      "Play Ionian, Dorian, and Phrygian modes across the fretboard.",
    isCustom: false,
    modules: ["Scales"],
  },
  {
    id: "ex-chords-1",
    name: "Open Chord Changes",
    description: "Practice clean transitions between G, C, D, and Em chords.",
    isCustom: false,
    modules: ["Chords"],
  },
  {
    id: "ex-chords-2",
    name: "Barre Chord Workout",
    description:
      "Strengthen your hand by moving barre chords up and down the neck.",
    isCustom: false,
    modules: ["Chords", "Technique"],
  },
  {
    id: "ex-chords-3",
    name: "Chord Inversions",
    description:
      "Practice playing root, first, and second inversions of basic chords.",
    isCustom: false,
    modules: ["Chords", "Theory"],
  },
  {
    id: "ex-theory-1",
    name: "Circle of Fifths Drill",
    description:
      "Memorize key signatures and their relationships with the Circle of Fifths.",
    isCustom: false,
    modules: ["Theory"],
  },
  {
    id: "ex-theory-2",
    name: "Triad Construction",
    description:
      "Build major, minor, and diminished triads on different root notes.",
    isCustom: false,
    modules: ["Theory"],
  },
  {
    id: "ex-theory-3",
    name: "Intervals on One String",
    description:
      "Practice identifying intervals (3rd, 5th, 7th) up a single string.",
    isCustom: false,
    modules: ["Theory", "Technique"],
  },
  {
    id: "ex-songs-1",
    name: "Smoke on the Water Riff",
    description:
      "Learn the classic riff from 'Smoke on the Water' by Deep Purple.",
    isCustom: false,
    modules: ["Songs"],
  },
  {
    id: "ex-songs-2",
    name: "Seven Nation Army Bassline",
    description:
      "Play the iconic bassline on guitar from 'Seven Nation Army' by The White Stripes.",
    isCustom: false,
    modules: ["Songs"],
  },
  {
    id: "ex-songs-3",
    name: "Wonderwall Strumming",
    description: "Practice strumming patterns from 'Wonderwall' by Oasis.",
    isCustom: false,
    modules: ["Songs", "Chords"],
  },
  {
    id: "ex-ear-1",
    name: "Single Note Ear Training",
    description: "Listen and guess single notes played randomly.",
    isCustom: false,
    modules: ["Ear Training"],
  },
  {
    id: "ex-ear-2",
    name: "Interval Ear Training",
    description:
      "Identify common intervals by ear: minor 3rd, perfect 5th, octave.",
    isCustom: false,
    modules: ["Ear Training", "Theory"],
  },
  {
    id: "ex-ear-3",
    name: "Chord Quality Recognition",
    description:
      "Differentiate between major, minor, and diminished chords by sound.",
    isCustom: false,
    modules: ["Ear Training"],
  },
  {
    id: "ex-technique-4",
    name: "Sweep Picking Basics",
    description: "Learn slow 3-string sweep picking arpeggios.",
    isCustom: false,
    modules: ["Technique"],
  },
  {
    id: "ex-warmup-3",
    name: "Speed Picking Warmup",
    description: "Gradually increase picking speed with a metronome.",
    isCustom: false,
    modules: ["Warmup", "Technique"],
  },
  {
    id: "ex-chords-4",
    name: "Power Chord Shifts",
    description: "Slide between power chords cleanly on different root notes.",
    isCustom: false,
    modules: ["Chords"],
  },
  {
    id: "ex-songs-4",
    name: "Back in Black Intro",
    description: "Learn the intro riff to 'Back in Black' by AC/DC.",
    isCustom: false,
    modules: ["Songs"],
  },
  {
    id: "ex-scales-4",
    name: "Minor Pentatonic Patterns",
    description: "Connect pentatonic boxes across the fretboard smoothly.",
    isCustom: false,
    modules: ["Scales", "Technique"],
  },
];
