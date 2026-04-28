/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChordData, SongSection } from "./types";

export const MISTY_CHORDS: Record<string, ChordData> = {
  "Gm7": { name: "Gm7", frets: [3, "x", 3, 3, 3, "x"], fingers: [1, null, 2, 3, 4, null] },
  "C7#9(b5)": { name: "C7#9(b5)", frets: ["x", 3, 4, 3, 4, "x"], fingers: [null, 1, 2, 1, 3, null], barre: 3 },
  "Fm9": { name: "Fm9", frets: [1, "x", 1, 1, 1, 3], fingers: [1, null, 1, 1, 1, 4], barre: 1 },
  "Bb13": { name: "Bb13", frets: [6, "x", 6, 7, 8, "x"], fingers: [1, null, 2, 3, 4, null] },
  "Fm7": { name: "Fm7", frets: [1, "x", 1, 1, 1, "x"], fingers: [1, null, 1, 1, 1, null], barre: 1 },
  "C7b9(#9)": { name: "C7b9(#9)", frets: ["x", 3, 2, 3, 2, "x"], fingers: [null, 2, 1, 3, 1, null] },
  "EbMA7": { name: "EbMA7", frets: ["x", 6, 8, 7, 8, "x"], fingers: [null, 1, 3, 2, 4, null] },
  "Ebc": { name: "Eb dim", frets: ["x", 6, 7, 5, 7, "x"], fingers: [null, 2, 3, 1, 4, null] },
  "Bbm7": { name: "Bbm7", frets: ["x", 1, 3, 1, 2, 1], fingers: [null, 1, 3, 1, 2, 1], barre: 1 },
  "Eb7b9": { name: "Eb7b9", frets: ["x", 6, 5, 6, 5, "x"], fingers: [null, 2, 1, 3, 1, null] },
  "Abmaj7": { name: "Abmaj7", frets: [4, "x", 5, 5, 4, "x"], fingers: [1, null, 3, 4, 2, null] },
  "Ab6": { name: "Ab6", frets: [4, "x", 3, 5, 4, "x"], fingers: [2, null, 1, 4, 3, null] },
  "Abm7": { name: "Abm7", frets: [4, "x", 4, 4, 4, "x"], fingers: [1, null, 1, 1, 1, null], barre: 4 },
  "Db13": { name: "Db13", frets: ["x", 4, 3, 4, 4, 6], fingers: [null, 2, 1, 3, 3, 4] },
  "Gb7": { name: "Gb7", frets: [2, "x", 2, 3, 2, "x"], fingers: [1, null, 2, 4, 3, null] },
  "Fm11": { name: "Fm11", frets: [1, "x", 1, 1, 1, "x"], fingers: [1, null, 1, 1, 1, null], barre: 1 },
  "E13": { name: "E13", frets: [0, 2, 0, 1, 2, 0], fingers: [null, 2, null, 1, 3, null] },
  "Bb13b5": { name: "Bb13b5", frets: [6, "x", 6, 7, 5, "x"], fingers: [2, null, 3, 4, 1, null] },
};

export const Bb13_VARIATIONS: ChordData[] = [
  { name: "Bb7", frets: [6, "x", 6, 7, 6, "x"], fingers: [1, null, 2, 4, 3, null] },
  { name: "Bb9", frets: ["x", 1, 0, 1, 1, 1], fingers: [null, 1, null, 2, 3, 4], barre: 1 },
  { name: "Bb7alt", frets: [6, "x", 6, 7, 7, "x"], fingers: [1, null, 2, 3, 4, null] },
  { name: "Bbaug", frets: ["x", 1, 0, 3, 3, "x"], fingers: [null, 1, null, 3, 4, null] },
];

export const Eb_VARIATIONS: ChordData[] = [
  { name: "Eb7", frets: ["x", 6, 5, 6, 4, "x"], fingers: [null, 3, 2, 4, 1, null] },
  { name: "Eb6", frets: ["x", 6, 5, 5, 4, "x"], fingers: [null, 4, 2, 3, 1, null] },
  { name: "Ebmaj9", frets: ["x", 6, 5, 7, 6, "x"], fingers: [null, 2, 1, 4, 3, null] },
];

export const Gm_VARIATIONS: ChordData[] = [
  { name: "Gdim7", frets: [3, "x", 2, 3, 2, "x"], fingers: [2, null, 1, 3, 1, null], barre: 2 },
  { name: "Gm7b5", frets: [3, "x", 3, 3, 2, "x"], fingers: [2, null, 3, 4, 1, null] },
  { name: "Gm6", frets: [3, "x", 2, 3, 3, "x"], fingers: [2, null, 1, 3, 4, null] },
];

export const CHORD_VARIATIONS = [
  { root: "Bb (Dominant)", chords: Bb13_VARIATIONS },
  { root: "Eb (Tonic)", chords: Eb_VARIATIONS },
  { root: "Gm (Minor)", chords: Gm_VARIATIONS },
];
export const MISTY_SONG: SongSection[] = [
  {
    title: "Intro",
    measures: [
      { chords: [{ chord: "Gm7", beats: 2 }, { chord: "C7#9(b5)", beats: 2 }] },
      { chords: [{ chord: "Fm9", beats: 2 }, { chord: "Bb13", beats: 2 }] },
      { chords: [{ chord: "Gm7", beats: 2 }, { chord: "C7b9(#9)", beats: 2 }] },
      { chords: [{ chord: "Fm7", beats: 2 }, { chord: "Bb13", beats: 2 }] },
    ]
  },
  {
    title: "Verse",
    measures: [
      { chords: [{ chord: "EbMA7", beats: 2 }, { chord: "Ebc", beats: 2 }] },
      { chords: [{ chord: "Bbm7", beats: 2 }, { chord: "Eb7b9", beats: 2 }] },
      { chords: [{ chord: "Abmaj7", beats: 2 }, { chord: "Ab6", beats: 2 }] },
      { chords: [{ chord: "Abm7", beats: 2 }, { chord: "Db13", beats: 2 }] },
    ]
  }
];
